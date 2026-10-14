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
 *
 * Analytics (GA4 + Microsoft Clarity)
 *   - Paste the IDs into GA4_ID / CLARITY_ID; nothing loads while they are empty.
 *   - GA4 uses Consent Mode: before the visitor accepts cookies it only sends cookieless
 *     pings; after "Accept" it measures normally. Clarity loads only after "Accept".
 *   - Events: whatsapp_click, email_click, generate_lead (thank-you page after an inquiry).
 *
 * Social links in the footer: fill SOCIAL_LINKS; an icon appears only when its URL is set.
 */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '8613333998848';
  var GAP = 14; // px between the WhatsApp button and the Top button
  var COOKIE_KEY = 'dc_cookie_consent';

  var GA4_ID = 'G-6FZEHHTB5C';
  var CLARITY_ID = 'yx33pfkr2v';

  var SOCIAL_LINKS = {
    linkedin: '', // e.g. 'https://www.linkedin.com/company/...'
    facebook: '',
    youtube: '',
  };
  // Glyphs from the Simple Icons package (simple-icons@13.21.0)
  var SOCIAL_ICONS = {
    linkedin: { label: 'LinkedIn', d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    facebook: { label: 'Facebook', d: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' },
    youtube: { label: 'YouTube', d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  };

  // Section pages live one folder deep (/products/, /about/ ...)
  var PRIVACY_HREF = '/privacy.html';

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
    // WhatsApp glyph from the Simple Icons package (simple-icons@13.21.0, icons/whatsapp.svg)
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" aria-hidden="true" focusable="false">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>' +
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
    onConsent(value);
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

  /* ---------- Analytics ---------- */
  var analyticsReady = false;
  var clarityLoaded = false;

  function loadScript(src) {
    var el = document.createElement('script');
    el.async = true;
    el.src = src;
    document.head.appendChild(el);
  }

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  function loadClarity() {
    if (!CLARITY_ID || clarityLoaded) return;
    clarityLoaded = true;
    window.clarity =
      window.clarity ||
      function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    loadScript('https://www.clarity.ms/tag/' + encodeURIComponent(CLARITY_ID));
  }

  function initAnalytics() {
    var accepted = cookieChoice() === 'accepted';
    if (GA4_ID) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('consent', 'default', {
        analytics_storage: accepted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID);
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID));
      analyticsReady = true;
    }
    if (accepted) loadClarity();

    // An inquiry was sent successfully: shared-inquiry.js redirects to thank-you.html
    if (/thank-you\.html$/.test(location.pathname)) track('generate_lead', { method: 'inquiry_form' });

    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      if (href.indexOf('wa.me/') !== -1) track('whatsapp_click', { link_url: href });
      else if (href.indexOf('mailto:') === 0) track('email_click', { link_url: href });
    });
  }

  function onConsent(value) {
    if (value !== 'accepted') return;
    if (analyticsReady) window.gtag('consent', 'update', { analytics_storage: 'granted' });
    loadClarity();
  }

  /* ---------- Social links in the footer ---------- */
  function renderSocial() {
    var keys = Object.keys(SOCIAL_LINKS).filter(function (k) {
      return SOCIAL_LINKS[k];
    });
    if (!keys.length) return;
    document.querySelectorAll('.site-footer').forEach(function (footer) {
      if (footer.querySelector('.dc-social')) return;
      var wrap = document.createElement('div');
      wrap.className = 'dc-social';
      wrap.innerHTML = keys
        .map(function (k) {
          var icon = SOCIAL_ICONS[k];
          return (
            '<a href="' + SOCIAL_LINKS[k] + '" target="_blank" rel="noopener" aria-label="' + icon.label + '">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + icon.d + '"/></svg></a>'
          );
        })
        .join('');
      // Inside the footer nav, so the footer keeps its existing column layout
      var nav = footer.querySelector('nav');
      if (nav) nav.insertBefore(wrap, nav.firstChild);
      else footer.appendChild(wrap);
    });
  }

  /* ---------- boot ---------- */
  function init() {
    initAnalytics();
    renderSocial();
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
