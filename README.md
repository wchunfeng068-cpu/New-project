# TRAVELDAY 官网（luggage-dc.com）

纯静态网站，部署在 Vercel：推送到 GitHub `master` 分支后自动上线，推送到其他分支会生成预览链接。

## 页面

| 网址 | 文件 |
|---|---|
| `/` | `index.html` |
| `/products/` | `products/index.html` |
| `/product-detail/?product=…` | `product-detail/index.html` |
| `/solutions/` | `solutions/index.html` |
| `/market/` | `market/index.html` |
| `/about/` | `about/index.html`（脚本 `about/company-presence-preview.js`） |
| `/privacy.html` `/terms.html` `/sitemap.html` `/thank-you.html` | 根目录同名文件 |

旧网址 `/mockups/*-preview.html` 在 `vercel.json` 里 301 跳转到上面的新网址。

## 常改的地方

- **WhatsApp 号码、Google Analytics / Clarity ID、社交媒体链接**：`site-enhance.js` 顶部的配置。
- **询盘收件邮箱**：`shared-inquiry.js` 顶部 `INQUIRY_RECIPIENT`，以及 `index.html` 里表单的 `action`。
- **图片**：原图放在 `images/`，压缩后的 WebP 放在 `images/optimized/` 同名路径；页面优先加载 WebP，找不到时自动用原图。

## 改完代码后

英文页面及翻译字典是源文件；`/zh/`、`/es/`、`/hi/` 下的页面是生成文件，不要手工编辑。更新页面文案或翻译字典后，按顺序运行：

```bash
node tools/build-i18n.mjs          # 生成中文、西语、印地语静态 HTML，并更新 hreflang 与 sitemap
node tools/stamp-versions.mjs      # 更新所有子目录 HTML 中 CSS/JS 的 ?v= 内容哈希
node tools/build-i18n.mjs --check  # 确认已提交的语言页与源文件一致
node scripts/visual-qa.mjs        # 发布前视觉体检：横向溢出、导航遮挡、隐藏内容等
```

`build-i18n.mjs` 使用 Chrome 无头浏览器导出站点现有翻译字典渲染结果（可通过 `CHROME_PATH` 指定 Chrome 路径）。语言切换会跳到当前页面对应的语言网址；根目录始终为英文，不会按浏览器语言自动跳转。隐私、条款和感谢页面仍只有英文版。

`scripts/pre-push` 会在 `git push` 前检查版本哈希、生成页一致性并运行视觉体检，安装方法：

```bash
cp scripts/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push
```

本地预览：`python3 -m http.server 8080`，然后打开 http://localhost:8080 。
