#!/usr/bin/env node
/** Local browser interaction checks for localized routes; FormSubmit is always intercepted. */
import { spawn } from 'node:child_process';

const PORT = 8896;
const CDP_PORT = 9222;
const BASE = `http://127.0.0.1:${PORT}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect() {
  const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const target = targets.find((item) => item.type === 'page');
  if (!target) throw new Error('No Chrome page available on CDP port 9222');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const p = pending.get(message.id);
    pending.delete(message.id);
    message.error ? p.reject(new Error(JSON.stringify(message.error))) : p.resolve(message.result);
  };
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    ws.send(JSON.stringify({ id: requestId, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      if (String(input).includes('formsubmit.co')) {
        window.__formsubmitIntercepted = true;
        window.sessionStorage.setItem('__formsubmitIntercepted', 'true');
        return new Response('{"success":true}', { status: 200, headers: { 'content-type': 'application/json' } });
      }
      return originalFetch(input, init);
    };
  })()` });
  return { ws, send };
}

async function navigate(send, pathname) {
  await send('Page.navigate', { url: `${BASE}${pathname}` });
  for (let i = 0; i < 60; i++) {
    await sleep(250);
    const result = await send('Runtime.evaluate', { expression: `document.readyState === 'complete' && location.pathname`, returnByValue: true });
    if (result.result?.value === pathname.replace(/\/$/, '') + (pathname.endsWith('/') ? '' : '')) break;
    if (result.result?.value === pathname) break;
  }
  await sleep(500);
}

async function evalValue(send, expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'browser evaluation failed');
  return result.result?.value;
}

async function main() {
  let server; let ws;
  try {
    server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: process.cwd(), stdio: 'ignore' });
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`${BASE}/index.html`, { method: 'HEAD' })).ok) break; } catch {} await sleep(250); }
    const c = await connect(); ws = c.ws;
    await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

    await navigate(c.send, '/es/about/');
    const language = await evalValue(c.send, `(() => { window.setSiteLanguage('zh'); return true; })()`);
    if (!language) throw new Error('language switcher did not run');
    for (let i = 0; i < 40; i++) { await sleep(250); const p = await evalValue(c.send, 'location.pathname'); if (p === '/zh/about/') break; }
    const switchedPath = await evalValue(c.send, 'location.pathname');
    console.log(`language switch /es/about/ → ${switchedPath} ${switchedPath === '/zh/about/' ? 'PASS' : 'FAIL'}`);
    if (switchedPath !== '/zh/about/') process.exitCode = 1;

    await navigate(c.send, '/zh/');
    const productHref = await evalValue(c.send, `document.querySelector('.primary-nav a:nth-child(2)')?.getAttribute('href')`);
    console.log(`Chinese Products navigation href=${productHref} ${productHref === '/zh/products/' ? 'PASS' : 'FAIL'}`);
    if (productHref !== '/zh/products/') process.exitCode = 1;
    await evalValue(c.send, `document.querySelector('.primary-nav a:nth-child(2)')?.click()`);
    for (let i = 0; i < 40; i++) { await sleep(250); const p = await evalValue(c.send, 'location.pathname'); if (p === '/zh/products/') break; }
    const productPath = await evalValue(c.send, 'location.pathname');
    console.log(`Chinese Products navigation opens ${productPath} ${productPath === '/zh/products/' ? 'PASS' : 'FAIL'}`);
    if (productPath !== '/zh/products/') process.exitCode = 1;

    await navigate(c.send, '/es/');
    await evalValue(c.send, `sessionStorage.removeItem('__formsubmitIntercepted')`);
    await evalValue(c.send, `(() => { const f=document.querySelector('.inquiry-form'); if(!f) throw new Error('form not found'); f.querySelector('[name="name"]').value='QA'; f.querySelector('[name="email"]').value='qa@example.com'; f.querySelector('[name="message"]').value='No email should be sent'; f.requestSubmit(); return true; })()`);
    for (let i = 0; i < 60; i++) { await sleep(250); const p = await evalValue(c.send, 'location.pathname'); if (p === '/thank-you.html') break; }
    const thankPath = await evalValue(c.send, 'location.pathname');
    const intercepted = await evalValue(c.send, `sessionStorage.getItem('__formsubmitIntercepted') === 'true'`);
    console.log(`Spanish inquiry intercepted=${intercepted}, return=${thankPath} ${intercepted && thankPath === '/thank-you.html' ? 'PASS' : 'FAIL'}`);
    if (!intercepted || thankPath !== '/thank-you.html') process.exitCode = 1;
  } finally {
    try { ws?.close(); } catch {}
    try { server?.kill(); } catch {}
  }
}

main().catch((error) => { console.error(`[i18n-interaction-qa] ${error.message}`); process.exitCode = 2; });
