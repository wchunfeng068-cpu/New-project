(() => {
  const LANGS = ['zh', 'en', 'es', 'hi'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'travelday-site-language';

  const state = {
    lang: DEFAULT_LANG,
    initialized: false,
  };

  const isValidLang = (value) => LANGS.includes(value);

  const getDefaultLang = (fallback = DEFAULT_LANG) => {
    const declared = document.documentElement?.dataset?.defaultLang;
    if (isValidLang(declared)) return declared;
    return isValidLang(fallback) ? fallback : DEFAULT_LANG;
  };

  const readLanguage = (fallback = DEFAULT_LANG) => {
    try {
      const queryLang = new URLSearchParams(window.location.search).get('lang');
      if (isValidLang(queryLang)) return queryLang;
    } catch {
      // Ignore malformed URLs and fall back to storage/default language.
    }

    try {
      const storedLang = localStorage.getItem(STORAGE_KEY);
      if (isValidLang(storedLang)) return storedLang;
    } catch {
      // Some file:// contexts can block storage access.
    }

    return getDefaultLang(fallback);
  };

  const persistLanguage = (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage is best-effort only.
    }
  };

  const syncLanguageLinks = (lang) => {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

      let url;
      try {
        url = new URL(rawHref, document.baseURI);
      } catch {
        return;
      }

      if (!['file:', 'http:', 'https:'].includes(url.protocol)) return;
      url.searchParams.set('lang', lang);
      anchor.href = url.toString();
    });
  };

  const syncLanguageSelects = (lang) => {
    document.querySelectorAll('.language-select').forEach((select) => {
      if (select.value !== lang) select.value = lang;
    });
  };

  const syncDocumentLanguage = (lang) => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.documentElement.dataset.lang = lang;
  };

  const updateAddressBar = (lang) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({ lang }, '', url);
    } catch {
      // The page still updates visually even if URL rewriting is blocked.
    }
  };

  const bindLanguageSelects = () => {
    document.querySelectorAll('.language-select').forEach((select) => {
      if (select.dataset.shellBound === 'true') return;
      select.dataset.shellBound = 'true';
      select.value = state.lang;
      select.addEventListener('change', (event) => setLanguage(event.target.value));
      select.addEventListener('input', (event) => setLanguage(event.target.value));
    });
  };

  const bindMobileMenu = () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const nav = document.getElementById('primaryNav');
    if (!mobileMenuButton || !nav || mobileMenuButton.dataset.shellBound === 'true') return;

    mobileMenuButton.dataset.shellBound = 'true';

    const closeMobileMenu = () => {
      document.body.classList.remove('is-menu-open');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };

    mobileMenuButton.addEventListener('click', () => {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      document.body.classList.toggle('is-menu-open', !expanded);
      mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth > 980) closeMobileMenu();
      },
      { passive: true },
    );
  };

  const ensureTopButtonStyles = () => {
    if (document.getElementById('travelday-top-button-styles')) return;

    const style = document.createElement('style');
    style.id = 'travelday-top-button-styles';
    style.textContent = `
      .floating-top {
        position: fixed;
        right: max(16px, calc((100vw - min(1500px, calc(100vw - 42px))) / 2 - 72px));
        bottom: 86px;
        z-index: 120;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #d39a00;
        color: #fff;
        font-size: 14px;
        font-weight: 900;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px);
        transition: opacity 180ms ease, transform 180ms ease;
      }

      .floating-top.is-visible {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      @media (max-width: 720px) {
        .floating-top {
          right: 14px;
          bottom: 18px;
          width: 44px;
          height: 44px;
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const ensureTopButton = () => {
    ensureTopButtonStyles();

    let topButton = document.querySelector('.floating-top');
    if (!topButton) {
      topButton = document.createElement('a');
      topButton.href = '#top';
      topButton.className = 'floating-top';
      topButton.textContent = 'Top';
      topButton.setAttribute('aria-label', 'Back to top');
      topButton.dataset.shellInjected = 'true';
      document.body.appendChild(topButton);
    }

    if (topButton.dataset.shellBound === 'true') return topButton;
    topButton.dataset.shellBound = 'true';

    const toggleVisibility = () => {
      const visible = window.scrollY > 500;
      topButton.classList.toggle('is-visible', visible);
    };

    topButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    window.addEventListener('resize', toggleVisibility, { passive: true });
    toggleVisibility();
    return topButton;
  };

  const setLanguage = (lang, options = {}) => {
    const next = isValidLang(lang) ? lang : getDefaultLang();
    state.lang = next;
    persistLanguage(next);
    syncDocumentLanguage(next);
    syncLanguageSelects(next);
    syncLanguageLinks(next);

    const topButton = ensureTopButton();
    if (topButton) {
      topButton.textContent = 'Top';
      topButton.setAttribute('aria-label', next === 'zh' ? '返回顶部' : 'Back to top');
    }

    if (options.updateHistory !== false) {
      updateAddressBar(next);
    }

    window.dispatchEvent(new CustomEvent('travelday:languagechange', { detail: { lang: next } }));
    return next;
  };

  const init = (options = {}) => {
    if (state.initialized) return state.lang;
    state.initialized = true;
    state.lang = readLanguage(options.defaultLang);
    syncDocumentLanguage(state.lang);
    persistLanguage(state.lang);
    bindLanguageSelects();
    bindMobileMenu();
    ensureTopButton();
    syncLanguageLinks(state.lang);
    return setLanguage(state.lang, { updateHistory: false });
  };

  window.traveldayShell = {
    LANGS,
    STORAGE_KEY,
    getLanguage: () => state.lang,
    readLanguage,
    setLanguage,
    syncLanguageLinks,
    init,
  };
  window.setSiteLanguage = setLanguage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  } else {
    init();
  }
})();
