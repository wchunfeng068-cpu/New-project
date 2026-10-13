#!/usr/bin/env node
/**
 * 发布前自动视觉体检 (pre-deploy visual QA)
 *
 * 用法:
 *   node scripts/visual-qa.mjs            # 检查回归 (默认)
 *   node scripts/visual-qa.mjs baseline   # 采集基线 (截图 + 指标 JSON)
 *   node scripts/visual-qa.mjs --url http://127.0.0.1:8899
 *
 * 行为:
 *   1. 在「项目根」起一个静态服务器 (端口 8899)，跑完自动回收。
 *   2. 遍历 pages × widths，用 CDP (Chrome 远程调试 9222) 截图 + 测 DOM。
 *   3. 计算关键不变量，和基线比对；有回归则退出码 1。
 *
 * 拦截的回归类型:
 *   - 横向溢出 (scrollWidth > clientWidth)
 *   - 小热区 (可点元素 < 32px) 新增
 *   - 桌面导航与语言/报价按钮重叠 (981px 以上)
 *   - HERO 文字错位 (文字块中心跑到 HERO 右半边)
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'qa-baseline');
const PORT = 8899;
const URL = process.env.QA_URL || `http://127.0.0.1:${PORT}`;
const MODE = process.argv.includes('baseline') ? 'baseline' : 'check';
const CDP_PORT = 9222;

const PAGES = [
  { file: 'index.html', name: 'home' },
  { file: 'mockups/product-center-preview.html', name: 'product-center' },
  { file: 'mockups/solution-preview.html', name: 'solution' },
  { file: 'mockups/company-presence-preview.html', name: 'company' },
  { file: 'mockups/market-preview.html', name: 'market' },
  { file: 'mockups/product-detail-preview.html', name: 'product-detail' },
  { file: 'privacy.html', name: 'privacy' },
  { file: 'terms.html', name: 'terms' },
  { file: 'thank-you.html', name: 'thank-you' },
];
const WIDTHS = [1440, 1280, 980, 390];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PYTHON = fs.existsSync('/Users/a1/.workbuddy/binaries/python/versions/3.13.12/bin/python3')
  ? '/Users/a1/.workbuddy/binaries/python/versions/3.13.12/bin/python3'
  : 'python3';

/** 在指定宽度下取一页的指标 + 截图 */
async function measurePage(ws, send, file, width, name, shotPath) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height: 900, deviceScaleFactor: 1, mobile: width <= 700,
  });
  await send('Page.navigate', { url: `${URL}/${file}` });
  // 等 readyState=complete (轮询，最多 ~8s)
  let ready = false;
  for (let i = 0; i < 32; i++) {
    await sleep(250);
    const st = await send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
    if (st.result && st.result.value === 'complete') { ready = true; break; }
  }
  await sleep(800);

  const EXPR = `(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width),
        h: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) }; };
    const small = [];
    document.querySelectorAll('a,button,[role=button],input,select,summary').forEach((el2) => {
      const r = el2.getBoundingClientRect(); const cs = getComputedStyle(el2);
      if (!r.width || !r.height) return;
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
      if (r.height < 32 || r.width < 32)
        small.push({ tag: el2.tagName.toLowerCase(), cls: String(el2.className).slice(0, 40),
          w: Math.round(r.width), h: Math.round(r.height), text: (el2.textContent || '').trim().slice(0, 20) });
    });
    const navB = box(document.querySelector('.primary-nav'));
    const haB = box(document.querySelector('.header-actions'));
    const heroB = box(document.querySelector('.hero'));
    const hcB = box(document.querySelector('.hero-content'));
    return JSON.stringify({ vw, sw, small, navB, haB, heroB, hcB });
  })()`;

  const r = await send('Runtime.evaluate', { expression: EXPR, returnByValue: true });
  let m;
  try { m = JSON.parse(r.result.value); } catch (e) { m = null; }
  if (!m) return { ok: false, reason: 'JS eval failed' };

  if (shotPath) {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
  }

  // 派生不变量
  const overflow = m.sw > m.vw + 1;
  const navOverlap = m.vw >= 981 && m.navB && m.haB && m.navB.right > m.haB.left - 2;
  const heroLeft = (m.vw >= 981 && m.hcB && m.heroB)
    ? (m.hcB.x + m.hcB.w / 2) < (m.heroB.x + m.heroB.w / 2)
    : null;
  const smallKey = (s) => `${s.tag}.${s.cls} ${s.w}x${s.h} "${s.text}"`;

  return {
    ok: true,
    vw: m.vw, sw: m.sw, overflow, navOverlap, heroLeft,
    small: m.small.map(smallKey),
  };
}

/** 连 CDP，返回 { send } */
async function connectCDP() {
  const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const page = list.find((t) => t.type === 'page');
  if (!page) throw new Error('no page target on CDP port ' + CDP_PORT);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  };
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  return { ws, send };
}

/** 起静态服务器，返回子进程 (用完 kill) */
function startServer() {
  const p = spawn(PYTHON, ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'],
    { cwd: ROOT, stdio: 'ignore' });
  return p;
}

async function waitServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`${URL}/index.html`, { method: 'HEAD' });
      if (r.ok) return true;
    } catch (e) { /* retry */ }
    await sleep(250);
  }
  return false;
}

function loadBaseline() {
  const f = path.join(OUT, 'baseline.json');
  if (!fs.existsSync(f)) return null;
  return JSON.parse(fs.readFileSync(f, 'utf-8'));
}

function saveBaseline(data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'baseline.json'), JSON.stringify(data, null, 2));
}

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** 确保 CDP 可用：若 9222 已开则复用，否则自起 headless Chrome；返回子进程或 null(复用) */
async function ensureChrome() {
  try {
    const r = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
    if (r.ok) return null;
  } catch (e) { /* 没开，下面自起 */ }
  if (!fs.existsSync(CHROME)) {
    console.error('[visual-qa] Chrome 未找到，且 9222 无调试端口，无法自动运行');
    return 'no-chrome';
  }
  const c = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--remote-debugging-port=${CDP_PORT}`, '--user-data-dir=/tmp/qa-cdp-profile',
    'about:blank',
  ], { stdio: 'ignore' });
  for (let i = 0; i < 40; i++) {
    await sleep(250);
    try {
      const r = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (r.ok) return c;
    } catch (e) { /* retry */ }
  }
  return 'no-chrome';
}

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  console.log(`[visual-qa] mode=${MODE} root=${ROOT} url=${URL}`);

  let server, managedChrome, ws;
  try {
    server = startServer();
    const up = await waitServer();
    if (!up) { console.error('[visual-qa] static server failed to start'); process.exit(2); }

    const chrome = await ensureChrome();
    if (chrome === 'no-chrome') { process.exit(2); }
    managedChrome = chrome; // 非 null 表示我们自起的，结束后要杀

    const conn = await connectCDP();
    ws = conn.ws;
    const send = conn.send;
    const results = {};

    for (const page of PAGES) {
      results[page.name] = {};
      for (const width of WIDTHS) {
        const shotPath = path.join(OUT, `${page.name}@${width}.png`);
        const m = await measurePage(ws, send, page.file, width, page.name, shotPath);
        results[page.name][width] = m;
        const tag = m.ok ? (m.overflow ? 'OVERFLOW' : 'ok') : 'FAIL';
        console.log(`  ${page.name} @${width} -> ${tag}`);
      }
    }

    if (MODE === 'baseline') {
      saveBaseline(results);
      console.log(`[visual-qa] baseline saved -> ${path.join(OUT, 'baseline.json')}`);
      console.log(`[visual-qa] screenshots -> ${OUT}/*.png`);
      process.exit(0);
    }

    // ---- check 模式: 比对基线 ----
    const base = loadBaseline();
    if (!base) {
      console.error('[visual-qa] no baseline found. run: node scripts/visual-qa.mjs baseline');
      process.exit(2);
    }
    const regressions = [];
    for (const page of PAGES) {
      for (const width of WIDTHS) {
        const cur = results[page.name]?.[width];
        const old = base[page.name]?.[width];
        if (!cur || !cur.ok) { regressions.push(`${page.name}@${width}: 测量失败`); continue; }
        if (cur.overflow) regressions.push(`${page.name}@${width}: 横向溢出 (${cur.sw}>${cur.vw})`);
        if (cur.navOverlap) regressions.push(`${page.name}@${width}: 桌面导航与右侧按钮重叠`);
        if (cur.heroLeft === false) regressions.push(`${page.name}@${width}: HERO 文字错位(跑到右半边)`);
        if (old && Array.isArray(old.small)) {
          for (const s of cur.small) if (!old.small.includes(s))
            regressions.push(`${page.name}@${width}: 新增小热区 ${s}`);
        }
      }
    }

    if (regressions.length) {
      console.error('\n[visual-qa] ❌ 发现回归，阻止发布:');
      for (const r of regressions) console.error('  - ' + r);
      process.exit(1);
    }
    console.log('\n[visual-qa] ✅ 无回归，可以发布');
    process.exit(0);
  } finally {
    try { if (ws) ws.close(); } catch (e) {}
    try { if (server) server.kill(); } catch (e) {}
    try { if (managedChrome) managedChrome.kill(); } catch (e) {}
    // 顺手清掉可能残留的端口占用
  }
}

main().catch((e) => { console.error('[visual-qa] ERR', e.message); process.exit(2); });
