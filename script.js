import { TRANSLATIONS, LANGS, DEFAULT_LANG, NAV_LABELS, readLanguage, persistLanguage, getProjectRootUrl, withLanguage, addLanguageToAnchor, getCurrentPageKey } from './src/i18n.js';
import { initSharedShell, getLanguage } from './src/shell.js';

(() => {
  // Disable browser scroll restoration — always start at top on navigation
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';



  const state = {
    lang: DEFAULT_LANG,
    videoReady: false,
  };

  const PRODUCT_LABELS = {
    zh: ['行李箱', '配件', '公司风采'],
    en: ['Luggage', 'ACCESSORIES', 'Company Presence'],
    es: ['Equipaje', 'Accesorios', 'Presencia de la empresa'],
    hi: ['सामान', 'सहायक उपकरण', 'कंपनी की उपस्थिति'],
  };

  const HERO_STAT_LABELS = {
    zh: [
      ['自2006年起', '行业经验'],
      ['1000+ 集装箱', '年出口量'],
      ['OEM & ODM', '一站式解决方案'],
      ['全球市场', '值得信赖的合作伙伴'],
    ],
    en: [
      ['Since 2006', 'Industry experience'],
      ['1000+ containers', 'Annual export volume'],
      ['OEM & ODM', 'One-stop solutions'],
      ['Global market', 'Trusted partner'],
    ],
    es: [
      ['Desde 2006', 'Experiencia'],
      ['1000+ contenedores', 'Volumen anual'],
      ['OEM & ODM', 'Solución integral'],
      ['Mercado global', 'Socio de confianza'],
    ],
    hi: [
      ['2006 से', 'उद्योग अनुभव'],
      ['1000+ कंटेनर', 'वार्षिक निर्यात मात्रा'],
      ['OEM & ODM', 'एक ही स्थान पर समाधान'],
      ['वैश्विक बाज़ार', 'विश्वसनीय भागीदार'],
    ],
  };

  const STATS_BAND_LABELS = {
    zh: [
      ['20+', '行业经验'],
      ['50+', '团队成员'],
      ['1000+', '全球客户'],
      ['5%', '净利润率'],
    ],
    en: [
      ['20+', 'Years in business'],
      ['50+', 'Team members'],
      ['1000+', 'Global customers'],
      ['5%', 'Net profit margin'],
    ],
    es: [
      ['20+', 'Años de experiencia'],
      ['50+', 'Miembros del equipo'],
      ['1000+', 'Clientes globales'],
      ['5%', 'Margen neto'],
    ],
    hi: [
      ['20+', 'उद्योग अनुभव'],
      ['50+', 'टीम के सदस्य'],
      ['1000+', 'वैश्विक ग्राहक'],
      ['5%', 'शुद्ध लाभ मार्जिन'],
    ],
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const updateLanguageInUrl = (lang) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({ lang }, '', url);
    } catch {
      // Some file:// contexts or locked-down browsers can block history updates.
    }
  };







  const setText = (selector, value) => {
    const node = $(selector);
    if (node && value != null) node.textContent = value;
  };

  const setHTML = (selector, value) => {
    const node = $(selector);
    if (node && value != null) node.innerHTML = value;
  };

  const setDocText = (value) => {
    document.title = value.title;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', value.description);
    document.documentElement.lang = value.langTag || value.lang || 'zh-CN';
  };

  const getViewportBucket = () => {
    if (window.innerWidth <= 640) return 'phone';
    if (window.innerWidth <= 980) return 'tablet';
    return 'desktop';
  };

  const applyTypeTuning = (node, tuning) => {
    if (!node || !tuning) return;
    node.style.fontSize = tuning.fontSize;
    node.style.lineHeight = tuning.lineHeight;
    node.style.maxWidth = tuning.maxWidth;
    node.style.minHeight = tuning.minHeight;
    node.style.paddingTop = tuning.paddingTop;
    node.style.letterSpacing = '0';
  };

  const applyResponsiveTypeTuning = (lang) => {
    const heroTitle = $('.hero h1');
    const productionTitle = $('.production-copy h2');
    const bucket = getViewportBucket();

    const heroTuning = {
      desktop: {
        zh: { fontSize: '68px', lineHeight: '1.03', maxWidth: '520px', minHeight: '186px', paddingTop: '0px' },
        en: { fontSize: '40px', lineHeight: '1.12', maxWidth: '560px', minHeight: '186px', paddingTop: '40px' },
        es: { fontSize: '44px', lineHeight: '1.1', maxWidth: '560px', minHeight: '186px', paddingTop: '20px' },
        hi: { fontSize: '48px', lineHeight: '1.1', maxWidth: '560px', minHeight: '186px', paddingTop: '12px' },
      },
      tablet: {
        zh: { fontSize: '46px', lineHeight: '1.08', maxWidth: '520px', minHeight: '150px', paddingTop: '0px' },
        en: { fontSize: '34px', lineHeight: '1.14', maxWidth: '480px', minHeight: '150px', paddingTop: '24px' },
        es: { fontSize: '36px', lineHeight: '1.12', maxWidth: '500px', minHeight: '150px', paddingTop: '18px' },
        hi: { fontSize: '38px', lineHeight: '1.12', maxWidth: '500px', minHeight: '150px', paddingTop: '12px' },
      },
      phone: {
        zh: { fontSize: '36px', lineHeight: '1.08', maxWidth: '100%', minHeight: '126px', paddingTop: '0px' },
        en: { fontSize: '28px', lineHeight: '1.14', maxWidth: '100%', minHeight: '126px', paddingTop: '18px' },
        es: { fontSize: '30px', lineHeight: '1.12', maxWidth: '100%', minHeight: '126px', paddingTop: '14px' },
        hi: { fontSize: '30px', lineHeight: '1.12', maxWidth: '100%', minHeight: '126px', paddingTop: '10px' },
      },
    };

    const productionTuning = {
      desktop: {
        zh: { fontSize: '55px', lineHeight: '1.2', maxWidth: '100%', minHeight: '132px', paddingTop: '0px' },
        en: { fontSize: '44px', lineHeight: '1.18', maxWidth: '100%', minHeight: '132px', paddingTop: '10px' },
        es: { fontSize: '42px', lineHeight: '1.18', maxWidth: '100%', minHeight: '132px', paddingTop: '8px' },
        hi: { fontSize: '46px', lineHeight: '1.18', maxWidth: '100%', minHeight: '132px', paddingTop: '6px' },
      },
      tablet: {
        zh: { fontSize: '42px', lineHeight: '1.18', maxWidth: '100%', minHeight: '108px', paddingTop: '0px' },
        en: { fontSize: '34px', lineHeight: '1.18', maxWidth: '100%', minHeight: '108px', paddingTop: '8px' },
        es: { fontSize: '34px', lineHeight: '1.18', maxWidth: '100%', minHeight: '108px', paddingTop: '6px' },
        hi: { fontSize: '36px', lineHeight: '1.18', maxWidth: '100%', minHeight: '108px', paddingTop: '4px' },
      },
      phone: {
        zh: { fontSize: '34px', lineHeight: '1.16', maxWidth: '100%', minHeight: '92px', paddingTop: '0px' },
        en: { fontSize: '28px', lineHeight: '1.16', maxWidth: '100%', minHeight: '92px', paddingTop: '6px' },
        es: { fontSize: '28px', lineHeight: '1.16', maxWidth: '100%', minHeight: '92px', paddingTop: '4px' },
        hi: { fontSize: '30px', lineHeight: '1.16', maxWidth: '100%', minHeight: '92px', paddingTop: '2px' },
      },
    };

    applyTypeTuning(heroTitle, (heroTuning[bucket] || heroTuning.desktop)[lang] || heroTuning[bucket].zh);
    applyTypeTuning(
      productionTitle,
      (productionTuning[bucket] || productionTuning.desktop)[lang] || productionTuning[bucket].zh,
    );
  };

  const applyI18n = (lang) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    setDocText({ ...t, lang, langTag: lang === 'zh' ? 'zh-CN' : lang });
    document.documentElement.dataset.lang = lang;
    document.documentElement.style.setProperty('--hover-entry-label', `"${t.hoverEntry}"`);

    // Header
    $$('#primaryNav a').forEach((link, index) => {
      if (t.nav[index]) link.textContent = t.nav[index];
    });
    setText('.quote-button', t.quote);
    const langSelect = $('.language-select');
    if (langSelect && langSelect.value !== lang) langSelect.value = lang;
    const menuButton = $('.mobile-menu-button');
    if (menuButton) {
      const menuLabels = {
        zh: ['打开导航菜单', '关闭导航菜单'],
        en: ['Open navigation menu', 'Close navigation menu'],
        es: ['Abrir menú de navegación', 'Cerrar menú de navegación'],
        hi: ['नेविगेशन मेनू खोलें', 'नेविगेशन मेनू बंद करें'],
      };
      const [openLabel, closeLabel] = menuLabels[lang] || menuLabels.en;
      menuButton.dataset.menuOpenLabel = openLabel;
      menuButton.dataset.menuCloseLabel = closeLabel;
      menuButton.setAttribute('aria-label', menuButton.getAttribute('aria-expanded') === 'true' ? closeLabel : openLabel);
    }
    document.documentElement.dataset.navReady = 'true';

    // Hero
    setText('[data-i18n="heroEyebrow"]', t.heroEyebrow);
    setHTML('[data-i18n="heroTitle"]', t.heroTitle.replace(/\n/g, '<br />'));
    setText('[data-i18n="heroButtonPrimary"]', t.heroButtonPrimary);
    setText('[data-i18n="heroButtonSecondary"]', t.heroButtonSecondary);
    applyResponsiveTypeTuning(lang);

    const heroStats = HERO_STAT_LABELS[lang] || t.heroStats;
    const statsBand = STATS_BAND_LABELS[lang] || t.stats;
    const productLabels = PRODUCT_LABELS[lang] || t.products;

    // Hero stats
    $$('.hero-stats article').forEach((article, index) => {
      const data = heroStats[index];
      if (!data) return;
      const strong = $('strong', article);
      const p = $('p', article);
      if (strong) strong.textContent = data[0];
      if (p) p.textContent = data[1];
    });

    // Products
    $$('#products .product-card h3').forEach((node, index) => {
      if (productLabels[index]) node.textContent = productLabels[index];
    });

    // Video
    setText('.video-copy .section-kicker', t.videoKicker);
    setText('.video-copy h2', t.videoTitle);
    setText('.video-copy p:nth-of-type(2)', t.videoDesc);
    setText('.video-copy .button-video', t.videoButton);
    const videoHitArea = $('[data-open-video][aria-label]');
    if (videoHitArea) videoHitArea.setAttribute('aria-label', `${t.videoButton}`);
    const playButton = $('.play-button[data-open-video]');
    if (playButton) playButton.setAttribute('aria-label', `${t.videoButton}`);

    // Served cards
    $$('#solutions .mini-card').forEach((card, index) => {
      const data = t.served[index];
      if (!data) return;
      const h3 = $('h3', card);
      const p = $('p', card);
      if (h3) h3.textContent = data[0];
      if (p) p.textContent = data[1];
    });

    // Series
    setText('[data-section="series"] .series-copy h2', t.seriesTitle);
    setText('[data-section="series"] .series-copy p', t.seriesDesc);

    // Dual showcase
    $$('.dual-showcase .dual-card').forEach((card, index) => {
      const data = t.dual[index];
      if (!data) return;
      const h2 = $('h2', card);
      const p = $('p', card);
      if (h2) h2.textContent = data[0];
      if (p) p.textContent = data[1];
    });

    // Why cards
    $$('#about .mini-card').forEach((card, index) => {
      const data = t.why[index];
      if (!data) return;
      const h3 = $('h3', card);
      const p = $('p', card);
      if (h3) h3.textContent = data[0];
      if (p) p.textContent = data[1];
    });

    // Production panel
    setHTML('[data-i18n="productionTitle"]', t.productionTitle.replace(/\n/g, '<br />'));
    setText('[data-i18n="productionEyebrow"]', t.productionEyebrow);
    setText('[data-i18n="productionProofOneTitle"]', t.productionProofOneTitle);
    setText('[data-i18n="productionProofOneDesc"]', t.productionProofOneDesc);
    setText('[data-i18n="productionProofTwoTitle"]', t.productionProofTwoTitle);
    setText('[data-i18n="productionProofTwoDesc"]', t.productionProofTwoDesc);

    // Stats band
    setText('.stats-band .stats-title p', t.statsTitle);
    $$('.stats-band dt').forEach((node, index) => {
      if (statsBand[index]) node.textContent = statsBand[index][0];
    });
    $$('.stats-band dd').forEach((node, index) => {
      if (statsBand[index]) node.textContent = statsBand[index][1];
    });

    // Global
    setText('#global .section-kicker', t.globalKicker);
    setText('#global h2', t.globalTitle);
    setText('#global .global-copy > p:nth-of-type(2)', t.globalDesc);
    setText('#global .button-primary', t.globalButton);

    // Contact
    setText('#contact .footer-brand-copy p', t.contactDesc);
    setText('#contact .inquiry-form h2', t.quoteTitle);
    $$('#contact .inquiry-form label').forEach((label, index) => {
      const span = $('span', label);
      if (!span) return;
      if (index === 0) span.textContent = t.formName;
      if (index === 1) span.textContent = t.formCompany;
      if (index === 2) span.textContent = t.formEmail;
      if (index === 3) span.textContent = t.formMessage;
    });
    setText('.form-submit', t.formSubmit);

    // Footer
    setText('.site-footer > p', t.footer);
    $$('.site-footer nav a').forEach((link, index) => {
      if (t.footerLinks[index]) link.textContent = t.footerLinks[index];
    });
    const backTop = $('.site-footer .back-top');
    if (backTop) backTop.setAttribute('aria-label', lang === 'zh' ? '返回顶部' : 'Back to top');

    // Modal
    const closeButton = $('.modal-close');
    if (closeButton) closeButton.textContent = '×';
    const closeLabel = t.modalClose;
    const modalDialog = $('.modal-dialog');
    if (modalDialog) modalDialog.setAttribute('aria-label', closeLabel);
  };

  let videoTrigger = null;

  const openVideo = async () => {
    const modal = $('[data-video-modal]');
    const player = $('[data-video-player]');
    if (!modal || !player) return;
    if (!player.src && player.dataset.src) {
      player.src = player.dataset.src;
    }
    videoTrigger = document.activeElement;
    modal.classList.add('is-open', 'is-loading');
    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('[data-close-video]');
    if (closeBtn) closeBtn.focus();
    try {
      player.currentTime = 0;
      await player.play();
      modal.classList.remove('is-loading');
    } catch {
      modal.classList.remove('is-loading');
    }
  };

  const bindRevealAnimations = () => {
    const elements = $$('[data-reveal]');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.12 },
    );
    elements.forEach((el) => observer.observe(el));
  };

  const bindLazyBackgrounds = () => {
    const elements = $$('[data-lazy-background]');
    if (!elements.length) return;

    const loadBackground = (element) => {
      const src = element.dataset.lazyBackground;
      if (!src || element.dataset.backgroundLoaded === 'true') return;
      element.style.setProperty('--lazy-background', `url("${src}")`);
      element.dataset.backgroundLoaded = 'true';
      element.classList.add('bg-loaded');
    };

    if (!('IntersectionObserver' in window)) {
      elements.forEach(loadBackground);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadBackground(entry.target);
          instance.unobserve(entry.target);
        });
      },
      { rootMargin: '300px 0px' },
    );
    elements.forEach((element) => observer.observe(element));
  };

  const closeVideo = () => {
    const modal = $('[data-video-modal]');
    const player = $('[data-video-player]');
    if (!modal || !player) return;
    player.pause();
    player.currentTime = 0;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (videoTrigger) videoTrigger.focus();
  };

  const bindVideo = () => {
    $$('[data-open-video]').forEach((button) => {
      button.addEventListener('click', openVideo);
    });
    $$('[data-close-video]').forEach((button) => {
      button.addEventListener('click', closeVideo);
    });
    const modal = $('[data-video-modal]');
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeVideo();
      });
      modal.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const focusable = modal.querySelectorAll('button, [href], video, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeVideo();
    });
  };


  // bindContactForm removed — shared-inquiry.js handles real form submission to formsubmit.co
  // The old handler showed a fake success message without sending data anywhere.

  const bindTopButton = () => {
    const topButton = $('.floating-top');
    if (!topButton) return;
    const toggle = () => {
      topButton.classList.toggle('is-visible', window.scrollY > 500);
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  };


  const init = () => {
    initSharedShell();
    // 文本翻译由统一外壳（src/shell.js）在语言变更时广播 travelday:languagechange 驱动
    window.addEventListener('travelday:languagechange', (event) => {
      applyI18n(event.detail?.lang || getLanguage());
    });
    applyI18n(getLanguage());

    bindVideo();
    bindLazyBackgrounds();
    bindRevealAnimations();
    bindTopButton();


    document.body.classList.remove('i18n-loading');
    let resizeRaf = 0;
    window.addEventListener(
      'resize',
      () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          applyResponsiveTypeTuning(getLanguage());
        });
      },
      { passive: true },
    );

    // Page transition: fade out before navigating to internal links
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
      // Only intercept links to internal pages
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
      } catch { return; }
      event.preventDefault();
      document.body.classList.add('is-exiting');
      setTimeout(() => { window.location.assign(href); }, 200);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
