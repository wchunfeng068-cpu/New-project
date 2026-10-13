// Cookie consent banner. Self-contained: injects its own CSS + DOM.
// Analytics (GA4 / Clarity in site-widgets.js) only load after the visitor clicks "Accept":
// we set window.SITE_ANALYTICS_CONSENT = true and fire 'travelday:analytics-consent'.
(() => {
  if (window.__cookieConsentLoaded) return;
  window.__cookieConsentLoaded = true;

  const STORAGE_KEY = 'travelday-cookie-consent';
  const LANGUAGE_STORAGE_KEY = 'travelday-site-language';
  const STYLE_ID = 'cookie-consent-styles';
  const GRANTED = 'granted';
  const DENIED = 'denied';

  const COPY = {
    zh: {
      label: 'Cookie 设置',
      text: '我们使用 Cookie 及类似技术（Google Analytics、Microsoft Clarity）分析网站访问情况，以改进您的浏览体验。您同意后我们才会启用这些统计工具。',
      policy: '隐私政策',
      accept: '同意',
      decline: '拒绝',
    },
    en: {
      label: 'Cookie preferences',
      text: 'We use cookies and similar technologies (Google Analytics, Microsoft Clarity) to understand how visitors use this site and improve your experience. These analytics tools are only enabled with your consent.',
      policy: 'Privacy Policy',
      accept: 'Accept',
      decline: 'Decline',
    },
  };

  const readChoice = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === GRANTED || value === DENIED ? value : null;
    } catch {
      return null;
    }
  };

  const saveChoice = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage is best-effort only; the choice still applies to this page view.
    }
  };

  const grantConsent = () => {
    window.SITE_ANALYTICS_CONSENT = true;
    window.dispatchEvent(new CustomEvent('travelday:analytics-consent'));
  };

  // Set the flag synchronously so site-widgets.js sees it whenever it initialises.
  const initialChoice = readChoice();
  window.SITE_ANALYTICS_CONSENT = initialChoice === GRANTED;

  const getLanguage = () => {
    let lang =
      window.traveldayShell?.getLanguage?.() ||
      document.documentElement.dataset.lang ||
      '';
    if (!lang) {
      try {
        lang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem(LANGUAGE_STORAGE_KEY) || '';
      } catch {
        lang = '';
      }
    }
    if (!lang) lang = document.documentElement.dataset.defaultLang || document.documentElement.lang || 'en';
    return String(lang).slice(0, 2).toLowerCase() === 'zh' ? 'zh' : 'en';
  };

  const ensureStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .cookie-consent {
        position: fixed;
        left: 50%;
        bottom: calc(20px + env(safe-area-inset-bottom, 0px));
        z-index: 120;
        width: min(720px, calc(100vw - 32px));
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 18px 22px;
        border: 1px solid var(--color-line, #ebe3d8);
        border-radius: var(--radius-card, 18px);
        background: var(--color-surface, #ffffff);
        box-shadow: var(--shadow-soft, 0 18px 48px rgba(35, 28, 20, 0.1));
        color: var(--color-text, #2b2824);
        font-family: var(--font-sans, Arial, "Microsoft YaHei", "PingFang SC", sans-serif);
        transform: translate(-50%, 0);
        opacity: 1;
        transition: transform 220ms ease, opacity 220ms ease;
      }
      .cookie-consent[hidden] { display: none; }
      .cookie-consent.is-leaving { transform: translate(-50%, 16px); opacity: 0; }
      .cookie-consent__text {
        flex: 1 1 auto;
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
      }
      .cookie-consent__text a {
        display: inline-block;
        padding: 6px 2px;
        color: var(--color-gold-dark, #a87300);
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .cookie-consent__actions {
        flex: 0 0 auto;
        display: flex;
        gap: 10px;
      }
      .cookie-consent__btn {
        min-height: 42px;
        padding: 0 20px;
        border-radius: var(--radius-pill, 999px);
        border: 1px solid var(--color-gold, #d39a00);
        font: inherit;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
      }
      .cookie-consent__btn--accept { background: var(--color-gold, #d39a00); color: #fff; }
      .cookie-consent__btn--accept:hover { background: var(--color-gold-dark, #a87300); border-color: var(--color-gold-dark, #a87300); }
      .cookie-consent__btn--decline { background: transparent; color: var(--color-gold-dark, #a87300); }
      .cookie-consent__btn--decline:hover { background: var(--color-card, #f6f1e9); }
      .cookie-consent__btn:focus-visible { outline: 3px solid var(--color-gold, #d39a00); outline-offset: 2px; }

      @media (max-width: 640px) {
        .cookie-consent {
          flex-direction: column;
          align-items: stretch;
          gap: 14px;
          bottom: calc(12px + env(safe-area-inset-bottom, 0px));
          padding: 16px;
        }
        .cookie-consent__text { font-size: 13px; }
        .cookie-consent__actions .cookie-consent__btn { flex: 1 1 0; }
      }

      /* While the banner is visible, lift the floating contact buttons above it so
         WhatsApp and back-to-top stay reachable. --cc-offset is the banner's
         measured height (including its bottom gap), set by JS below. */
      body.has-cookie-banner .site-wa-float {
        bottom: calc(190px + var(--cc-offset, 0px));
      }
      body.has-cookie-banner .floating-top {
        bottom: calc(86px + var(--cc-offset, 0px));
      }
      @media (max-width: 980px) {
        body.has-cookie-banner .site-wa-float {
          bottom: calc(16px + var(--cc-offset, 0px));
        }
        body.has-cookie-banner .floating-top {
          bottom: calc(80px + var(--cc-offset, 0px));
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .cookie-consent { transition: none; }
      }
    `;
    document.head.appendChild(style);
  };

  let banner = null;

  const syncLabels = (lang = getLanguage()) => {
    if (!banner) return;
    const copy = COPY[lang === 'zh' ? 'zh' : 'en'];
    banner.setAttribute('aria-label', copy.label);
    banner.querySelector('.cookie-consent__copy').textContent = `${copy.text} `;
    banner.querySelector('.cookie-consent__policy').textContent = copy.policy;
    banner.querySelector('.cookie-consent__btn--accept').textContent = copy.accept;
    banner.querySelector('.cookie-consent__btn--decline').textContent = copy.decline;
  };

  const closeBanner = () => {
    if (!banner) return;
    const node = banner;
    banner = null;
    // Floating buttons go back to their normal position.
    document.body.classList.remove('has-cookie-banner');
    document.documentElement.style.setProperty('--cc-offset', '0px');
    node.classList.add('is-leaving');
    window.setTimeout(() => node.remove(), 240);
  };

  const choose = (value) => {
    saveChoice(value);
    if (value === GRANTED) grantConsent();
    closeBanner();
  };

  // Measures the banner so the floating buttons can be lifted by exactly its height.
  const updateOffset = () => {
    if (!banner) {
      document.documentElement.style.setProperty('--cc-offset', '0px');
      return;
    }
    try {
      const style = window.getComputedStyle(banner);
      const gap = parseFloat(style.bottom) || 0;
      const height = banner.offsetHeight || 0;
      document.documentElement.style.setProperty('--cc-offset', `${Math.ceil(height + gap + 12)}px`);
    } catch {
      document.documentElement.style.setProperty('--cc-offset', '0px');
    }
  };

  const mountBanner = () => {
    if (banner) return;
    ensureStyles();
    banner = document.createElement('section');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'region');
    banner.innerHTML = `
      <p class="cookie-consent__text"><span class="cookie-consent__copy"></span><a class="cookie-consent__policy" href="privacy.html"></a></p>
      <div class="cookie-consent__actions">
        <button type="button" class="cookie-consent__btn cookie-consent__btn--decline"></button>
        <button type="button" class="cookie-consent__btn cookie-consent__btn--accept"></button>
      </div>
    `;
    banner.querySelector('.cookie-consent__btn--accept').addEventListener('click', () => choose(GRANTED));
    banner.querySelector('.cookie-consent__btn--decline').addEventListener('click', () => choose(DENIED));
    syncLabels();
    document.body.appendChild(banner);
    // Tell the page a banner is up, and expose its real height so the floating
    // WhatsApp / back-to-top buttons can sit above it instead of underneath.
    document.body.classList.add('has-cookie-banner');
    updateOffset();
    window.addEventListener('resize', updateOffset);
  };

  // Lets a future "Cookie settings" link reopen the banner.
  window.cookieConsent = {
    getChoice: readChoice,
    open: mountBanner,
    reset: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage failures.
      }
      mountBanner();
    },
  };

  window.addEventListener('travelday:languagechange', (event) => syncLabels(event.detail?.lang));

  if (initialChoice) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountBanner, { once: true });
  } else {
    mountBanner();
  }
})();
