(() => {
  const LANGS = ["zh", "en", "es", "hi"];

  const readLang = () => {
    const fromShell = window.traveldayShell?.getLanguage?.();
    if (LANGS.includes(fromShell)) return fromShell;
    const docLang = document.documentElement.dataset.lang;
    if (LANGS.includes(docLang)) return docLang;
    try {
      const queryLang = new URLSearchParams(window.location.search).get("lang");
      if (LANGS.includes(queryLang)) return queryLang;
    } catch {
      // Ignore malformed URLs.
    }
    return "en";
  };

  const copy = {
    zh: {
      title: "TRAVELDAY | 公司风采",
      description: "TRAVELDAY 公司风采页面，展示团队、会谈场景与品牌气质。",
      nav: ["首页", "产品中心", "解决方案", "关于我们", "市场", "联系我们"],
      quote: "获取报价 →",
      lang: ["中文", "English", "Español", "हिन्दी"],
      brandLabel: "TRAVELDAY 首页",
      navLabel: "主导航",
      heroLabel: "公司风采主视觉",
      heroEyebrow: "Company Presence",
      heroTitle: "不费力的精致",
      heroIntro: "让品牌的自信、专业与质感在安静里被看见。",
      heroPoints: ["优雅", "专业", "全球视野", "沉稳自信"],
      heroPointsLabel: "品牌气质",
      heroImageAlt: "品牌气质展示，模特与旅行箱同框",
      heroNoteTitle: "Travel in Style",
      heroNote: "光线、材质、姿态和节奏，一起把品牌的轻奢感稳稳托住。",
      storyEyebrow: "Meeting Culture",
      storyTitle: "把专业放在对话里，把信任放在细节里。",
      storyIntro: "我们把会谈场景保留得足够安静，让人、资料、笔记本和样品箱各自占据合适的位置，视觉上没有喧闹，只有明确的秩序感。",
      storyImageAlt: "会议室场景，团队围绕旅行箱方案沟通",
      galleryEyebrow: "Editorial Moments",
      galleryTitle: "出行、会面、日常，都可以很克制。",
      galleryAlts: ["旅行场景编辑图一", "旅行场景编辑图二", "旅行场景编辑图三", "会谈场景编辑图"],
      footerLeft: "TRAVELDAY 公司风采",
      footerRight: "轻奢 / 安静 / 有序 / 精准",
      top: "顶部",
      topLabel: "返回顶部",
      memberToggleShow: "查看成员",
      memberToggleHide: "收起查看",
    },
    en: {
      title: "TRAVELDAY | Company Presence",
      description: "TRAVELDAY company presence page showcasing team, meeting culture, and brand atmosphere.",
      nav: ["Home", "Products", "Solutions", "About", "Market", "Contact"],
      quote: "Get Quote ->",
      lang: ["Chinese", "English", "Spanish", "Hindi"],
      brandLabel: "TRAVELDAY home",
      navLabel: "Primary navigation",
      heroLabel: "Company Presence hero",
      heroEyebrow: "Company Presence",
      heroTitle: "Effortless refinement",
      heroIntro: "Let confidence, professionalism, and premium detail be seen in quiet restraint.",
      heroPoints: ["Elegant", "Professional", "Global", "Calm Confidence"],
      heroPointsLabel: "Brand traits",
      heroImageAlt: "Brand portrait with a luggage showcase",
      heroNoteTitle: "Travel in Style",
      heroNote: "Light, materials, posture, and rhythm work together for a calm premium feel.",
      storyEyebrow: "Meeting Culture",
      storyTitle: "Put professionalism in the conversation and trust in the details.",
      storyIntro: "We keep the meeting scene quiet enough for people, documents, laptops, and sample cases to sit in the right places, with a clear visual order instead of noise.",
      storyImageAlt: "Meeting room scene with the team discussing a luggage solution",
      galleryEyebrow: "Editorial Moments",
      galleryTitle: "Travel, meetings, and daily moments can all feel composed.",
      galleryAlts: ["Travel editorial scene one", "Travel editorial scene two", "Travel editorial scene three", "Meeting editorial scene"],
      footerLeft: "TRAVELDAY Company Presence",
      footerRight: "Minimal luxury / calm / structured / precise",
      top: "Top",
      topLabel: "Back to top",
      memberToggleShow: "View members",
      memberToggleHide: "Hide members",
    },
    es: {
      title: "TRAVELDAY | Presencia de empresa",
      description: "Página de presencia de TRAVELDAY con equipo, cultura de reuniones y atmósfera de marca.",
      nav: ["Inicio", "Productos", "Soluciones", "Nosotros", "Mercado", "Contacto"],
      quote: "Solicitar cotización →",
      lang: ["Chino", "English", "Español", "Hindi"],
      brandLabel: "Inicio de TRAVELDAY",
      navLabel: "Navegación principal",
      heroLabel: "Imagen principal de presencia de empresa",
      heroEyebrow: "Company Presence",
      heroTitle: "Refinamiento sin esfuerzo",
      heroIntro: "La confianza, la profesionalidad y el detalle premium se muestran con calma y contención.",
      heroPoints: ["Elegante", "Profesional", "Global", "Confianza serena"],
      heroPointsLabel: "Rasgos de marca",
      heroImageAlt: "Retrato de marca con muestra de equipaje",
      heroNoteTitle: "Travel in Style",
      heroNote: "La luz, los materiales, la postura y el ritmo crean una sensación premium y tranquila.",
      storyEyebrow: "Meeting Culture",
      storyTitle: "Pon la profesionalidad en la conversación y la confianza en los detalles.",
      storyIntro: "Mantenemos la escena de reunión lo bastante tranquila para que personas, documentos, portátiles y muestras ocupen su lugar con orden visual claro.",
      storyImageAlt: "Sala de reuniones con el equipo comentando una solución de equipaje",
      galleryEyebrow: "Editorial Moments",
      galleryTitle: "Viajes, reuniones y momentos diarios pueden sentirse contenidos.",
      galleryAlts: ["Escena editorial de viaje uno", "Escena editorial de viaje dos", "Escena editorial de viaje tres", "Escena editorial de reunión"],
      footerLeft: "TRAVELDAY Presencia de empresa",
      footerRight: "Lujo minimalista / calma / estructura / precisión",
      top: "Arriba",
      topLabel: "Volver arriba",
      memberToggleShow: "Ver miembros",
      memberToggleHide: "Ocultar miembros",
    },
    hi: {
      title: "TRAVELDAY | कंपनी प्रस्तुति",
      description: "TRAVELDAY कंपनी प्रस्तुति पेज, जिसमें टीम, बैठक संस्कृति और ब्रांड माहौल दिखाया गया है।",
      nav: ["होम", "उत्पाद", "समाधान", "हमारे बारे में", "बाज़ार", "संपर्क"],
      quote: "कोटेशन लें →",
      lang: ["चीनी", "English", "Español", "हिन्दी"],
      brandLabel: "TRAVELDAY होम",
      navLabel: "मुख्य नेविगेशन",
      heroLabel: "कंपनी प्रस्तुति मुख्य दृश्य",
      heroEyebrow: "Company Presence",
      heroTitle: "सहज परिष्कार",
      heroIntro: "विश्वास, पेशेवरता और प्रीमियम विवरण शांत संयम में दिखाई देते हैं।",
      heroPoints: ["सुरुचिपूर्ण", "पेशेवर", "वैश्विक", "शांत आत्मविश्वास"],
      heroPointsLabel: "ब्रांड विशेषताएँ",
      heroImageAlt: "सामान प्रदर्शन के साथ ब्रांड पोर्ट्रेट",
      heroNoteTitle: "Travel in Style",
      heroNote: "रोशनी, सामग्री, मुद्रा और लय मिलकर शांत प्रीमियम अनुभव बनाते हैं।",
      storyEyebrow: "Meeting Culture",
      storyTitle: "पेशेवरता बातचीत में और भरोसा विवरणों में रखें।",
      storyIntro: "हम बैठक दृश्य को इतना शांत रखते हैं कि लोग, दस्तावेज़, लैपटॉप और नमूना केस सही जगह पर रहें और दृश्य व्यवस्था साफ दिखे।",
      storyImageAlt: "बैठक कक्ष में टीम सामान समाधान पर चर्चा करती हुई",
      galleryEyebrow: "Editorial Moments",
      galleryTitle: "यात्रा, बैठक और रोज़मर्रा के क्षण भी संयमित दिख सकते हैं।",
      galleryAlts: ["यात्रा संपादकीय दृश्य एक", "यात्रा संपादकीय दृश्य दो", "यात्रा संपादकीय दृश्य तीन", "बैठक संपादकीय दृश्य"],
      footerLeft: "TRAVELDAY कंपनी प्रस्तुति",
      footerRight: "मिनिमल लक्जरी / शांत / संरचित / सटीक",
      top: "ऊपर",
      topLabel: "ऊपर वापस जाएँ",
      memberToggleShow: "सदस्य देखें",
      memberToggleHide: "सदस्य छिपाएँ",
    },
  };

  const teamCopy = {
    zh: {
      eyebrow: "Employee Carousel",
      title: "员工照片轮播展示",
      intro: "让团队成员以更有秩序的方式被看见，页面保持轻奢、克制和清爽，后续只需替换成员图即可。",
    },
    en: {
      eyebrow: "Employee Carousel",
      title: "Employee Photo Carousel",
      intro: "Browse team portraits in an ordered carousel that keeps the page refined, restrained, and clean.",
    },
    es: {
      eyebrow: "Carrusel de equipo",
      title: "Carrusel de fotos del equipo",
      intro: "Explora los retratos del equipo en un carrusel ordenado, con una presentación limpia y sobria.",
    },
    hi: {
      eyebrow: "Employee Carousel",
      title: "कर्मचारी फोटो कैरसेल",
      intro: "टीम पोर्ट्रेट को एक व्यवस्थित कैरसेल में देखें, जिससे पेज साफ और संयमित दिखता है।",
    },
  };

  const setText = (selector, value, root = document) => {
    const node = root.querySelector(selector);
    if (node && value !== undefined) node.textContent = value;
  };

  const setAttr = (selector, attr, value, root = document) => {
    const node = root.querySelector(selector);
    if (node && value !== undefined) node.setAttribute(attr, value);
  };

  const applyPageCopy = (lang) => {
    const t = copy[lang] || copy.en;
    const team = teamCopy[lang] || teamCopy.en;
    document.title = t.title;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.documentElement.dataset.lang = lang;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = t.description;

    setAttr(".brand", "aria-label", t.brandLabel);
    setAttr(".primary-nav", "aria-label", t.navLabel);
    setAttr(".hero", "aria-label", t.heroLabel);
    setAttr(".hero-points", "aria-label", t.heroPointsLabel);
    setAttr(".hero-visual img", "alt", t.heroImageAlt);
    setAttr(".story-visual img", "alt", t.storyImageAlt);

    document.querySelectorAll(".primary-nav a").forEach((link, index) => {
      if (t.nav[index]) link.textContent = t.nav[index];
    });

    document.querySelectorAll(".language-select option").forEach((option) => {
      const index = LANGS.indexOf(option.value);
      if (index >= 0 && t.lang[index]) option.textContent = t.lang[index];
    });

    setText(".quote-button", t.quote);
    setText(".hero-copy .eyebrow", t.heroEyebrow);
    setText(".hero h1", t.heroTitle);
    setText(".hero-copy > div > p:nth-of-type(2)", t.heroIntro);
    document.querySelectorAll(".hero-points span").forEach((point, index) => {
      if (t.heroPoints[index]) point.textContent = t.heroPoints[index];
    });
    setText(".hero-note strong", t.heroNoteTitle);
    setText(".hero-note span", t.heroNote);

    setText(".story-copy .eyebrow", t.storyEyebrow);
    setText("#story-title", t.storyTitle);
    setText(".story-copy > p:nth-of-type(2)", t.storyIntro);

    setText(".team .eyebrow", team.eyebrow);
    setText("#team-title", team.title);
    setText(".team .section-copy", team.intro);
    setText(".employee-strip .eyebrow", team.eyebrow);
    setText("#employee-strip-title", team.title);
    setText(".employee-strip .section-copy", team.intro);

    setText(".gallery .eyebrow", t.galleryEyebrow);
    setText("#gallery-title", t.galleryTitle);
    document.querySelectorAll(".gallery-grid img").forEach((image, index) => {
      if (t.galleryAlts[index]) image.alt = t.galleryAlts[index];
    });

    const footerItems = document.querySelectorAll(".footer span");
    if (footerItems[0]) footerItems[0].textContent = t.footerLeft;
    if (footerItems[1]) footerItems[1].textContent = t.footerRight;

    const topButton = document.querySelector(".floating-top");
    if (topButton) {
      topButton.textContent = t.top;
      topButton.setAttribute("aria-label", t.topLabel);
    }

    document.querySelectorAll("[data-menu-toggle]").forEach((button) => {
      const expanded = button.getAttribute("aria-pressed") === "true";
      button.textContent = expanded ? t.memberToggleHide : t.memberToggleShow;
    });

    document.documentElement.dataset.navReady = "true";
  };

  let activeLang = readLang();
  applyPageCopy(activeLang);
  window.addEventListener("travelday:languagechange", (event) => {
    activeLang = event.detail?.lang || readLang();
    applyPageCopy(activeLang);
  });

  const carousel = document.querySelector("[data-team-carousel]");
  if (!carousel) return;

  const members = [
    {
      image: "./assets/company-presence/team-portraits/set1-01.png",
      alt: "Lucky, Sales",
      name: "Lucky",
      role: "Sales",
      summary: "Professional in every word, trusted on every trip.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set1-02.png",
      alt: "Rita, Sales",
      name: "Rita",
      role: "Sales",
      summary: "Warm service and steady follow-through for each client.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set1-03.png",
      alt: "Zoe, Sales",
      name: "Zoe",
      role: "Sales",
      summary: "Professional execution with calm, confident delivery.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set1-04.png",
      alt: "Beauty, Sales",
      name: "Beauty",
      role: "Sales",
      summary: "15+ years in luggage sourcing and one-stop support.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set1-05.png",
      alt: "Alice, Sales",
      name: "Alice",
      role: "Sales",
      summary: "Integrity builds trust and long-term partnerships.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set1-06.png",
      alt: "MrXiang, Sales",
      name: "MrXiang",
      role: "Sales",
      summary: "Small details handled well, bigger results follow.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set2-01.png",
      alt: "Jason, Sales",
      name: "Jason",
      role: "Sales",
      summary: "Clear goals, steady action, reliable progress.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set2-02.png",
      alt: "Coco, Sales",
      name: "Coco",
      role: "Sales",
      summary: "Fast answers, careful details, lasting cooperation.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set2-03.png",
      alt: "Talya, Sales",
      name: "Talya",
      role: "Sales",
      summary: "Global view, skilled hands, sincere service.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set2-04.png",
      alt: "Stella, Sales",
      name: "Stella",
      role: "Sales",
      summary: "Resilient, focused, and strong under pressure.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set2-05.png",
      alt: "Cassie, Finance",
      name: "Cassie",
      role: "Finance",
      summary: "Careful finance support that scales with the work.",
      imagePosition: "50%",
    },
    {
      image: "./assets/company-presence/team-portraits/set2-06.png",
      alt: "Sunny, Finance",
      name: "Sunny",
      role: "Finance",
      summary: "Consistent effort, patient follow-through, precise control.",
      imagePosition: "50%",
    },
  ];

  carousel.innerHTML = `
    <div class="member-viewport">
      <div class="member-track" data-member-track>
        ${members
          .map(
            (member, index) => `
              <button
                class="member-card"
                type="button"
                data-member-card
                data-index="${index}"
                style="--image-position: ${member.imagePosition};"
                aria-label="${member.name}, ${member.role}. ${member.summary}"
              >
                <img src="${member.image}" alt="${member.alt}" />
                <span class="member-meta">
                  <span class="member-role">${member.role}</span>
                  <span class="member-name">${member.name}</span>
                  <span class="member-copy">${member.summary}</span>
                </span>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>

    <div class="member-progress" aria-hidden="true"></div>

    <div class="menu-actions">
      <button class="menu-nav" type="button" data-menu-prev aria-label="Previous member">&#8249;</button>
      <button class="button primary" type="button" data-menu-toggle aria-pressed="false"></button>
      <button class="menu-nav" type="button" data-menu-next aria-label="Next member">&#8250;</button>
    </div>
  `;

  const track = carousel.querySelector("[data-member-track]");
  const progress = carousel.querySelector(".member-progress");
  const cards = Array.from(carousel.querySelectorAll("[data-member-card]"));
  const cardImages = Array.from(carousel.querySelectorAll("[data-member-card] img"));
  const prevButton = carousel.querySelector("[data-menu-prev]");
  const nextButton = carousel.querySelector("[data-menu-next]");
  const toggleButton = carousel.querySelector("[data-menu-toggle]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!track || !cards.length || !prevButton || !nextButton || !toggleButton) return;

  let activeIndex = 0;
  let timer = 0;
  let rafId = 0;
  let isExpanded = false;

  function getWrappedDiff(index) {
    const half = members.length / 2;
    let diff = index - activeIndex;
    if (diff > half) diff -= members.length;
    if (diff < -half) diff += members.length;
    return diff;
  }

  function updateToggleLabel() {
    const member = members[activeIndex];
    const t = copy[activeLang] || copy.en;
    toggleButton.textContent = isExpanded ? t.memberToggleHide : t.memberToggleShow;
    toggleButton.setAttribute("aria-pressed", String(isExpanded));
    toggleButton.setAttribute("aria-label", `${toggleButton.textContent} ${member.name}`);
  }

  function render() {
    const viewport = carousel.querySelector(".member-viewport");
    const viewportWidth = viewport?.clientWidth || carousel.clientWidth || 1120;
    const sampleCard = cards[activeIndex] || cards[0];
    const cardWidth = sampleCard?.offsetWidth || 236;
    const sidePadding = 28;
    const maxOffset = Math.max(0, viewportWidth / 2 - cardWidth / 2 - sidePadding);
    const restingBaseX = Math.min(maxOffset, Math.max(cardWidth * 0.98, Math.min(viewportWidth * 0.22, 264)));
    const expandedBaseX = Math.min(maxOffset, Math.max(cardWidth + 34, restingBaseX + 64));
    const baseY = Math.min(14, Math.max(6, viewportWidth * 0.01));
    const goldLineGap = 12;
    const trackRect = track.getBoundingClientRect();
    const progressRect = progress?.getBoundingClientRect();
    const stageHeight = progressRect ? Math.max(0, progressRect.top - trackRect.top - goldLineGap) : track.clientHeight;

    cards.forEach((card, index) => {
      const diff = getWrappedDiff(index);
      const distance = Math.abs(diff);
      const x = Math.max(-maxOffset, Math.min(maxOffset, diff * (isExpanded ? expandedBaseX : restingBaseX)));
      const scale =
        isExpanded && distance === 0
          ? { x: 1.28, y: 1.28 }
          : distance === 0
            ? { x: 1, y: 1 }
            : distance === 1
              ? { x: 0.94, y: 0.94 }
              : { x: 0.86, y: 0.86 };
      const visualHeight = card.offsetHeight * scale.y;
      const centeredTop = Math.max(0, (stageHeight - visualHeight) / 2);
      const elevatedTop = Math.max(0, centeredTop + Math.min(20, distance * baseY));

      card.classList.toggle("is-active", index === activeIndex);
      card.classList.toggle("is-near", distance === 1);
      card.style.visibility = isExpanded && distance > 0 ? "hidden" : "visible";
      card.style.setProperty("--card-top", `${Math.round(elevatedTop)}px`);
      card.style.setProperty("--card-x", `${x}px`);
      card.style.setProperty("--card-y", "0px");
      card.style.setProperty("--card-scale-x", `${scale.x}`);
      card.style.setProperty("--card-scale-y", `${scale.y}`);
      card.style.setProperty("--card-opacity", "1");
      card.style.setProperty("--image-brightness", "1");
      card.style.setProperty("--image-saturate", "1");
      card.style.setProperty("--card-wash", "0");
      card.style.zIndex = String(isExpanded && distance === 0 ? 220 : 100 - distance * 10);
    });

    carousel.style.setProperty("--active-progress", `${((activeIndex + 1) / members.length) * 100}%`);
    carousel.classList.toggle("is-expanded", isExpanded);
    updateToggleLabel();
  }

  function scheduleRender() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      render();
    });
  }

  function goTo(nextIndex) {
    activeIndex = (nextIndex + members.length) % members.length;
    scheduleRender();
  }

  function setExpanded(nextExpanded) {
    isExpanded = nextExpanded;
    scheduleRender();
    if (timer) window.clearInterval(timer);
    timer = 0;
    if (!isExpanded) restartAutoPlay();
  }

  function restartAutoPlay() {
    if (timer) window.clearInterval(timer);
    timer = 0;
    if (prefersReducedMotion || isExpanded) return;
    timer = window.setInterval(() => goTo(activeIndex + 1), 2800);
  }

  prevButton.addEventListener("click", () => {
    goTo(activeIndex - 1);
    if (!isExpanded) restartAutoPlay();
  });

  nextButton.addEventListener("click", () => {
    goTo(activeIndex + 1);
    if (!isExpanded) restartAutoPlay();
  });

  toggleButton.addEventListener("click", () => {
    setExpanded(!isExpanded);
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.index);
      if (index === activeIndex) {
        setExpanded(!isExpanded);
        return;
      }
      goTo(index);
      setExpanded(true);
    });
  });

  carousel.addEventListener(
    "pointerdown",
    (event) => {
      if (event.target.closest("[data-member-card], [data-menu-prev], [data-menu-next], [data-menu-toggle]")) return;
      if (isExpanded) setExpanded(false);
    },
    true,
  );

  document.addEventListener("pointerdown", (event) => {
    if (!carousel.contains(event.target) && isExpanded) setExpanded(false);
  });

  carousel.addEventListener("mouseenter", () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
  });

  carousel.addEventListener("mouseleave", () => {
    if (!isExpanded) restartAutoPlay();
  });

  carousel.addEventListener("focusin", () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
  });

  carousel.addEventListener("focusout", () => {
    if (!carousel.contains(document.activeElement) && !isExpanded) restartAutoPlay();
  });

  window.addEventListener("resize", scheduleRender);
  window.addEventListener("load", scheduleRender);

  cardImages.forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", scheduleRender, { once: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (timer) window.clearInterval(timer);
      timer = 0;
      return;
    }

    restartAutoPlay();
  });

  applyPageCopy(activeLang);
  scheduleRender();
  restartAutoPlay();
})();
