(() => {
  const LANGS = ['zh', 'en', 'es', 'hi'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'travelday-site-language';
  const NAV_STYLE_ID = 'travelday-nav-standard-styles';
  const INQUIRY_STYLE_ID = 'travelday-inquiry-standard-styles';
  const TOP_BUTTON_STYLE_ID = 'travelday-top-button-styles';
  const SKIP_LINK_STYLE_ID = 'travelday-skip-link-styles';
  const NAV_LABELS = {
    zh: ['首页', '产品中心', '解决方案', '关于我们', '市场', '联系我们'],
    en: ['Home', 'Products', 'Solutions', 'About', 'Market', 'Contact'],
    es: ['Inicio', 'Productos', 'Soluciones', 'Nosotros', 'Mercado', 'Contacto'],
    hi: ['होम', 'उत्पाद', 'समाधान', 'हमारे बारे में', 'बाज़ार', 'संपर्क'],
  };

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

  const getProjectRootUrl = () => {
    const current = new URL(window.location.href);
    return new URL(current.pathname.includes('/mockups/') ? '../' : './', current);
  };

  const withLanguage = (url, lang) => {
    url.searchParams.set('lang', lang);
    return url.toString();
  };

  const getActiveLanguage = () => (isValidLang(state.lang) ? state.lang : readLanguage());

  const addLanguageToAnchor = (anchor, lang) => {
    const rawHref = anchor?.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

    try {
      const url = new URL(rawHref, document.baseURI);
      if (!['file:', 'http:', 'https:'].includes(url.protocol)) return;
      url.searchParams.set('lang', lang);
      anchor.setAttribute('href', url.toString());
    } catch {
      // Navigation still works if a browser refuses URL parsing for an unusual href.
    }
  };

  const getCurrentPageKey = () => {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.endsWith('/product-center-preview.html') || pathname.endsWith('/product-detail-preview.html')) return 'products';
    if (pathname.endsWith('/solution-preview.html')) return 'solutions';
    if (pathname.endsWith('/company-presence-preview.html')) return 'about';
    if (pathname.endsWith('/market-preview.html')) return 'market';
    return 'home';
  };

  const ensureNavStandardStyles = () => {
    const hasStylesCSS = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (link) => link.href.includes('styles.css'),
    );
    if (hasStylesCSS) return;
    if (document.getElementById(NAV_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = NAV_STYLE_ID;
    style.textContent = `
      @media (min-width: 981px) {
        body .primary-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 42px;
          font-family: var(--font-sans);
          color: #171514;
          font-size: 18px;
          font-weight: 800;
        }

        body .primary-nav a {
          position: relative;
          padding: 22px 0;
          font-family: var(--font-sans);
          color: #171514;
          font-size: 18px;
          font-weight: 800;
          line-height: normal;
          letter-spacing: 0;
          text-decoration: none;
          white-space: nowrap;
        }

        body .primary-nav a.active {
          color: #a87300;
        }

        body .primary-nav a.active::after {
          position: absolute;
          left: 50%;
          bottom: 12px;
          width: 24px;
          height: 3px;
          border-radius: 999px;
          background: #d39a00;
          content: "";
          transform: translateX(-50%);
        }
      }
    `;
    document.head.appendChild(style);
  };

  const ensureInquiryStandardStyles = () => {
    const hasStylesCSS = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (link) => link.href.includes('styles.css'),
    );
    if (hasStylesCSS) return;
    if (document.getElementById(INQUIRY_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = INQUIRY_STYLE_ID;
    style.textContent = `
      body .contact-card {
        border: 1px solid rgba(227, 214, 197, 0.96);
        border-radius: 28px;
        background: linear-gradient(180deg, #fbf7f0 0%, #f4eadf 100%);
        box-shadow: 0 16px 40px rgba(59, 43, 24, 0.06);
      }

      body .contact-card h2,
      body .contact-card .inquiry-form h2 {
        color: #171514;
        font-family: "SimHei", "Microsoft YaHei", sans-serif;
        letter-spacing: -0.03em;
      }

      body .contact-card .inquiry-form {
        border: 1px solid rgba(225, 213, 198, 0.86);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(251, 247, 240, 0.96), rgba(243, 234, 223, 0.96));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.54);
      }

      body .contact-card .inquiry-form input,
      body .contact-card .inquiry-form textarea {
        border: 1px solid #e1d6c7;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.92);
      }

      body .contact-card .inquiry-form input:focus,
      body .contact-card .inquiry-form textarea:focus {
        border-color: rgba(211, 154, 0, 0.5);
        box-shadow: 0 0 0 4px rgba(211, 154, 0, 0.09);
      }

/* shared-shell.js variant (comprehensive) */
      body .inquiry-panel,
      body .inquiry,
      body .contact-card {
        border: 1px solid rgba(227, 214, 197, 0.96);
        border-radius: 28px;
        background: linear-gradient(180deg, #fbf7f0 0%, #f4eadf 100%);
        box-shadow: 0 16px 40px rgba(59, 43, 24, 0.06);
      }

      body .inquiry-panel .inquiry-title,
      body .inquiry-head h2,
      body .contact-card .inquiry-form h2 {
        color: #171514;
        font-family: "SimHei", "Microsoft YaHei", sans-serif;
        font-size: clamp(32px, 3.6vw, 48px);
        font-weight: 900;
        line-height: 1.05;
        letter-spacing: -0.03em;
      }

      body .inquiry-panel .inquiry-desc,
      body .inquiry-head p,
      body .contact-card .footer-brand-copy p,
      body .contact-card .contact-info li,
      body .contact-card .contact-info .company-name,
      body .contact-card .form-status,
      body .inquiry-note {
        color: #6d6257;
      }

      body .inquiry-panel .inquiry-form-wrap,
      body .inquiry-form,
      body .contact-card .inquiry-form {
        border: 1px solid rgba(225, 213, 198, 0.86);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(251, 247, 240, 0.96), rgba(243, 234, 223, 0.96));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.54);
      }

      body .inquiry-form input,
      body .inquiry-form textarea {
        border: 1px solid #e1d6c7;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.92);
      }

      body .inquiry-form input:focus,
      body .inquiry-form textarea:focus {
        border-color: rgba(211, 154, 0, 0.5);
        box-shadow: 0 0 0 4px rgba(211, 154, 0, 0.09);
      }

      @media (max-width: 1180px) {
        body .inquiry-panel,
        body .inquiry {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const syncPrimaryNavigation = (lang) => {
    const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
    if (!navLinks.length) return;

    ensureNavStandardStyles();
    ensureInquiryStandardStyles();

    const root = getProjectRootUrl();
    const hasLocalContact = Boolean(document.getElementById('contact'));
    const hasLocalSolutions = Boolean(document.getElementById('solutions'));
    const hasLocalGlobal = Boolean(document.getElementById('global'));
    const isThankYouPage = window.location.pathname.toLowerCase().endsWith('/thank-you.html');
    const homeUrl = new URL('index.html', root);
    const labels = NAV_LABELS[lang] || NAV_LABELS[DEFAULT_LANG];
    const targets = [
      { key: 'home', href: withLanguage(new URL('index.html', root), lang) },
      { key: 'products', href: withLanguage(new URL('mockups/product-center-preview.html', root), lang) },
      {
        key: 'solutions',
        href: hasLocalSolutions
          ? '#solutions'
          : isThankYouPage
            ? `${withLanguage(homeUrl, lang)}#solutions`
            : withLanguage(new URL('mockups/solution-preview.html', root), lang),
      },
      { key: 'about', href: withLanguage(new URL('mockups/company-presence-preview.html', root), lang) },
      {
        key: 'market',
        href: hasLocalGlobal
          ? '#global'
          : isThankYouPage
            ? `${withLanguage(homeUrl, lang)}#global`
            : withLanguage(new URL('mockups/market-preview.html', root), lang),
      },
      {
        key: 'contact',
        href: hasLocalContact ? '#contact' : `${withLanguage(homeUrl, lang)}#contact`,
      },
    ];
    const activeKey = getCurrentPageKey();

    targets.forEach((target, index) => {
      const link = navLinks[index];
      if (!link) return;
      link.setAttribute('href', target.href);
      if (labels[index]) link.textContent = labels[index];
      link.classList.toggle('active', target.key === activeKey);
    });
  };

  const schedulePrimaryNavigationSync = (lang) => {
    window.setTimeout(() => syncPrimaryNavigation(lang), 0);
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
    syncPrimaryNavigation(lang);
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

      // Build custom dropdown wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'lang-dropdown';
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);
      select.style.position = 'absolute';
      select.style.opacity = '0';
      select.style.width = '100%';
      select.style.height = '100%';
      select.style.top = '0';
      select.style.left = '0';
      select.style.pointerEvents = 'none';
      select.style.zIndex = '0';

      // Create trigger button
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'lang-dropdown-trigger';
      trigger.setAttribute('aria-label', 'Language');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');

      // Create dropdown panel
      const panel = document.createElement('div');
      panel.className = 'lang-dropdown-panel';
      panel.setAttribute('role', 'listbox');

      const LANG_NAMES = { zh: '中文', en: 'English', es: 'Español', hi: 'हिन्दी' };

      Object.entries(LANG_NAMES).forEach(([value, label]) => {
        const option = document.createElement('div');
        option.className = 'lang-dropdown-option';
        option.setAttribute('role', 'option');
        option.dataset.value = value;
        option.textContent = label;
        if (value === state.lang) option.classList.add('is-active');
        option.addEventListener('click', () => {
          select.value = value;
          setLanguage(value);
          closeDropdown();
        });
        panel.appendChild(option);
      });

      wrapper.appendChild(trigger);
      wrapper.appendChild(panel);

      function updateTrigger() {
        trigger.textContent = LANG_NAMES[state.lang] || 'English';
      }
      updateTrigger();

      function updateActive() {
        panel.querySelectorAll('.lang-dropdown-option').forEach((opt) => {
          opt.classList.toggle('is-active', opt.dataset.value === state.lang);
        });
      }

      function openDropdown() {
        wrapper.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        updateActive();
      }

      function closeDropdown() {
        wrapper.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (wrapper.classList.contains('is-open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) closeDropdown();
      });

      // Close on Escape
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDropdown();
      });

      // Sync trigger when language changes externally
      window.addEventListener('travelday:languagechange', (e) => {
        const lang = e.detail?.lang || state.lang;
        trigger.textContent = LANG_NAMES[lang] || 'English';
        updateActive();
      });

      // Keep native select working as fallback
      select.addEventListener('change', (event) => setLanguage(event.target.value));
    });
  };

  const bindNavigationLanguageFallback = () => {
    document.querySelectorAll('.primary-nav, .brand, .quote-button').forEach((target) => {
      if (target.dataset.languageFallbackBound === 'true') return;
      target.dataset.languageFallbackBound = 'true';
      target.addEventListener(
        'click',
        (event) => {
          const anchor = event.target.closest?.('a[href]');
          if (!anchor || !target.contains(anchor)) return;
          addLanguageToAnchor(anchor, getActiveLanguage());
        },
        true,
      );
    });
  };

  const bindMobileMenu = () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const nav = document.getElementById('primaryNav');
    if (!mobileMenuButton || !nav || mobileMenuButton.dataset.shellBound === 'true') return;

    mobileMenuButton.dataset.shellBound = 'true';

    const menuLabels = () => {
      const labels = {
        zh: ['打开导航菜单', '关闭导航菜单'],
        en: ['Open navigation menu', 'Close navigation menu'],
        es: ['Abrir menú de navegación', 'Cerrar menú de navegación'],
        hi: ['नेविगेशन मेनू खोलें', 'नेविगेशन मेनू बंद करें'],
      };
      return labels[getActiveLanguage()] || labels.en;
    };

    const syncMenuLabel = () => {
      const [openLabel, closeLabel] = menuLabels();
      mobileMenuButton.setAttribute(
        'aria-label',
        mobileMenuButton.getAttribute('aria-expanded') === 'true' ? closeLabel : openLabel,
      );
    };

    const closeMobileMenu = () => {
      document.body.classList.remove('is-menu-open');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      syncMenuLabel();
      nav.classList.remove('is-open');
    };

    mobileMenuButton.addEventListener('click', () => {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      document.body.classList.toggle('is-menu-open', !expanded);
      mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
      syncMenuLabel();
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
    window.addEventListener('travelday:languagechange', syncMenuLabel);
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });
    syncMenuLabel();
  };

  const ensureSkipLink = () => {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.skip-link')) return;
    if (!document.getElementById(SKIP_LINK_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = SKIP_LINK_STYLE_ID;
      style.textContent = `
        .skip-link { position: fixed; z-index: 2000; top: 12px; left: 12px; padding: 10px 14px; border-radius: 8px; background: #141312; color: #fff; font-weight: 800; transform: translateY(-160%); }
        .skip-link:focus { transform: translateY(0); }
      `;
      document.head.appendChild(style);
    }
    if (!main.id) main.id = 'main-content';
    main.setAttribute('tabindex', '-1');
    const link = document.createElement('a');
    link.className = 'skip-link';
    link.href = `#${main.id}`;
    link.textContent = getActiveLanguage() === 'zh' ? '跳至主要内容' : 'Skip to main content';
    document.body.prepend(link);
    window.addEventListener('travelday:languagechange', (event) => {
      link.textContent = event.detail?.lang === 'zh' ? '跳至主要内容' : 'Skip to main content';
    });
  };

  const ensureTopButtonStyles = () => {
    const hasStylesCSS = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (link) => link.href.includes('styles.css'),
    );
    if (hasStylesCSS) return;
    if (document.getElementById(TOP_BUTTON_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = TOP_BUTTON_STYLE_ID;
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
    syncPrimaryNavigation(next);

    const topButton = ensureTopButton();
    if (topButton) {
      topButton.textContent = 'Top';
      topButton.setAttribute('aria-label', next === 'zh' ? '返回顶部' : 'Back to top');
    }

    if (options.updateHistory !== false) {
      updateAddressBar(next);
    }

    window.dispatchEvent(new CustomEvent('travelday:languagechange', { detail: { lang: next } }));
    schedulePrimaryNavigationSync(next);
    return next;
  };

  const init = (options = {}) => {
    if (state.initialized) return state.lang;
    state.initialized = true;
    state.lang = readLanguage(options.defaultLang);
    syncDocumentLanguage(state.lang);
    persistLanguage(state.lang);
    bindLanguageSelects();
    bindNavigationLanguageFallback();
    bindMobileMenu();
    ensureSkipLink();
    ensureTopButton();
    ensureInquiryStandardStyles();
    syncLanguageLinks(state.lang);
    syncPrimaryNavigation(state.lang);
    const next = setLanguage(state.lang, { updateHistory: false });
    schedulePrimaryNavigationSync(next);
    document.body.classList.remove('i18n-loading');
    return next;
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
