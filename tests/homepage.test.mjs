import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd());
const indexPath = path.join(root, 'index.html');
const stylesPath = path.join(root, 'styles.css');
const scriptPath = path.join(root, 'script.js');
const shellPath = path.join(root, 'src/shell.js');

const indexHtml = await fs.readFile(indexPath, 'utf8');
const stylesCss = await fs.readFile(stylesPath, 'utf8');
const scriptJs = await fs.readFile(scriptPath, 'utf8');
const shellJs = await fs.readFile(shellPath, 'utf8');

const requiredAssets = [
  'images/series-luggage.jpg',
  'images/series-handle.jpg',
  'images/series-wheels.jpg',
  'images/series-production.jpg',
  'images/server-map.jpg',
];

for (const asset of requiredAssets) {
  await fs.access(path.join(root, asset));
}

assert.match(indexHtml, /data-section="series"/);
assert.match(indexHtml, /data-section="showcase"/);
assert.match(indexHtml, /data-section="production"/);
assert.match(indexHtml, /data-section="why"/);
assert.ok(!indexHtml.includes('data-section="market"'));
assert.ok(!indexHtml.includes('data-section="news"'));

assert.match(indexHtml, /Luggage Series/);
assert.match(indexHtml, /Covering carry-ons, checked luggage, wholesale, and private-label projects\./);
assert.match(indexHtml, /Luggage Handles/);
assert.match(indexHtml, /For business bags and travel bags with functional and professional appeal\./);
assert.match(indexHtml, /Luggage Wheels/);
assert.match(indexHtml, /Solutions for briefcases, totes, and premium business carrying needs\./);
assert.ok(!indexHtml.includes('class="series-index"'));

const productionStart = indexHtml.indexOf('data-section="production"');
const productionEnd = indexHtml.indexOf('<section class="market-panel card"', productionStart);
const productionSection = indexHtml.slice(productionStart, productionEnd > -1 ? productionEnd : undefined);

assert.ok(productionSection.includes('data-i18n="productionTitle"'));
assert.ok(!productionSection.includes('series-copy'));

assert.match(stylesCss, /\.series-banner\s*\{[\s\S]*?position:\s*relative;/);
assert.match(stylesCss, /\.series-copy\s*\{[\s\S]*?inset:\s*0 auto 0 0;/);
assert.match(stylesCss, /\.series-copy\s*\{[\s\S]*?justify-content:\s*center;/);
assert.match(stylesCss, /\.series-copy\s*\{[\s\S]*?color:\s*var\(--color-ink\);/);
assert.match(stylesCss, /\.dual-copy\s*\{[\s\S]*?inset:\s*0 auto 0 0;/);
assert.match(stylesCss, /\.dual-copy\s*\{[\s\S]*?justify-content:\s*center;/);
assert.match(stylesCss, /\.dual-copy\s*\{[\s\S]*?color:\s*var\(--color-ink\);/);
assert.doesNotMatch(stylesCss, /\.series-copy h2,\s*\.dual-copy h2,\s*\.series-copy p:last-child,\s*\.dual-copy p:last-child \{[\s\S]*?text-shadow:/m);
assert.match(stylesCss, /\.world-map\s*\{[\s\S]*?var\(--lazy-background\)/);
assert.match(indexHtml, /data-lazy-background="images\/server-map\.jpg"/);

assert.match(indexHtml, /<video[\s\S]*?preload="none"/);
assert.match(scriptJs, /key\s*===\s*['"]Escape['"]/);
assert.match(shellJs, /mobileMenuButton/);
assert.match(scriptJs, /document\.documentElement\.dataset\.lang\s*=\s*lang/);
assert.match(scriptJs, /const getViewportBucket = \(\) =>/);
assert.match(scriptJs, /const applyResponsiveTypeTuning = \(lang\) =>/);
assert.match(shellJs, /document\.body\.classList\.toggle\('is-menu-open'/);
assert.doesNotMatch(scriptJs, /fixed-desktop-stage/);
assert.match(scriptJs, /bindLazyBackgrounds/);
assert.match(indexHtml, /data-lazy-background="images\/series-luggage\.jpg"/);
assert.match(indexHtml, /data-src="videos\/xuanchuan\.mp4"/);

console.log('homepage tests passed');
