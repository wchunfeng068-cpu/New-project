/* site-enhance.js — 解耦增强层：WhatsApp 浮窗 + cookie 同意横幅。
 * 纯前端注入，不改原页面结构；线上仅为两个悬浮元素（属已批准的轻微视觉变化）。
 */
(function () {
  "use strict";

  var WHATSAPP = "8613816885064"; // 含国家码，wa.me 跳转聊天
  var COOKIE_KEY = "dc_cookie_consent";

  // 根据当前页面位置决定站内链接前缀（mockups 子目录需要 ../）
  var IN_MOCKUP = /(^|\/)mockups\//.test(location.pathname);
  var PRIVACY_HREF = IN_MOCKUP ? "../privacy.html" : "privacy.html";

  /* ---------- WhatsApp 浮窗 ---------- */
  var fab = document.createElement("a");
  fab.className = "dc-wa-fab";
  fab.href = "https://wa.me/" + WHATSAPP;
  fab.target = "_blank";
  fab.rel = "noopener";
  fab.setAttribute("aria-label", "WhatsApp 联系我们");
  fab.innerHTML =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" aria-hidden="true">' +
    '<path d="M16.03 3C9.43 3 4.06 8.37 4.06 14.97c0 2.07.55 4.08 1.6 5.86L4 29l8.4-1.56a13.9 13.9 0 0 0 3.63.5h.01c6.6 0 12-5.37 12-11.97C28.05 8.37 22.63 3 16.03 3zm0 2.2c4.97 0 9.05 3.97 9.05 9.77 0 5.8-4.08 9.77-9.05 9.77-1.42 0-2.82-.38-4.04-1.1l-.29-.18-4.98.93.94-4.84-.19-.3a9.5 9.5 0 0 1-1.46-5.08c0-5.8 4.08-9.77 9.05-9.77zm-5.3 4.6c-.27 0-.7.1-.86.5-.16.4-.6 1.46-.74 1.78-.14.32-.28.35-.66.12-.38-.24-1.6-.62-3.05-1.98-.82-.82-1.38-1.83-1.54-2.14-.16-.32-.02-.49.12-.65.13-.13.28-.34.42-.5.14-.17.18-.3.28-.5.09-.2.05-.37-.02-.52-.08-.16-.66-1.6-.92-2.2-.24-.57-.49-.5-.66-.5h-.57c-.18 0-.48.07-.73.34-.25.28-.95.93-.95 2.27 0 1.34.97 2.63 1.1 2.81.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.12-.26-.19-.53-.33z"/>' +
    "</svg>";
  document.documentElement.appendChild(fab);

  /* ---------- cookie 同意横幅 ---------- */
  function showCookie() {
    document.documentElement.classList.add("dc-cookie-open");
    var el = document.createElement("div");
    el.className = "dc-cookie";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookie 同意");
    el.innerHTML =
      '<div class="dc-cookie-inner">' +
      '<p>我们使用 Cookie 提升浏览体验并分析流量。继续浏览即表示你同意我们的 <a href="' +
      PRIVACY_HREF +
      '">隐私政策</a>。</p>' +
      '<div class="dc-cookie-actions">' +
      '<button type="button" class="decline">拒绝</button>' +
      '<button type="button" class="accept">接受</button>' +
      "</div></div>";
    document.documentElement.appendChild(el);
    el.querySelector(".accept").addEventListener("click", function () { consent("accepted"); });
    el.querySelector(".decline").addEventListener("click", function () { consent("declined"); });
    function consent(v) {
      try { localStorage.setItem(COOKIE_KEY, v); } catch (e) {}
      document.documentElement.classList.remove("dc-cookie-open");
      if (el.parentNode) el.parentNode.removeChild(el);
    }
  }

  var already = null;
  try { already = localStorage.getItem(COOKIE_KEY); } catch (e) {}
  if (!already) showCookie();
})();
