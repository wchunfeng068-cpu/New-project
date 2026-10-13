/* site-enhance.js — WhatsApp floating button + cookie notice.
 * Injected on every page; does not touch the existing page markup.
 *
 * WhatsApp button
 *   - Lines up with the "Top" button, so it sits at the bottom-right corner of the
 *     page content (not the browser corner) and uses the same size as "Top".
 *   - While "Top" is hidden it takes Top's slot; once the visitor scrolls and "Top"
 *     appears, it slides up to sit right above it.
 *   - Continuous pulse ring (disabled for prefers-reduced-motion).
 *   - Change the number in WHATSAPP_NUMBER (country code, digits only).
 *
 * Cookie notice follows the site language (en / zh / es / hi).
 */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '8613333998848';
  var GAP = 14; // px between the WhatsApp button and the Top button
  var COOKIE_KEY = 'dc_cookie_consent';

  var IN_MOCKUP = /(^|\/)mockups\//.test(location.pathname);
  var PRIVACY_HREF = IN_MOCKUP ? '../privacy.html' : 'privacy.html';

  var COPY = {
    en: {
      wa: 'Chat with us on WhatsApp',
      text: 'We use cookies to remember your preferences and, if you accept, to understand how visitors use our site. See our',
      link: 'Privacy Policy',
      accept: 'Accept',
      decline: 'Decline',
      dialog: 'Cookie notice',
    },
    zh: {
      wa: '通过 WhatsApp 联系我们',
      text: '我们使用 Cookie 记住您的偏好设置；如您同意，也会用于了解访客如何使用本网站。详见',
      link: '隐私政策',
      accept: '同意',
      decline: '拒绝',
      dialog: 'Cookie 提示',
    },
    es: {
      wa: 'Escríbanos por WhatsApp',
      text: 'Usamos cookies para recordar sus preferencias y, si acepta, para entender cómo se usa nuestro sitio. Consulte nuestra',
      link: 'Política de privacidad',
      accept: 'Aceptar',
      decline: 'Rechazar',
      dialog: 'Aviso de cookies',
    },
    hi: {
      wa: 'WhatsApp पर हमसे बात करें',
      text: 'हम आपकी पसंद याद रखने के लिए और आपकी सहमति होने पर, साइट के उपयोग को समझने के लिए कुकीज़ का उपयोग करते हैं। देखें हमारी',
      link: 'गोपनीयता नीति',
      accept: 'स्वीकार करें',
      decline: 'अस्वीकार करें',
      dialog: 'कुकी सूचना',
    },
  };

  function lang() {
    var l = (document.documentElement.getAttribute('lang') || 'en').toLowerCase().slice(0, 2);
    return COPY[l] ? l : 'en';
  }

  var root = document.documentElement;
  var fab = null;
  var cookie = null;

  /* ---------- WhatsApp button ---------- */
  function buildFab() {
    fab = document.createElement('a');
    fab.className = 'dc-wa-fab';
    fab.href = 'https://wa.me/' + WHATSAPP_NUMBER;
    fab.target = '_blank';
    fab.rel = 'noopener';
    fab.innerHTML =
      '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" aria-hidden="true" focusable="false">' +
      '<path d="M16.03 3C9.43 3 4.06 8.37 4.06 14.97c0 2.07.55 4.08 1.6 5.86L4 29l8.4-1.56a13.9 13.9 0 0 0 3.63.5h.01c6.6 0 12-5.37 12-11.97C28.05 8.37 22.63 3 16.03 3zm0 2.2c4.97 0 9.05 3.97 9.05 9.77 0 5.8-4.08 9.77-9.05 9.77-1.42 0-2.82-.38-4.04-1.1l-.29-.18-4.98.93.94-4.84-.19-.3a9.5 9.5 0 0 1-1.46-5.08c0-5.8 4.08-9.77 9.05-9.77zm-5.3 4.6c-.27 0-.7.1-.86.5-.16.4-.6 1.46-.74 1.78-.14.32-.28.35-.66.12-.38-.24-1.6-.62-3.05-1.98-.82-.82-1.38-1.83-1.54-2.14-.16-.32-.02-.49.12-.65.13-.13.28-.34.42-.5.14-.17.18-.3.28-.5.09-.2.05-.37-.02-.52-.08-.16-.66-1.6-.92-2.2-.24-.57-.49-.5-.66-.5h-.57c-.18 0-.48.07-.73.34-.25.28-.95.93-.95 2.27 0 1.34.97 2.63 1.1 2.81.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.12-.26-.19-.53-.33z"/>' +
      '</svg>';
    document.body.appendChild(fab);
  }

  function cookieOffset() {
    return cookie && cookie.parentNode ? cookie.offsetHeight : 0;
  }

  function placeFab() {
    if (!fab) return;
    var top = document.querySelector('.floating-top');
    if (!top) {
      fab.style.bottom = 24 + cookieOffset() + 'px';
      return;
    }
    var cs = window.getComputedStyle(top);
    var size = parseFloat(cs.width) || 48;
    var right = parseFloat(cs.right) || 16;
    var topBottom = parseFloat(cs.bottom) || 0;
    var topVisible = top.classList.contains('is-visible');
    var offset = cookieOffset();

    fab.style.width = size + 'px';
    fab.style.height = size + 'px';
    fab.style.right = right + 'px';
    fab.style.bottom = topBottom + offset + (topVisible ? size + GAP : 0) + 'px';
    root.style.setProperty('--dc-cookie-offset', offset + 'px');
  }

  function watchTopButton() {
    var top = document.querySelector('.floating-top');
    if (!top || top.dataset.dcWatched) return;
    top.dataset.dcWatched = '1';
    new MutationObserver(placeFab).observe(top, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- Cookie notice ---------- */
  function cookieChoice() {
    try {
      return localStorage.getItem(COOKIE_KEY);
    } catch (e) {
      return null;
    }
  }

  function renderCookieText() {
    if (!cookie) return;
    var c = COPY[lang()];
    cookie.setAttribute('aria-label', c.dialog);
    cookie.querySelector('.dc-cookie-text').innerHTML =
      c.text + ' <a href="' + PRIVACY_HREF + '">' + c.link + '</a>.';
    cookie.querySelector('.accept').textContent = c.accept;
    cookie.querySelector('.decline').textContent = c.decline;
  }

  function closeCookie(value) {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch (e) {}
    root.classList.remove('dc-cookie-open');
    if (cookie && cookie.parentNode) cookie.parentNode.removeChild(cookie);
    cookie = null;
    placeFab();
  }

  function buildCookie() {
    cookie = document.createElement('div');
    cookie.className = 'dc-cookie';
    cookie.setAttribute('role', 'region');
    cookie.innerHTML =
      '<div class="dc-cookie-inner">' +
      '<p class="dc-cookie-text"></p>' +
      '<div class="dc-cookie-actions">' +
      '<button type="button" class="decline"></button>' +
      '<button type="button" class="accept"></button>' +
      '</div></div>';
    document.body.appendChild(cookie);
    root.classList.add('dc-cookie-open');
    renderCookieText();
    cookie.querySelector('.accept').addEventListener('click', function () {
      closeCookie('accepted');
    });
    cookie.querySelector('.decline').addEventListener('click', function () {
      closeCookie('declined');
    });
  }

  function syncLanguage() {
    if (fab) fab.setAttribute('aria-label', COPY[lang()].wa);
    renderCookieText();
    placeFab();
  }

  /* ---------- boot ---------- */
  function init() {
    buildFab();
    if (!cookieChoice()) buildCookie();
    syncLanguage();
    watchTopButton();
    // shared-shell.js may inject the Top button after this script runs
    setTimeout(function () {
      watchTopButton();
      placeFab();
    }, 300);
    window.addEventListener('load', placeFab);
    window.addEventListener('resize', placeFab);
    new MutationObserver(syncLanguage).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
