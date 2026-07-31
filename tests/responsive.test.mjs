import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

const root = path.resolve(process.cwd());

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const browserPath = edgeCandidates.find((candidate) => {
  try {
    return candidate && existsSync(candidate);
  } catch {
    return false;
  }
});

assert.ok(browserPath, 'No compatible Chromium browser was found for responsive testing.');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
};

const server = http.createServer(async (req, res) => {
  try {
    const incomingUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const requestPath = incomingUrl.pathname === '/' ? '/index.html' : incomingUrl.pathname;
    const resolvedPath = path.normalize(path.join(root, requestPath));

    if (!resolvedPath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const file = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(file);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const listen = () =>
  new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
          return;
        }
        pending.resolve(message.result);
        return;
      }

      if (!message.method) return;
      const queue = this.listeners.get(message.method);
      if (queue && queue.length) {
        const next = queue.shift();
        next(message.params || {});
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    const payload = JSON.stringify({ id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);
    });
  }

  waitFor(method) {
    return new Promise((resolve) => {
      const queue = this.listeners.get(method) || [];
      queue.push(resolve);
      this.listeners.set(method, queue);
    });
  }

  async close() {
    if (!this.ws) return;
    this.ws.close();
    await delay(100);
  }
}

const fetchJson = async (url, attempts = 150) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // wait for browser boot
    }
    await delay(150);
  }
  throw new Error(`Unable to fetch ${url}`);
};

const approxEqual = (actual, expected, tolerance, label) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected} ±${tolerance}, got ${actual}`,
  );
};

const evaluateJson = async (client, expression) => {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result.value;
};

const main = async () => {
  const port = await listen();
  const tempProfile = await fs.mkdtemp(path.join(os.tmpdir(), 'traveld-resp-'));
  const browser = spawn(
    browserPath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-port=9222',
      `--user-data-dir=${tempProfile}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  try {
    const targets = await fetchJson('http://127.0.0.1:9222/json/list');
    const pageTarget = targets.find((target) => target.type === 'page');
    assert.ok(pageTarget?.webSocketDebuggerUrl, 'Unable to find a debuggable browser page.');

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const loadScenario = async ({ width, height, lang }) => {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width <= 640,
      });

      const loadEvent = client.waitFor('Page.loadEventFired');
      await client.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
      await loadEvent;
      await delay(200);
      await client.send('Runtime.evaluate', {
        expression: `window.setSiteLanguage(${JSON.stringify(lang)})`,
        awaitPromise: true,
      });
      await delay(120);

      return evaluateJson(
        client,
        `(() => {
          const rect = (selector) => {
            const node = document.querySelector(selector);
            if (!node) return null;
            const box = node.getBoundingClientRect();
            return {
              top: Math.round(box.top),
              left: Math.round(box.left),
              width: Math.round(box.width),
              height: Math.round(box.height),
            };
          };
          const gridCols = (selector) => {
            const node = document.querySelector(selector);
            if (!node) return 0;
            return getComputedStyle(node).gridTemplateColumns.split(/\\s+/).filter(Boolean).length;
          };
          const hero = rect('.hero');
          const stats = rect('.hero-stats');
          const products = rect('#products');
          const title = rect('.hero h1');
          const play = rect('.play-button');
          const video = rect('.video-section');
          const player = document.querySelector('[data-video-player]');
          return {
            activeLang: document.querySelector('.language-select')?.value,
            fixedDesktopMode: document.body.classList.contains('fixed-desktop-stage'),
            desktopScale: parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue('--desktop-scale') || '1',
            ),
            pageShellWidth: rect('.page-shell')?.width || 0,
            pageShellCanvasWidth: parseFloat(getComputedStyle(document.querySelector('.page-shell'))?.width || '0'),
            heroHeight: hero?.height || 0,
            statsTop: stats?.top || 0,
            productsTop: products?.top || 0,
            titleHeight: title?.height || 0,
            heroCols: gridCols('.hero'),
            productCols: gridCols('.product-grid'),
            serviceCols: gridCols('.service-grid'),
            whyCols: gridCols('.why-grid'),
            heroStatsCols: gridCols('.hero-stats'),
            statsCols: gridCols('.stats-band dl'),
            contactCols: gridCols('.contact-card'),
            mobileMenuVisible: getComputedStyle(document.querySelector('.mobile-menu-button')).display !== 'none',
            scrollOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
            playCenterOffset: play && video
              ? Math.round((play.left + play.width / 2) - (video.left + video.width / 2))
              : 0,
            videoMuted: player ? player.muted : null,
          };
        })()`,
      );
    };

    const assertStableForViewport = async (viewport) => {
      const languages = ['zh', 'en', 'es', 'hi'];
      const results = [];
      for (const lang of languages) {
        const metrics = await loadScenario({ ...viewport, lang });
        assert.equal(metrics.activeLang, lang, `Language selector did not switch to ${lang}.`);
        assert.ok(metrics.scrollOverflow <= 1, `Unexpected horizontal overflow at ${viewport.width}x${viewport.height} for ${lang}.`);
        results.push(metrics);
      }

      const baseline = results[0];
      for (const metrics of results.slice(1)) {
        approxEqual(metrics.heroHeight, baseline.heroHeight, 1, `Hero height mismatch at ${viewport.width}x${viewport.height}`);
        approxEqual(metrics.statsTop, baseline.statsTop, 1, `Stats top mismatch at ${viewport.width}x${viewport.height}`);
        approxEqual(metrics.productsTop, baseline.productsTop, 1, `Products top mismatch at ${viewport.width}x${viewport.height}`);
      }

      return baseline;
    };

    await assertStableForViewport({ width: 1440, height: 900 });
    await assertStableForViewport({ width: 1280, height: 800 });
    await assertStableForViewport({ width: 768, height: 1024 });
    await assertStableForViewport({ width: 390, height: 844 });

    const desktop = await loadScenario({ width: 1440, height: 900, lang: 'en' });
    assert.equal(desktop.fixedDesktopMode, false, 'Large desktop should use the normal desktop layout.');
    assert.equal(desktop.mobileMenuVisible, false, 'Large desktop should keep the full navigation visible.');
    assert.equal(desktop.heroCols, 2, 'Large desktop Hero should remain a two-column layout.');
    assert.equal(desktop.productCols, 3, 'Large desktop product grid should render in three columns.');
    assert.equal(desktop.serviceCols, 3, 'Large desktop service grid should render in three columns.');
    assert.equal(desktop.whyCols, 3, 'Large desktop advantage grid should render in three columns.');
    assert.equal(desktop.heroStatsCols, 4, 'Large desktop hero stats should render in four columns.');
    assert.equal(desktop.statsCols, 4, 'Large desktop stats band should render in four columns.');
    assert.equal(desktop.contactCols, 3, 'Large desktop contact section should remain three columns.');
    approxEqual(desktop.playCenterOffset, 0, 1, 'Large desktop video play button should stay centered.');

    const desktopScaled = await loadScenario({ width: 1280, height: 800, lang: 'en' });
    assert.equal(desktopScaled.fixedDesktopMode, true, '1280px viewport should switch into fixed desktop scaling mode.');
    assert.equal(desktopScaled.mobileMenuVisible, false, 'Fixed desktop scaling should keep the desktop navigation visible.');
    assert.equal(desktopScaled.heroCols, 2, 'Scaled desktop Hero should remain a two-column layout.');
    assert.equal(desktopScaled.productCols, 3, 'Scaled desktop product grid should remain three columns.');
    assert.equal(desktopScaled.serviceCols, 3, 'Scaled desktop service grid should remain three columns.');
    assert.equal(desktopScaled.whyCols, 3, 'Scaled desktop advantage grid should remain three columns.');
    assert.equal(desktopScaled.heroStatsCols, 4, 'Scaled desktop hero stats should remain four columns.');
    assert.equal(desktopScaled.statsCols, 4, 'Scaled desktop stats band should remain four columns.');
    assert.equal(desktopScaled.contactCols, 3, 'Scaled desktop contact section should remain three columns.');
    assert.equal(desktopScaled.pageShellCanvasWidth, 1500, 'Scaled desktop canvas should keep the fixed desktop width.');
    assert.ok(desktopScaled.desktopScale < 1 && desktopScaled.desktopScale > 0.8, '1280px viewport should scale the desktop canvas down slightly.');
    approxEqual(desktopScaled.playCenterOffset, 0, 1, 'Scaled desktop video play button should stay centered.');

    const tablet = await loadScenario({ width: 768, height: 1024, lang: 'en' });
    assert.equal(tablet.fixedDesktopMode, true, 'Tablet should use fixed desktop scaling mode.');
    assert.equal(tablet.mobileMenuVisible, false, 'Tablet should keep the desktop navigation visible in fixed scaling mode.');
    assert.equal(tablet.heroCols, 2, 'Tablet Hero should stay in desktop two-column mode.');
    assert.equal(tablet.productCols, 3, 'Tablet product grid should stay in desktop three-column mode.');
    assert.equal(tablet.serviceCols, 3, 'Tablet service grid should stay in desktop three-column mode.');
    assert.equal(tablet.whyCols, 3, 'Tablet advantage grid should stay in desktop three-column mode.');
    assert.equal(tablet.heroStatsCols, 4, 'Tablet hero stats should stay in desktop four-column mode.');
    assert.equal(tablet.statsCols, 4, 'Tablet stats band should stay in desktop four-column mode.');
    assert.equal(tablet.contactCols, 3, 'Tablet contact section should stay in desktop three-column mode.');
    assert.equal(tablet.pageShellCanvasWidth, 1500, 'Tablet should still render the fixed desktop canvas width.');
    assert.ok(tablet.desktopScale < desktopScaled.desktopScale && tablet.desktopScale > 0.45, 'Tablet should scale the desktop canvas further down while keeping proportions.');
    approxEqual(tablet.playCenterOffset, 0, 1, 'Tablet video play button should stay centered.');

    const phone = await loadScenario({ width: 390, height: 844, lang: 'en' });
    assert.equal(phone.fixedDesktopMode, true, 'Phone should use fixed desktop scaling mode.');
    assert.equal(phone.mobileMenuVisible, false, 'Phone should keep the desktop navigation visible in fixed scaling mode.');
    assert.equal(phone.heroCols, 2, 'Phone Hero should stay in desktop two-column mode.');
    assert.equal(phone.productCols, 3, 'Phone product grid should stay in desktop three-column mode.');
    assert.equal(phone.serviceCols, 3, 'Phone service grid should stay in desktop three-column mode.');
    assert.equal(phone.whyCols, 3, 'Phone advantage grid should stay in desktop three-column mode.');
    assert.equal(phone.heroStatsCols, 4, 'Phone hero stats should stay in desktop four-column mode.');
    assert.equal(phone.statsCols, 4, 'Phone stats band should stay in desktop four-column mode.');
    assert.equal(phone.contactCols, 3, 'Phone contact section should stay in desktop three-column mode.');
    assert.equal(phone.pageShellCanvasWidth, 1500, 'Phone should still render the fixed desktop canvas width.');
    assert.ok(phone.desktopScale < tablet.desktopScale && phone.desktopScale > 0.2, 'Phone should scale the desktop canvas down the furthest.');
    approxEqual(phone.playCenterOffset, 0, 1, 'Phone video play button should stay centered.');

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const loadEvent = client.waitFor('Page.loadEventFired');
    await client.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await loadEvent;
    await delay(200);
    await client.send('Runtime.evaluate', { expression: `window.setSiteLanguage('en')`, awaitPromise: true });
    await client.send('Runtime.evaluate', { expression: `document.querySelector('[data-open-video]').click()` });
    await delay(250);
    const videoState = await evaluateJson(
      client,
      `(() => {
        const modal = document.querySelector('[data-video-modal]');
        const player = document.querySelector('[data-video-player]');
        return {
          isOpen: modal?.classList.contains('is-open') || false,
          muted: player?.muted ?? null,
        };
      })()`,
    );
    assert.equal(videoState.isOpen, true, 'Video modal should open when the trigger is clicked.');
    assert.equal(videoState.muted, false, 'Video should keep original sound enabled.');

    await client.close();
  } finally {
    browser.kill();
    try {
      await once(browser, 'exit');
    } catch {
      // ignore cleanup race
    }
    await new Promise((resolve) => server.close(resolve));
    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        await fs.rm(tempProfile, { recursive: true, force: true });
        break;
      } catch (error) {
        if (!error || (error.code !== 'EBUSY' && error.code !== 'EPERM')) {
          throw error;
        }
        await delay(250);
      }
    }
  }
};

await main();
console.log('responsive tests passed');
