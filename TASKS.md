# TASKS — luggage-dc.com 多 AI 协作任务包

站点：https://luggage-dc.com　｜　仓库：/Users/a1/Documents/ChatGPT/New-project
指挥 / 验收 / 部署：**WorkBuddy**　｜　执行：Codex / Claude / Antigravity

---

## 军规（所有执行方必须遵守）

1. **不要 `git commit`、不要 `git push`、不要部署** —— 只改文件。WorkBuddy 统一验收后提交部署。
2. **原图一律不动** —— `images/` 下的原始 png/jpg 不得编辑、压缩、覆盖。`images/optimized/` 是新增产物，也不许删。
3. **只碰自己任务范围内的文件**，不许顺手改别人的。
4. 改完在下方对应任务包里把状态改为 `DONE` 并写一行改动摘要。
5. 不确定的地方**停下来问**，不要猜。

---

## 任务包 A — 清理孤儿图（执行：Codex）

**状态**：DONE

**改动摘要**：已将清单内 98 个文件按相对目录结构 mv 至 `/Users/a1/Documents/ChatGPT/_orphan-backup-20261013/`；自检备份 98 个文件、仓库原路径全部不存在，`images/optimized/` 完整未变。

**目标**：删除 98 个未被任何页面引用的旧设计稿，共 98.1 MB。

**清单**：`tools/orphan-images.txt`（每行一个相对路径，共 98 行）——**严格按此清单删除，不要自己重新判定**。

**硬性要求**：
- 删除前**先备份**：把清单里的文件 `mv` 到 `/Users/a1/Documents/ChatGPT/_orphan-backup-20261013/`（保持目录结构），**不要用 rm**。
- 清单之外的任何文件一律不许动。
- `images/optimized/` 整个目录不许碰。
- 删完后自检：仓库里不应再有清单中的路径。

**验收标准**：`git status` 显示 98 个 deleted，且 `images/optimized/` 完好、页面引用正常。

---

## 任务包 B — Cookie 同意横幅（执行：Claude）

**状态**：DONE

**摘要**：新增自包含 `cookie-consent.js`（注入 CSS + 底部圆角卡片横幅，金色主按钮，中/英跟随站点语言，选择存 localStorage `travelday-cookie-consent`=granted/denied）；`site-widgets.js` 仅在 init 加一处判断：`SITE_ANALYTICS_CONSENT===true` 才 loadAnalytics，否则等 `travelday:analytics-consent` 事件（点同意后当页即生效）；5 个根目录页面已引入 `cookie-consent.js?v=20261013-cc1`。

**目标**：站点即将接入 GA4 / Clarity，需要先有 Cookie 同意机制（欧盟 / 印度等地区合规）。

**要求**：
- 新建独立文件 `cookie-consent.js`（自包含：注入自己的 CSS + 横幅 DOM + 逻辑）。
- **默认不加载统计脚本**：只有用户点「同意」后，才允许 GA4 / Clarity 加载。统计代码目前由 `site-widgets.js` 注入，读取 `window.SITE_CONFIG.ga4Id` / `clarityId`（现为占位符，尚未填真实 ID）。请实现为：同意后才让 `site-widgets.js` 的统计部分生效（可用 `window.SITE_ANALYTICS_CONSENT = true` 之类的开关，并在 `site-widgets.js` 里加判断；改动 `site-widgets.js` 仅限加这一个判断，不要改其它样式逻辑）。
- 同意状态存 `localStorage`，记住选择，不要每次弹。
- 横幅样式与站点现有设计语言一致（金色主色、圆角卡片），中英双语（跟随站点 `data-default-lang` / 当前语言）。
- 在 `index.html`、`privacy.html`、`terms.html`、`thank-you.html`、`sitemap.html` 引入 `cookie-consent.js`（注意相对路径）。

**不要碰**：`mockups/` 下文件的图片标记、`<picture>` 结构、`styles.css` 的 WA 按钮样式。

---

## 任务包 C — 预留（Antigravity）

Antigravity 目前是 GUI 应用、无命令行接口，无法从终端派单。若要用它，请手动打开
`/Applications/Antigravity.app`，让它读本文件领取任务。
