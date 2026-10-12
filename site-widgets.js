// Conversion widgets + analytics shared by every page.
// Loaded on demand by script.js (home) and shared-shell.js (all other pages) so the logic lives in one place.
(() => {
  if (window.__siteWidgetsLoaded) return;
  window.__siteWidgetsLoaded = true;

  const CONFIG = window.SITE_CONFIG || {};
  const WA_NUMBER = CONFIG.whatsappNumber || '8613333998848';
  const WA_DEFAULT_TEXT = 'Hi TRAVELDAY, I am interested in your luggage parts and suitcases.';
  const STYLE_ID = 'site-widgets-styles';
  const SCRIPT_BASE = document.currentScript?.src || window.location.href;
  const MOBILE_QUERY = window.matchMedia('(max-width: 980px)');

  const LABELS = {
    zh: { chat: '通过 WhatsApp 联系我们', whatsapp: 'WhatsApp', quote: '获取报价' },
    en: { chat: 'Chat with us on WhatsApp', whatsapp: 'WhatsApp', quote: 'Get Quote' },
    es: { chat: 'Escríbenos por WhatsApp', whatsapp: 'WhatsApp', quote: 'Cotizar' },
    hi: { chat: 'WhatsApp पर हमसे बात करें', whatsapp: 'WhatsApp', quote: 'कोटेशन लें' },
  };

  const WA_ICON =
    '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z"/></svg>';

  const getLanguage = () => {
    const lang =
      window.traveldayShell?.getLanguage?.() ||
      document.documentElement.dataset.lang ||
      (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return LABELS[lang] ? lang : 'en';
  };

  const waLink = (text = WA_DEFAULT_TEXT) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  // ---------- Analytics (GA4 + Microsoft Clarity), only when real IDs are configured ----------
  const isRealId = (id) => typeof id === 'string' && id.trim() !== '' && !/^(G-)?x+$/i.test(id.trim());

  const loadAnalytics = () => {
    if (isRealId(CONFIG.ga4Id)) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.ga4Id)}`;
      document.head.appendChild(gaScript);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', CONFIG.ga4Id);
    }

    if (isRealId(CONFIG.clarityId)) {
      window.clarity =
        window.clarity ||
        function clarity() {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };
      const clarityScript = document.createElement('script');
      clarityScript.async = true;
      clarityScript.src = `https://www.clarity.ms/tag/${encodeURIComponent(CONFIG.clarityId)}`;
      document.head.appendChild(clarityScript);
    }
  };

  window.siteTrack = (event, params = {}) => {
    const payload = { page_path: window.location.pathname, language: getLanguage(), ...params };
    try {
      if (typeof window.gtag === 'function') window.gtag('event', event, payload);
      if (typeof window.clarity === 'function') window.clarity('event', event);
    } catch {
      // Tracking must never break the page.
    }
  };

  const bindClickTracking = () => {
    document.addEventListener(
      'click',
      (event) => {
        const anchor = event.target.closest?.('a[href]');
        if (!anchor) return;
        const href = anchor.getAttribute('href') || '';
        if (href.startsWith('https://wa.me/')) {
          window.siteTrack('whatsapp_click', { link_location: anchor.dataset.waSource || 'inline' });
        } else if (href.startsWith('mailto:')) {
          window.siteTrack('email_click', { link_location: anchor.dataset.emailSource || 'inline' });
        }
      },
      true,
    );
  };

  // ---------- Styles ----------
  const ensureStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .site-wa-float {
        position: fixed;
        right: 24px;
        top: clamp(520px, 64vh, 720px);
        bottom: auto;
        z-index: 95;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #25d366;
        color: #fff;
        box-shadow: 0 10px 24px rgba(18, 140, 126, 0.35);
        transition: transform 180ms ease, box-shadow 180ms ease, top 220ms ease;
      }
      .site-wa-float:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(18, 140, 126, 0.42); }
      .site-wa-float svg { width: 30px; height: 30px; }

      .site-cta-bar { display: none; }

      @media (max-width: 980px) {
        body { padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px)); }

        .site-wa-float {
          right: 14px;
          top: auto;
          bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          width: 52px;
          height: 52px;
          transition: transform 180ms ease, box-shadow 180ms ease, bottom 220ms ease;
        }
        body.has-cta-bar .site-wa-float { bottom: calc(80px + env(safe-area-inset-bottom, 0px)); }

        body .floating-top {
          right: 18px;
          bottom: calc(80px + env(safe-area-inset-bottom, 0px));
          width: 44px;
          height: 44px;
        }
        body.has-cta-bar .floating-top { bottom: calc(144px + env(safe-area-inset-bottom, 0px)); }

        .site-cta-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 90;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 10px 14px calc(10px + env(safe-area-inset-bottom, 0px));
          background: rgba(255, 253, 249, 0.97);
          border-top: 1px solid rgba(225, 213, 198, 0.9);
          box-shadow: 0 -10px 24px rgba(43, 34, 24, 0.08);
          transform: translateY(110%);
          transition: transform 220ms ease;
        }
        body.has-cta-bar .site-cta-bar { transform: translateY(0); }
        body.is-menu-open .site-cta-bar { visibility: hidden; }

        .site-cta-bar a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 900;
          text-decoration: none;
        }
        .site-cta-bar .site-cta-wa { background: #25d366; color: #fff; }
        .site-cta-bar .site-cta-wa svg { width: 22px; height: 22px; }
        .site-cta-bar .site-cta-quote { background: #d39a00; color: #fff; }
      }
    `;
    document.head.appendChild(style);
  };

  // ---------- Widgets ----------
  const getQuoteHref = () => {
    if (document.getElementById('contact')) return '#contact';
    const url = new URL('index.html', SCRIPT_BASE);
    url.search = '';
    url.searchParams.set('lang', getLanguage());
    url.hash = 'contact';
    return url.toString();
  };

  const createWaAnchor = (className, source) => {
    const anchor = document.createElement('a');
    anchor.className = className;
    anchor.href = waLink();
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.dataset.waSource = source;
    return anchor;
  };

  const widgets = {};

  const mountWidgets = () => {
    widgets.float = createWaAnchor('site-wa-float', 'float');
    widgets.float.innerHTML = WA_ICON;
    document.body.appendChild(widgets.float);

    widgets.bar = document.createElement('div');
    widgets.bar.className = 'site-cta-bar';
    widgets.barWa = createWaAnchor('site-cta-wa', 'mobile_bar');
    widgets.barQuote = document.createElement('a');
    widgets.barQuote.className = 'site-cta-quote';
    widgets.barQuote.href = getQuoteHref();
    widgets.barQuote.addEventListener('click', () => window.siteTrack('quote_cta_click', { link_location: 'mobile_bar' }));
    widgets.bar.append(widgets.barWa, widgets.barQuote);
    document.body.appendChild(widgets.bar);
  };

  const syncLabels = (lang = getLanguage()) => {
    const copy = LABELS[lang] || LABELS.en;
    [widgets.float].forEach((node) => {
      if (!node) return;
      node.setAttribute('aria-label', copy.chat);
      node.title = copy.chat;
    });
    if (widgets.barWa) {
      widgets.barWa.innerHTML = `${WA_ICON}<span></span>`;
      widgets.barWa.querySelector('span').textContent = copy.whatsapp;
      widgets.barWa.setAttribute('aria-label', copy.chat);
    }
    if (widgets.barQuote) {
      widgets.barQuote.textContent = copy.quote;
      widgets.barQuote.href = getQuoteHref();
    }
  };

  // The mobile bar appears once the visitor has scrolled past the hero.
  const bindBarVisibility = () => {
    const hero = document.querySelector('.hero, [data-section="hero"], .thank-you-hero, main section');
    let ticking = false;
    const update = () => {
      ticking = false;
      const passedHero = hero ? hero.getBoundingClientRect().bottom <= 0 : window.scrollY > 320;
      document.body.classList.toggle('has-cta-bar', MOBILE_QUERY.matches && passedHero);
    };
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
  };

  const init = () => {
    loadAnalytics();
    bindClickTracking();
    ensureStyles();
    mountWidgets();
    syncLabels();
    bindBarVisibility();
    window.addEventListener('travelday:languagechange', (event) => syncLabels(event.detail?.lang));
  };

  window.siteWidgets = { waLink, WA_NUMBER };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
