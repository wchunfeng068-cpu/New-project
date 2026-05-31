const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const mockups = path.join(root, 'mockups');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function fileUrl(p) {
  return 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');
}

function writeHtml(name, html) {
  const full = path.join(mockups, name);
  fs.writeFileSync(full, html, 'utf8');
  return full;
}

function render(htmlFile, pngFile) {
  const args = [
    '--headless',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--window-size=1600,1100',
    `--screenshot=${path.join(mockups, pngFile)}`,
    fileUrl(htmlFile),
  ];
  const result = spawnSync(chrome, args, { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || 'render failed').trim());
  }
}

ensureDir(mockups);

const baseCss = `
  * { box-sizing: border-box; }
  html, body {
    width: 1600px;
    height: 1100px;
    margin: 0;
    overflow: hidden;
    background: linear-gradient(180deg, #f7f3ed 0%, #efe4d4 100%);
    font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page {
    position: relative;
    width: 1540px;
    height: 1040px;
    border-radius: 34px;
    background: #fcfaf5;
    box-shadow: 0 18px 48px rgba(35, 28, 20, 0.12);
    overflow: hidden;
  }
  .logo {
    position: absolute;
    left: 70px;
    top: 58px;
    width: 170px;
    height: 58px;
    object-fit: contain;
  }
  .eyebrow {
    position: absolute;
    left: 92px;
    top: 166px;
    color: #b77a00;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.22em;
  }
  .title {
    position: absolute;
    left: 92px;
    top: 214px;
    width: 520px;
    color: #171411;
    font-size: 60px;
    font-weight: 700;
    line-height: 0.98;
    font-family: "SimHei", "Microsoft YaHei", sans-serif;
  }
  .subtitle {
    position: absolute;
    left: 92px;
    top: 384px;
    width: 460px;
    color: #6f655a;
    font-size: 18px;
    line-height: 1.8;
  }
  .pill {
    position: absolute;
    left: 92px;
    top: 474px;
    padding: 0 18px;
    height: 36px;
    border-radius: 999px;
    border: 1px solid #e3d9ca;
    background: #fff;
    color: #6f655a;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
  }
  .top-image {
    position: absolute;
    right: 70px;
    top: 140px;
    width: 760px;
    height: 490px;
    border-radius: 30px;
    object-fit: cover;
    filter: saturate(0.96);
  }
  .top-overlay {
    position: absolute;
    right: 70px;
    top: 140px;
    width: 760px;
    height: 490px;
    border-radius: 30px;
    background: linear-gradient(180deg, rgba(31, 25, 20, 0.10), rgba(31, 25, 20, 0.28));
  }
  .chip {
    position: absolute;
    left: 744px;
    top: 164px;
    width: 240px;
    height: 40px;
    border-radius: 999px;
    background: rgba(255,255,255,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #171411;
    font-size: 13px;
    font-weight: 800;
  }
  .bottom-panel {
    position: absolute;
    left: 92px;
    right: 92px;
    top: 712px;
    height: 250px;
    border-radius: 26px;
    overflow: hidden;
    border: 1px solid rgba(224, 214, 202, 0.92);
    background: linear-gradient(180deg, #fdfbf6 0%, #f6efe5 100%);
  }
`;

const solutionBottom = `
  .question-side {
    position: absolute;
    left: 30px;
    top: 28px;
    width: 560px;
    height: 194px;
  }
  .bottom-tag {
    color: #b77a00;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.18em;
    margin-bottom: 12px;
  }
  .qa-title {
    color: #171411;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 18px;
    font-family: "SimHei", "Microsoft YaHei", sans-serif;
  }
  .bubble {
    position: relative;
    border-radius: 18px;
    padding: 16px 18px;
    line-height: 1.65;
    font-size: 14px;
    color: #3d352d;
  }
  .bubble.customer {
    background: #fff;
    border: 1px solid #eadfcf;
    width: 520px;
    margin-bottom: 12px;
    box-shadow: 0 8px 18px rgba(50, 37, 24, 0.04);
  }
  .bubble.customer::before {
    content: "客户问";
    position: absolute;
    left: 18px;
    top: -12px;
    height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    background: #171411;
    color: #fff;
    font-size: 11px;
    line-height: 24px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }
  .bubble.answer {
    background: #171411;
    color: #fff;
    width: 520px;
  }
  .bubble.answer::before {
    content: "我们答";
    position: absolute;
    left: 18px;
    top: -12px;
    height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    background: #c98d00;
    color: #fff;
    font-size: 11px;
    line-height: 24px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }
  .chips {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
    width: 530px;
  }
  .mini-chip {
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid #e2d7c7;
    background: rgba(255,255,255,0.75);
    color: #665c50;
    font-size: 11px;
    font-weight: 700;
    line-height: 28px;
  }
  .hub {
    position: absolute;
    left: 632px;
    top: 86px;
    width: 148px;
    height: 76px;
    border-radius: 22px;
    background: linear-gradient(180deg, #f0e6d7 0%, #e8dcc9 100%);
    border: 1px solid rgba(193, 171, 137, 0.48);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    box-shadow: 0 10px 20px rgba(65, 45, 23, 0.08);
  }
  .hub .big {
    font-size: 18px;
    font-weight: 800;
    color: #171411;
    line-height: 1.1;
  }
  .hub .small {
    margin-top: 2px;
    font-size: 11px;
    color: #6f655a;
  }
  .product-zone {
    position: absolute;
    left: 806px;
    top: 24px;
    width: 604px;
    height: 204px;
    border-radius: 22px;
    background: linear-gradient(135deg, rgba(255,255,255,0.84), rgba(244, 235, 221, 0.72));
    overflow: hidden;
  }
  .product-grid {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 10px;
    padding: 16px;
  }
  .product-main {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: #eee;
  }
  .product-main img,
  .product-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .product-small-stack {
    display: grid;
    gap: 10px;
  }
  .product-small {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    background: #eee;
  }
  .caption {
    position: absolute;
    left: 14px;
    bottom: 14px;
    right: 14px;
    height: 28px;
    border-radius: 999px;
    background: rgba(255,255,255,0.84);
    color: #171411;
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }
  .connector {
    position: absolute;
    left: 692px;
    top: 24px;
    width: 2px;
    height: 204px;
    background: linear-gradient(180deg, rgba(201, 141, 0, 0.0), rgba(201, 141, 0, 0.46), rgba(201, 141, 0, 0.0));
  }
  .connector::before,
  .connector::after {
    content: "";
    position: absolute;
    left: -3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c98d00;
    box-shadow: 0 0 0 5px rgba(201, 141, 0, 0.12);
  }
  .connector::before { top: 28px; }
  .connector::after { top: 146px; }
`;

const marketBottom = `
  .market-left {
    position: absolute;
    left: 28px;
    top: 26px;
    width: 500px;
    height: 198px;
  }
  .market-head {
    color: #b77a00;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.18em;
    margin-bottom: 12px;
  }
  .market-title {
    color: #171411;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
    font-family: "SimHei", "Microsoft YaHei", sans-serif;
  }
  .market-copy {
    color: #6f655a;
    font-size: 14px;
    line-height: 1.8;
    width: 450px;
  }
  .market-chips {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
    width: 470px;
  }
  .market-chip {
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid #e2d7c7;
    background: rgba(255,255,255,0.78);
    color: #665c50;
    font-size: 11px;
    font-weight: 700;
    line-height: 28px;
  }
  .market-map {
    position: absolute;
    left: 552px;
    top: 16px;
    width: 930px;
    height: 214px;
    border-radius: 22px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255,255,255,0.82), rgba(239, 228, 212, 0.55));
  }
  .market-map img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.1) saturate(0.92) contrast(0.98);
    opacity: 0.78;
  }
  .market-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(252, 250, 245, 0.00) 0%, rgba(252, 250, 245, 0.18) 38%, rgba(252, 250, 245, 0.04) 100%),
      radial-gradient(circle at 62% 44%, rgba(201, 141, 0, 0.22), rgba(201, 141, 0, 0.00) 24%),
      radial-gradient(circle at 74% 28%, rgba(201, 141, 0, 0.18), rgba(201, 141, 0, 0.00) 20%),
      radial-gradient(circle at 82% 63%, rgba(201, 141, 0, 0.15), rgba(201, 141, 0, 0.00) 22%);
  }
  .market-node {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #c98d00;
    box-shadow: 0 0 0 8px rgba(201, 141, 0, 0.11);
  }
  .market-node.one { left: 630px; top: 56px; }
  .market-node.two { left: 780px; top: 92px; }
  .market-node.three { left: 920px; top: 62px; }
  .market-node.four { left: 1040px; top: 120px; }
  .market-node.five { left: 1160px; top: 74px; }
  .market-line {
    position: absolute;
    left: 644px;
    top: 64px;
    width: 520px;
    height: 120px;
    border-top: 1px dashed rgba(201, 141, 0, 0.35);
    border-right: 1px dashed rgba(201, 141, 0, 0.35);
    border-bottom: 1px dashed rgba(201, 141, 0, 0.35);
    border-radius: 0 80px 80px 0;
    pointer-events: none;
  }
  .market-card {
    position: absolute;
    right: 24px;
    bottom: 22px;
    width: 218px;
    height: 56px;
    border-radius: 18px;
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(224, 214, 202, 0.78);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #171411;
    font-size: 13px;
    font-weight: 800;
    backdrop-filter: blur(10px);
  }
  .market-card span {
    display: block;
    color: #6f655a;
    font-size: 11px;
    font-weight: 600;
    margin-top: 2px;
  }
`;

function commonPage(title, eyebrow, subtitle, pill, topImage, topLabel) {
  return `
  <div class="page">
    <img class="logo" src="../images/logo-travelday.png" alt="TRAVELDAY" />
    <div class="eyebrow">${eyebrow}</div>
    <div class="title">${title}</div>
    <div class="subtitle">${subtitle}</div>
    <div class="pill">${pill}</div>
    <img class="top-image" src="${topImage}" alt="top image" />
    <div class="top-overlay"></div>
    <div class="chip">${topLabel}</div>
  `;
}

const solutionHtml = `<!doctype html>
<html>
<head><meta charset="utf-8"><style>${baseCss}${solutionBottom}</style></head>
<body>
${commonPage(
  '解决买家<br>找货难题',
  'SOLUTION',
  '把找货、协同和交付收成一条线。',
  '更少解释 · 更清晰的入口',
  '../images/series-production.jpg',
  'One-stop supply chain'
)}
  <div class="bottom-panel">
    <div class="question-side">
      <div class="bottom-tag">Q&A / RESOURCE INTEGRATION</div>
      <div class="qa-title">客户找的是一个人，<br>我们整合的是整条资源链。</div>
      <div class="bubble customer">要通过这个人买拉杆，通过那个人买手把，通过另外一个人买轮子，沟通成本太高，交期也很难统一。</div>
      <div class="bubble answer">我们不是单一工厂，而是资源整合商。拉杆、手把、轮子以及更多箱包相关资源，都能统一对接、统一匹配、统一交付。</div>
      <div class="chips">
        <div class="mini-chip">拉杆</div>
        <div class="mini-chip">手把</div>
        <div class="mini-chip">轮子</div>
        <div class="mini-chip">箱体</div>
        <div class="mini-chip">包材</div>
        <div class="mini-chip">整箱配套</div>
      </div>
    </div>
    <div class="hub">
      <div class="big">资源<br>整合商</div>
      <div class="small">一个入口 · 多种资源</div>
    </div>
    <div class="connector"></div>
    <div class="product-zone">
      <div class="product-grid">
        <div class="product-main">
          <img src="../images/series-production.jpg" alt="production" />
          <div class="caption">整箱协同</div>
        </div>
        <div class="product-small-stack">
          <div class="product-small">
            <img src="../images/series-handle.jpg" alt="handle" />
            <div class="caption">手把</div>
          </div>
          <div class="product-small">
            <img src="../images/series-wheels.jpg" alt="wheel" />
            <div class="caption">轮子</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

const marketHtml = `<!doctype html>
<html>
<head><meta charset="utf-8"><style>${baseCss}${marketBottom}</style></head>
<body>
${commonPage(
  '把全球覆盖<br>做成一张图',
  'GLOBAL MARKET',
  '用地图表达区域覆盖，保持画面更干净。',
  '区域优先 · 信息克制',
  '../images/server-map.jpg',
  'Coverage map'
)}
  <div class="bottom-panel">
    <div class="market-left">
      <div class="market-head">MARKET / COVERAGE</div>
      <div class="market-title">市场不是一个点，<br>而是一张网络。</div>
      <div class="market-copy">用更克制的方式表达市场布局：有覆盖、有连接、有响应，也有统一的品牌感和节奏感。</div>
      <div class="market-chips">
        <div class="market-chip">全球视野</div>
        <div class="market-chip">多点协同</div>
        <div class="market-chip">统一输出</div>
        <div class="market-chip">快速响应</div>
      </div>
    </div>
    <div class="market-map">
      <img src="../images/server-map111.jpg" alt="market map" />
      <div class="market-overlay"></div>
      <div class="market-line"></div>
      <div class="market-node one"></div>
      <div class="market-node two"></div>
      <div class="market-node three"></div>
      <div class="market-node four"></div>
      <div class="market-node five"></div>
      <div class="market-card">
        市场布局
        <span>一图看懂覆盖和联动</span>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

const solutionHtmlFile = writeHtml('requested-solution-v2.html', solutionHtml);
const marketHtmlFile = writeHtml('requested-market-v2.html', marketHtml);

render(solutionHtmlFile, 'requested-solution-v2.png');
render(marketHtmlFile, 'requested-market-v2.png');

console.log('requested v2 PNGs generated');
