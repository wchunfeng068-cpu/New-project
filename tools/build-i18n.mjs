#!/usr/bin/env node
/**
 * Render the existing site's translation dictionaries into crawlable static locale pages.
 * The source pages remain the content source; this script opens each source with ?lang=xx,
 * waits for its normal i18n scripts, cleans runtime-only state, and writes /zh, /es, /hi.
 * Requires Chrome (or CHROME_PATH) and uses its built-in CDP endpoint, like visual-qa.mjs.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const PORT = 8898;
const CDP_PORT = 9222;
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES = [
  { key: 'home', source: 'index.html', route: '' },
  { key: 'products', source: 'products/index.html', route: 'products' },
  { key: 'product-detail', source: 'product-detail/index.html', route: 'product-detail' },
  { key: 'solutions', source: 'solutions/index.html', route: 'solutions' },
  { key: 'market', source: 'market/index.html', route: 'market' },
  { key: 'about', source: 'about/index.html', route: 'about' },
];
const LANGS = ['en', 'zh-CN', 'es', 'hi'];
const META = {
  en: {
    home: ['TRAVELDAY | Premium B2B Luggage Supply Chain', 'TRAVELDAY, Shanghai Daicheng Industrial Co., Ltd., focuses on luggage and component supply chains, offering OEM, ODM, and supply chain solutions for global importers, wholesalers, and overseas factories.'],
    products: ['TRAVELDAY | Product Center', 'Explore TRAVELDAY luggage, components and OEM/ODM supply options for global buyers.'],
    'product-detail': ['TRAVELDAY | Product Detail', 'Review TRAVELDAY luggage specifications and request OEM, ODM or component supply support.'],
    solutions: ['TRAVELDAY | Solutions', 'One-stop luggage resource integration for importers, wholesalers and overseas factories.'],
    market: ['TRAVELDAY | Market', "Discover TRAVELDAY's global luggage supply chain coverage and regional market capabilities."],
    about: ['TRAVELDAY | Company Presence', 'TRAVELDAY company presence page showcasing team, meeting culture, and brand atmosphere.'],
  },
  zh: {
    home: ['TRAVELDAY｜高端外贸箱包 B2B 供应链官网', 'TRAVELDAY 上海戴承实业有限公司，专注行李箱及零部件供应链，为全球进口商、批发商和海外工厂提供 OEM、ODM 与供应链解决方案。'],
    products: ['TRAVELDAY｜产品中心', '浏览 TRAVELDAY 行李箱、零部件及面向全球采购商的 OEM/ODM 供应方案。'],
    'product-detail': ['TRAVELDAY｜产品详情', '查看 TRAVELDAY 行李箱产品规格，并了解 OEM、ODM 或零部件供应支持。'],
    solutions: ['TRAVELDAY｜解决方案', '为进口商、批发商和海外工厂提供一站式箱包资源整合服务。'],
    market: ['TRAVELDAY｜市场', '了解 TRAVELDAY 的全球箱包供应链覆盖与区域市场服务能力。'],
    about: ['TRAVELDAY｜公司风采', '通过团队、会谈场景与品牌内容了解 TRAVELDAY。'],
  },
  es: {
    home: ['TRAVELDAY | Cadena de suministro de equipaje B2B', 'TRAVELDAY, Shanghai Daicheng Industrial Co., Ltd., ofrece soluciones OEM, ODM y de cadena de suministro de equipaje y componentes para importadores, mayoristas y fábricas internacionales.'],
    products: ['TRAVELDAY | Centro de productos', 'Explore equipaje, componentes y opciones de suministro OEM/ODM de TRAVELDAY para compradores globales.'],
    'product-detail': ['TRAVELDAY | Detalle del producto', 'Consulte las especificaciones del equipaje TRAVELDAY y solicite soporte OEM, ODM o de componentes.'],
    solutions: ['TRAVELDAY | Soluciones', 'Integración integral de recursos de equipaje para importadores, mayoristas y fábricas internacionales.'],
    market: ['TRAVELDAY | Mercados', 'Descubra la cobertura global de la cadena de suministro de equipaje de TRAVELDAY y sus capacidades regionales.'],
    about: ['TRAVELDAY | Presencia de empresa', 'Conozca el equipo, la cultura de reuniones y la identidad de marca de TRAVELDAY.'],
  },
  hi: {
    home: ['TRAVELDAY | प्रीमियम B2B लगेज सप्लाई चेन', 'TRAVELDAY, Shanghai Daicheng Industrial Co., Ltd., वैश्विक आयातकों, थोक विक्रेताओं और विदेशी कारखानों के लिए लगेज व कंपोनेंट सप्लाई चेन, OEM और ODM समाधान प्रदान करती है।'],
    products: ['TRAVELDAY | उत्पाद केंद्र', 'वैश्विक खरीदारों के लिए TRAVELDAY लगेज, कंपोनेंट और OEM/ODM सप्लाई विकल्प देखें।'],
    'product-detail': ['TRAVELDAY | उत्पाद विवरण', 'TRAVELDAY लगेज विनिर्देश देखें और OEM, ODM या कंपोनेंट सप्लाई सहायता का अनुरोध करें।'],
    solutions: ['TRAVELDAY | समाधान', 'आयातकों, थोक विक्रेताओं और विदेशी कारखानों के लिए लगेज संसाधनों का एकीकृत समाधान।'],
    market: ['TRAVELDAY | बाज़ार', 'TRAVELDAY की वैश्विक लगेज सप्लाई चेन पहुंच और क्षेत्रीय बाज़ार क्षमताओं के बारे में जानें।'],
    about: ['TRAVELDAY | कंपनी परिचय', 'TRAVELDAY की टीम, बैठक संस्कृति और ब्रांड पहचान के बारे में जानें।'],
  },
};

const sourceFile = (page) => path.join(ROOT, page.source);
const outputFile = (page, locale) => path.join(ROOT, locale, page.route, 'index.html');
const canonicalPath = (page, locale) => `/${locale === 'en' ? '' : `${locale}/`}${page.route ? `${page.route}/` : ''}`;

function alternates(page) {
  return [
    ['en', canonicalPath(page, 'en')], ['zh-CN', canonicalPath(page, 'zh')],
    ['es', canonicalPath(page, 'es')], ['hi', canonicalPath(page, 'hi')],
    ['x-default', canonicalPath(page, 'en')],
  ];
}

function makeSnapshotExpression(locale, page) {
  const meta = META[locale][page.key];
  const htmlLang = locale === 'zh' ? 'zh-CN' : locale;
  const canonical = `https://luggage-dc.com${canonicalPath(page, locale)}`;
  const alts = alternates(page).map(([language, url]) => `<link rel="alternate" hreflang="${language}" href="https://luggage-dc.com${url}">`).join('');
  return `(() => {
    const root = document.documentElement;
    root.lang = ${JSON.stringify(htmlLang)};
    root.dataset.defaultLang = ${JSON.stringify(locale)};
    root.dataset.lang = ${JSON.stringify(locale)};
    root.classList.remove('i18n-pending', 'i18n-loading', 'reveal-ready', 'is-visible', 'dc-cookie-open');
    document.body.classList.remove('i18n-pending', 'i18n-loading', 'reveal-ready', 'is-visible', 'dc-cookie-open');
    root.removeAttribute('data-nav-ready');
    document.querySelectorAll('[data-nav-ready]').forEach(n => n.removeAttribute('data-nav-ready'));
    document.querySelectorAll('.dc-wa-fab, .dc-cookie, .dc-social').forEach(n => n.remove());
    document.querySelectorAll('[data-shell-bound], [data-language-fallback-bound], [data-inquiry-bound], [data-inquiry-standard-mounted]').forEach(n => {
      n.removeAttribute('data-shell-bound');
      n.removeAttribute('data-language-fallback-bound');
      n.removeAttribute('data-inquiry-bound');
      n.removeAttribute('data-inquiry-standard-mounted');
    });
    // shared-shell.js wraps the native select and adds a trigger/panel at runtime. Export only
    // the authored select so the generated HTML can bind the shell once on its own page load.
    document.querySelectorAll('.lang-dropdown').forEach(wrapper => {
      const select = wrapper.querySelector('select.language-select');
      if (select) {
        select.removeAttribute('data-shell-bound');
        select.removeAttribute('style');
        wrapper.replaceWith(select);
      } else wrapper.remove();
    });
    document.querySelectorAll('[class]').forEach(n => n.classList.remove('is-visible', 'reveal-ready', 'i18n-loading', 'i18n-pending'));
    document.title = ${JSON.stringify(meta[0])};
    const putMeta = (kind, key, value) => {
      let n = document.head.querySelector('meta[' + kind + '="' + key + '"]');
      if (!n) { n = document.createElement('meta'); n.setAttribute(kind, key); document.head.appendChild(n); }
      n.setAttribute('content', value);
    };
    putMeta('name', 'description', ${JSON.stringify(meta[1])});
    putMeta('property', 'og:title', ${JSON.stringify(meta[0])});
    putMeta('property', 'og:description', ${JSON.stringify(meta[1])});
    putMeta('property', 'og:url', ${JSON.stringify(canonical)});
    putMeta('name', 'twitter:title', ${JSON.stringify(meta[0])});
    putMeta('name', 'twitter:description', ${JSON.stringify(meta[1])});
    let c = document.head.querySelector('link[rel="canonical"]');
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
    c.href = ${JSON.stringify(canonical)};
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(n => n.remove());
    document.head.insertAdjacentHTML('beforeend', ${JSON.stringify(alts)});
    document.querySelectorAll('script[type="application/ld+json"]').forEach(node => {
      try { const data = JSON.parse(node.textContent); data.inLanguage = ${JSON.stringify(htmlLang)}; node.textContent = JSON.stringify(data, null, 2); } catch {}
    });
    const rootOnly = /^\\/(?:privacy|terms|thank-you|sitemap)\\.html$/;
    const localPath = (value, attr) => {
      if (!value || /^(?:#|data:|blob:|mailto:|tel:|javascript:)/i.test(value)) return value;
      try {
        const u = new URL(value, document.baseURI);
        if (!['http:', 'https:'].includes(u.protocol)) return value;
        if (u.origin !== location.origin && !/^(?:www\\.)?luggage-dc\\.com$/i.test(u.hostname)) return value;
        let p = u.pathname.replace(/^\\/(?:zh|es|hi)(?=\\/|$)/, '') || '/';
        if (attr === 'href' && !rootOnly.test(p) && !/\\.(?:css|js|xml|png|jpe?g|webp|svg|ico|pdf|mp4|woff2?)$/i.test(p)) {
          if (/\\/index\\.html$/.test(p)) p = p.replace(/index\\.html$/, '');
          if (!p.endsWith('/') && !/\\.[a-z0-9]+$/i.test(p)) p += '/';
          p = ${JSON.stringify(locale === 'en' ? '' : `/${locale}`)} + (p === '/' ? '/' : p);
        }
        return p + u.search + u.hash;
      } catch { return value; }
    };
    document.querySelectorAll('*').forEach(el => {
      for (const attr of ['src','href','poster','action','data-src','data-original-src','data-image-src','data-lazy-image','data-lazy-background','data-lazy-background-webp','data-poster']) {
        if (attr === 'href' && el.matches('link[rel="canonical"], link[rel="alternate"][hreflang]')) continue;
        if (el.hasAttribute(attr)) el.setAttribute(attr, localPath(el.getAttribute(attr), attr === 'href' ? 'href' : 'asset'));
      }
      for (const attr of ['srcset']) if (el.hasAttribute(attr)) {
        const value = el.getAttribute(attr).split(',').map(part => {
          const bits = part.trim().split(/\\s+/); bits[0] = localPath(bits[0], 'asset'); return bits.join(' ');
        }).join(', ');
        el.setAttribute(attr, value);
      }
      if (el.hasAttribute('style')) el.setAttribute('style', el.getAttribute('style').replace(/url\\((['"]?)(\\.{1,2}\\/[^)'\"]+)\\1\\)/g, (m, q, p) => 'url(' + q + localPath(p, 'asset') + q + ')'));
    });
    // The company team carousel falls back to PNG on an image-load race; preserve its authored
    // optimized WebP source in the static snapshot, while retaining the original PNG fallback.
    document.querySelectorAll('img[data-original-src*="/images/team-members/"]').forEach(img => {
      const original = img.getAttribute('data-original-src');
      img.setAttribute('src', original.replace('/images/team-members/', '/images/optimized/team-members/').replace(/\\.png$/i, '.webp'));
    });
    document.querySelectorAll('style').forEach(style => {
      style.textContent = style.textContent.replace(/url\\((['"]?)(\\.{1,2}\\/[^)'\"]+)\\1\\)/g, (m, q, p) => 'url(' + q + localPath(p, 'asset') + q + ')');
    });
    const originals = window.__originalInlineStyles;
    document.querySelectorAll('[style]').forEach(el => {
      if (!originals || !originals.has(el)) return;
      const initial = originals.get(el);
      if (initial === null) el.removeAttribute('style'); else el.setAttribute('style', initial);
    });
    // Keep image variables required by the existing gallery/catalog rendering, while removing
    // only script-added typographic tuning that is recalculated by the site's own JS on load.
    document.querySelectorAll('[style]').forEach(el => {
      for (const prop of ['min-height']) el.style.removeProperty(prop);
      if (!el.getAttribute('style')?.trim()) el.removeAttribute('style');
    });
    return ('<!doctype html>\\n' + root.outerHTML).replace(/[ \\t]+(?=\\n)/g, '');
  })()`;
}

async function connect() {
  const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const page = list.find((t) => t.type === 'page');
  if (!page) throw new Error(`Chrome CDP ${CDP_PORT} has no page target`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
    }
  };
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params }));
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
    const original = new WeakMap(); window.__originalInlineStyles = original;
    new MutationObserver(records => records.forEach(r => {
      if (r.type === 'attributes' && r.attributeName === 'style' && !original.has(r.target)) original.set(r.target, r.oldValue);
    })).observe(document, {subtree:true, attributes:true, attributeOldValue:true, attributeFilter:['style']});
  })()` });
  return { ws, send };
}

async function waitForPage(send, url) {
  await send('Page.navigate', { url });
  for (let i = 0; i < 80; i++) {
    await new Promise(r => setTimeout(r, 250));
    const result = await send('Runtime.evaluate', { expression: `document.readyState === 'complete' && (document.documentElement.dataset.navReady === 'true' || document.title.includes('TRAVELDAY'))`, returnByValue: true });
    if (result.result?.value) break;
  }
  await new Promise(r => setTimeout(r, 600));
}

function patchEnglishAlternates(html, page) {
  const tags = alternates(page).map(([lang, route]) => `    <link rel="alternate" hreflang="${lang}" href="https://luggage-dc.com${route}" />`).join('\n');
  const cleaned = html.replace(/\s*<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*\/?\s*>/gi, '');
  return cleaned.replace(/(<link\s+rel=["']canonical["'][^>]*\/?\s*>)/i, `$1\n${tags}`);
}

function makeSitemap() {
  const rows = [];
  for (const page of PAGES) {
    rows.push(`  <url>\n    <loc>https://luggage-dc.com${canonicalPath(page, 'en')}</loc>`);
    for (const [lang, route] of alternates(page)) {
      if (lang === 'x-default') continue;
      rows[rows.length - 1] += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="https://luggage-dc.com${route}" />`;
    }
    rows[rows.length - 1] += '\n  </url>';
    for (const locale of ['zh', 'es', 'hi']) {
      rows.push(`  <url>\n    <loc>https://luggage-dc.com${canonicalPath(page, locale)}</loc>`);
      for (const [lang, route] of alternates(page)) {
        if (lang === 'x-default') continue;
        rows[rows.length - 1] += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="https://luggage-dc.com${route}" />`;
      }
      rows[rows.length - 1] += '\n  </url>';
    }
  }
  for (const file of ['privacy.html', 'terms.html']) rows.push(`  <url><loc>https://luggage-dc.com/${file}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
}

async function main() {
  let server; let chrome; let ws;
  try {
    server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
    let serving = false;
    for (let i = 0; i < 40; i++) { try { serving = (await fetch(`${BASE}/index.html`, { method: 'HEAD' })).ok; } catch {} if (serving) break; await new Promise(r => setTimeout(r, 200)); }
    if (!serving) throw new Error('static preview server did not start');
    try { await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`); }
    catch {
      if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}; start Chrome with remote debugging or set CHROME_PATH`);
      chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--no-sandbox',`--remote-debugging-port=${CDP_PORT}`,'--user-data-dir=/tmp/i18n-cdp-profile','about:blank'], { stdio: 'ignore' });
      for (let i = 0; i < 40; i++) { try { await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`); break; } catch {} await new Promise(r => setTimeout(r, 250)); }
    }
    const c = await connect(); ws = c.ws;
    const generated = new Map();
    for (const locale of ['zh', 'es', 'hi']) {
      for (const page of PAGES) {
        const sourcePath = page.key === 'home' ? '/index.html' : `/${page.source.replace(/index\.html$/, '')}`;
        const query = `?lang=${locale}&__i18n_build=1${page.key === 'product-detail' ? '&product=abs-pc-zipper-luggage' : ''}`;
        await waitForPage(c.send, `${BASE}${sourcePath}${query}`);
        const result = await c.send('Runtime.evaluate', { expression: makeSnapshotExpression(locale, page), returnByValue: true });
        const html = result.result?.value;
        if (typeof html !== 'string' || !html.includes(`hreflang="x-default"`)) throw new Error(`render failed: ${locale}/${page.key}`);
        generated.set(outputFile(page, locale), html + '\n');
        console.log(`[i18n] ${locale}/${page.key}`);
      }
    }
    let stale = 0;
    for (const [file, html] of generated) {
      if (CHECK) {
        const actual = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
        if (actual !== html) {
          let at = 0; while (at < actual.length && at < html.length && actual[at] === html[at]) at++;
          console.error(`[i18n] stale generated page: ${path.relative(ROOT, file)} (first difference near byte ${at})`);
          console.error(`  current: ${JSON.stringify(actual.slice(Math.max(0, at - 50), at + 120))}`);
          console.error(`  expected: ${JSON.stringify(html.slice(Math.max(0, at - 50), at + 120))}`);
          stale++;
        }
      } else {
        fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html);
      }
    }
    for (const page of PAGES) {
      const file = sourceFile(page); const html = fs.readFileSync(file, 'utf8');
      const next = patchEnglishAlternates(html, page);
      if (CHECK) {
        if (!/hreflang=["']x-default["']/.test(html)) { console.error(`[i18n] English alternates missing: ${page.source}`); stale++; }
      } else if (next !== html) fs.writeFileSync(file, next);
    }
    const sitemap = makeSitemap();
    const sitemapPath = path.join(ROOT, 'sitemap.xml');
    if (CHECK) { if (fs.readFileSync(sitemapPath, 'utf8') !== sitemap) { console.error('[i18n] sitemap.xml is stale'); stale++; } }
    else fs.writeFileSync(sitemapPath, sitemap);
    if (stale) process.exitCode = 1;
    else console.log(CHECK ? '[i18n] generated pages and sitemap are current' : '[i18n] generated locale pages, English alternates, and sitemap');
  } finally {
    try { ws?.close(); } catch {} try { server?.kill(); } catch {} try { chrome?.kill(); } catch {}
  }
}

main().catch(error => { console.error(`[i18n] ${error.message}`); process.exitCode = 2; });
