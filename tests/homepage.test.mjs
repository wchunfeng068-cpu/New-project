import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd());
const indexPath = path.join(root, 'index.html');
const stylesPath = path.join(root, 'styles.css');
const scriptPath = path.join(root, 'script.js');

const indexHtml = await fs.readFile(indexPath, 'utf8');
const stylesCss = await fs.readFile(stylesPath, 'utf8');
const scriptJs = await fs.readFile(scriptPath, 'utf8');

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

assert.match(indexHtml, /行李箱系列/);
assert.match(indexHtml, /覆盖登机箱、托运行李箱、零售批发和贴牌项目。/);
assert.match(indexHtml, /行李箱的拉杆/);
assert.match(indexHtml, /电脑包、通勤包和旅行背包，兼顾功能分区与商务外观。/);
assert.match(indexHtml, /行李箱轮子/);
assert.match(indexHtml, /公文包、托特包和高端商务携行解决方案。/);
assert.ok(!indexHtml.includes('class="series-index"'));

const productionStart = indexHtml.indexOf('data-section="production"');
const productionEnd = indexHtml.indexOf('<section class="market-panel card"', productionStart);
const productionSection = indexHtml.slice(productionStart, productionEnd > -1 ? productionEnd : undefined);

assert.ok(!productionSection.includes('立足中国供应链，服务全球交付。'));
assert.ok(!productionSection.includes('series-copy'));

assert.match(stylesCss, /\.series-banner\s*\{[\s\S]*?position:\s*relative;/);
assert.match(stylesCss, /\.series-copy\s*\{[\s\S]*?inset:\s*0 auto 0 0;/);
assert.match(stylesCss, /\.series-copy\s*\{[\s\S]*?justify-content:\s*center;/);
assert.match(stylesCss, /\.series-copy\s*\{[\s\S]*?color:\s*var\(--color-ink\);/);
assert.match(stylesCss, /\.dual-copy\s*\{[\s\S]*?inset:\s*0 auto 0 0;/);
assert.match(stylesCss, /\.dual-copy\s*\{[\s\S]*?justify-content:\s*center;/);
assert.match(stylesCss, /\.dual-copy\s*\{[\s\S]*?color:\s*var\(--color-ink\);/);
assert.match(stylesCss, /\.series-copy h2,\s*\.dual-copy h2,\s*\.series-copy p:last-child,\s*\.dual-copy p:last-child \{\s*text-shadow:\s*none;/m);
assert.ok(stylesCss.includes('url("images/server-map.jpg")'));

assert.match(scriptJs, /preload\s*=\s*['"]none['"]/);
assert.match(scriptJs, /key\s*===\s*['"]Escape['"]/);
assert.match(scriptJs, /mobileMenuButton/);
assert.match(scriptJs, /document\.documentElement\.dataset\.lang\s*=\s*lang/);
assert.match(scriptJs, /const getViewportBucket = \(\) =>/);
assert.match(scriptJs, /const applyResponsiveTypeTuning = \(lang\) =>/);
assert.match(scriptJs, /document\.body\.classList\.toggle\('is-menu-open'/);

console.log('homepage tests passed');
