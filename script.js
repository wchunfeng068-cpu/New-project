(() => {
  const LANGS = ['zh', 'en', 'es', 'hi'];
  const DEFAULT_LANG = 'en';
  const LANGUAGE_STORAGE_KEY = 'travelday-site-language';
  const NAV_STYLE_ID = 'travelday-nav-standard-styles';
  const INQUIRY_STYLE_ID = 'travelday-inquiry-standard-styles';
  const NAV_LABELS = {
    zh: ['首页', '产品中心', '解决方案', '关于我们', '市场', '联系我们'],
    en: ['Home', 'Products', 'Solutions', 'About', 'Market', 'Contact'],
    es: ['Inicio', 'Productos', 'Soluciones', 'Nosotros', 'Mercado', 'Contacto'],
    hi: ['होम', 'उत्पाद', 'समाधान', 'हमारे बारे में', 'बाज़ार', 'संपर्क'],
  };

  const translations = {
    zh: {
      title: 'TRAVELDAY | 高端外贸箱包 B2B 供应链官网',
      description:
        'TRAVELDAY 上海戴承实业有限公司，专注行李箱及零部件供应链，为全球进口商、批发商和海外工厂提供 OEM、ODM 与供应链解决方案。',
      nav: ['首页', '产品中心', '解决方案', '关于我们', '市场', '联系我们'],
      quote: '获取报价 →',
      heroEyebrow: '行李箱及零部件供应链合作伙伴',
      heroTitle: '从中国供应链\n到全球制造。',
      heroButtonPrimary: '获取报价 →',
      heroButtonSecondary: '查看产品',
      heroStats: [
        ['自2016年起', '行业经验'],
        ['400+ 集装箱', '年出口量'],
        ['OEM & ODM', '一站式解决方案'],
        ['全球市场', '值得信赖的合作伙伴'],
      ],
      products: ['行李箱', '拉杆', '手把', '轮子', '开发设计'],
      videoKicker: 'SHOWCASE VIDEO',
      videoTitle: '产品实拍展示',
      videoDesc: '深入了解行李箱的结构、工艺、轮子与细节',
      videoButton: '观看视频 ▶',
      hoverEntry: '点击进入',
      served: [
        ['进口商', '我们有稳定的产品供应，保障您的全球需求。'],
        ['批发商', '具有竞争力的价格与灵活的订单方案。'],
        ['海外工厂', '半成品与零部件供应，支持全球工厂生产。'],
      ],
      seriesTitle: '行李箱系列',
      seriesDesc: '覆盖登机箱、托运行李箱、零售批发和贴牌项目。',
      dual: [
        ['行李箱的拉杆', '电脑包、通勤包和旅行背包，兼顾功能分区与商务外观。'],
        ['行李箱轮子', '公文包、托特包和高端商务携行解决方案。'],
      ],
      why: [
        ['稳定的供应链', '长期合作的优质供应商，保障稳定交付。'],
        ['严格的品质控制', '从原料到成品，层层把控品质。'],
        ['灵活的定制服务', 'OEM & ODM 支持，满足不同市场需求。'],
        ['有竞争力的价格', '高效供应链管理，提供更具竞争力的价格。'],
        ['准时交付保障', '成熟的生产与物流体系，确保准时交付。'],
        ['专业团队支持', '专业的销售与售后团队，为您保驾护航。'],
      ],
      productionTitle: '立足中国供应链,\n服务全球交付。',
      productionEyebrow: '行李箱及零部件供应链合作伙伴',
      productionProofOneTitle: '全球视野',
      productionProofOneDesc: '专业团队，理解国际标准',
      productionProofTwoTitle: '品质承诺',
      productionProofTwoDesc: '严苛检测，稳定可靠交付',
      statsTitle: '您值得信赖的供应链合作伙伴',
      stats: [
        ['20+', '年行业经验'],
        ['50+', '团队成员'],
        ['100+', '全球客户'],
        ['5%', '净利润率'],
      ],
      globalKicker: 'GLOBAL FOOTPRINT',
      globalTitle: '全球布局',
      globalDesc:
        '深耕新兴制造地区，稳固全球市场，为全球客户提供高效、可靠的供应链服务。',
      globalButton: '了解更多 →',
      contactTitle: '联系我们',
      contactPhoneLabel: '电话：',
      contactEmailLabel: '邮箱：',
      contactAddressLabel: '地址：',
      contactAddress: '中国广东省佛山市南海区里水镇里水大道 88 号',
      companyCn: '上海戴承实业有限公司',
      companyEn: 'Shanghai Daicheng Industrial Co., Ltd.',
      contactDesc:
        '专注于行李箱及零部件供应链，致力于为全球客户提供高品质的产品与专业的供应链解决方案。',
      quoteTitle: '让合作更快发生',
      formName: '您的姓名',
      formCompany: '公司名称',
      formEmail: '邮箱地址',
      formMessage: '留言内容',
      formSubmit: '提交询盘',
      footer: '© 2016-2024 TRAVELDAY. 保留所有权利。',
      footerLinks: ['隐私政策', '服务条款', '网站地图'],
      modalClose: '关闭视频',
    },
    en: {
      title: 'TRAVELDAY | Premium B2B Luggage Supply Chain',
      description:
        'TRAVELDAY, Shanghai Daicheng Industrial Co., Ltd., focuses on luggage and component supply chains, offering OEM, ODM, and supply chain solutions for global importers, wholesalers, and overseas factories.',
      nav: ['Home', 'Products', 'Solutions', 'About', 'Market', 'Contact'],
      quote: 'Get Quote ->',
      heroEyebrow: 'Luggage and component supply chain partner',
      heroTitle: 'From China supply chain\nto global production',
      heroButtonPrimary: 'Get Quote ->',
      heroButtonSecondary: 'View Products',
      heroStats: [
        ['Since 2006', 'Industry experience'],
        ['1000+ containers', 'Annual export volume'],
        ['OEM & ODM', 'One-stop solutions'],
        ['Global market', 'Trusted partner'],
      ],
      products: ['Luggage', 'Trolley handle', 'Handle', 'Wheels', 'Design'],
      videoKicker: 'SHOWCASE VIDEO',
      videoTitle: 'Product showcase',
      videoDesc: 'Explore the structure, craftsmanship, wheels, and details of our luggage.',
      videoButton: 'Watch video ▶',
      hoverEntry: 'View details',
      served: [
        ['Importers', 'We provide stable product supply for your global demand.'],
        ['Wholesalers', 'Competitive pricing with flexible order options.'],
        ['Overseas factories', 'Semi-finished and component supply for factory production.'],
      ],
      seriesTitle: 'Luggage Series',
      seriesDesc: 'Covering carry-ons, checked luggage, wholesale, and private-label projects.',
      dual: [
        ['Luggage Handles', 'For business bags and travel bags with functional and professional appeal.'],
        ['Luggage Wheels', 'Solutions for briefcases, totes, and premium business carrying needs.'],
      ],
      why: [
        ['Stable supply chain', 'Trusted suppliers for long-term, stable delivery.'],
        ['Strict quality control', 'Quality is checked step by step from raw material to finished goods.'],
        ['Flexible customization', 'OEM & ODM support for different market needs.'],
        ['Competitive pricing', 'Efficient supply chain management for stronger pricing.'],
        ['On-time delivery', 'Mature production and logistics for reliable delivery.'],
        ['Professional support', 'Dedicated sales and after-sales teams at your service.'],
      ],
      productionTitle: 'Built on China supply chain,\nServicing global delivery.',
      productionEyebrow: 'Luggage and component supply chain partner',
      productionProofOneTitle: 'Global perspective',
      productionProofOneDesc: 'Professional team with international standards in mind',
      productionProofTwoTitle: 'Quality commitment',
      productionProofTwoDesc: 'Strict testing for stable, reliable delivery',
      statsTitle: 'A supply chain partner you can trust',
      stats: [
        ['Since 2006', 'Years in business'],
        ['50+', 'Team members'],
        ['100+', 'Global customers'],
        ['5%', 'Net profit margin'],
      ],
      globalKicker: 'GLOBAL FOOTPRINT',
      globalTitle: 'Global footprint',
      globalDesc:
        'Rooted in China, serving emerging markets across Asia, Africa, the Middle East, and Europe with efficient, reliable supply chain services.',
      globalButton: 'Learn more ->',
      contactTitle: 'Contact us',
      contactPhoneLabel: 'Phone:',
      contactEmailLabel: 'Email:',
      contactAddressLabel: 'Address:',
      contactAddress: 'No. 88 Lishui Avenue, Lishui Town, Nanhai District, Foshan, Guangdong, China',
      companyCn: 'Shanghai Daicheng Industrial Co., Ltd.',
      companyEn: 'Shanghai Daicheng Industrial Co., Ltd.',
      contactDesc:
        'Focused on luggage and component supply chains, delivering high-quality products and professional supply chain solutions for global customers.',
      quoteTitle: 'Turn every inquiry into one elegant entry point.',
      formName: 'Your name',
      formCompany: 'Company name',
      formEmail: 'Email address',
      formMessage: 'Message',
      formSubmit: 'Send inquiry',
      footer: '© 2016-2024 TRAVELDAY. All rights reserved.',
      footerLinks: ['Privacy Policy', 'Terms of Service', 'Sitemap'],
      modalClose: 'Close video',
    },
    es: {
      title: 'TRAVELDAY | Cadena de suministro B2B de equipaje premium',
      description:
        'TRAVELDAY, Shanghai Daicheng Industrial Co., Ltd., se centra en equipaje y componentes, ofreciendo soluciones OEM, ODM y de cadena de suministro para importadores, mayoristas y fábricas en el extranjero.',
      nav: ['Inicio', 'Productos', 'Soluciones', 'Nosotros', 'Mercado', 'Contacto'],
      quote: 'Solicitar cotización →',
      heroEyebrow: 'Tu socio en equipaje y componentes',
      heroTitle: 'De la cadena de suministro de China\na la producción global',
      heroButtonPrimary: 'Solicitar cotización →',
      heroButtonSecondary: 'Ver productos',
      heroStats: [
        ['Desde 2016', 'Experiencia'],
        ['400+ contenedores', 'Volumen anual'],
        ['OEM & ODM', 'Solución integral'],
        ['Mercado global', 'Socio de confianza'],
      ],
      products: ['Equipaje', 'Tirador', 'Asa', 'Ruedas', 'Diseño'],
      videoKicker: 'SHOWCASE VIDEO',
      videoTitle: 'Demostración de producto',
      videoDesc: 'Conoce la estructura, la artesanía, las ruedas y los detalles del equipaje.',
      videoButton: 'Ver video ▶',
      hoverEntry: 'Ver detalles',
      served: [
        ['Importadores', 'Suministro estable de productos para tu demanda global.'],
        ['Mayoristas', 'Precios competitivos con pedidos flexibles.'],
        ['Fábricas en el extranjero', 'Suministro de semielaborados y componentes para producción.'],
      ],
      seriesTitle: 'Serie de equipaje',
      seriesDesc: 'Maletas de cabina, equipaje facturado, mayoristas y marcas propias.',
      dual: [
        ['Asas para equipaje', 'Para bolsas de trabajo y viaje con enfoque funcional y profesional.'],
        ['Ruedas para equipaje', 'Soluciones para maletines, totes y transporte ejecutivo.'],
      ],
      why: [
        ['Cadena estable', 'Proveedores de confianza para entregas consistentes.'],
        ['Control de calidad', 'Revisiones rigurosas desde la materia prima hasta el producto final.'],
        ['Personalización flexible', 'Soporte OEM & ODM para distintos mercados.'],
        ['Precio competitivo', 'Gestión eficiente para mejorar la competitividad.'],
        ['Entrega puntual', 'Producción y logística maduras para entregas fiables.'],
        ['Equipo profesional', 'Equipo de ventas y posventa a tu disposición.'],
      ],
      productionTitle: 'Con la cadena de suministro de China,\nImpulsamos entregas globales.',
      productionEyebrow: 'Socio de equipaje y componentes',
      productionProofOneTitle: 'Visión global',
      productionProofOneDesc: 'Equipo profesional, alineado con estándares internacionales',
      productionProofTwoTitle: 'Compromiso de calidad',
      productionProofTwoDesc: 'Pruebas estrictas para una entrega estable y fiable',
      statsTitle: 'Un socio de suministro en quien puedes confiar',
      stats: [
        ['Desde 2016', 'Años de experiencia'],
        ['50+', 'Miembros del equipo'],
        ['100+', 'Clientes globales'],
        ['5%', 'Margen neto'],
      ],
      globalKicker: 'GLOBAL FOOTPRINT',
      globalTitle: 'Presencia global',
      globalDesc:
        'Con base en China, servimos a mercados emergentes de Asia, África, Oriente Medio y Europa con servicios de suministro eficientes y fiables.',
      globalButton: 'Saber más →',
      contactTitle: 'Contáctanos',
      contactPhoneLabel: 'Teléfono:',
      contactEmailLabel: 'Correo:',
      contactAddressLabel: 'Dirección:',
      contactAddress: 'No. 88 Lishui Avenue, Lishui Town, Nanhai District, Foshan, Guangdong, China',
      companyCn: 'Shanghai Daicheng Industrial Co., Ltd.',
      companyEn: 'Shanghai Daicheng Industrial Co., Ltd.',
      contactDesc:
        'Especializados en equipaje y componentes, ofrecemos productos de alta calidad y soluciones profesionales de cadena de suministro para clientes globales.',
      quoteTitle: 'Convierte cada consulta en una entrada clara y elegante.',
      formName: 'Tu nombre',
      formCompany: 'Nombre de la empresa',
      formEmail: 'Correo electrónico',
      formMessage: 'Mensaje',
      formSubmit: 'Enviar consulta',
      footer: '© 2016-2024 TRAVELDAY. Todos los derechos reservados.',
      footerLinks: ['Privacidad', 'Términos de servicio', 'Mapa del sitio'],
      modalClose: 'Cerrar video',
    },
    hi: {
      title: 'TRAVELDAY | प्रीमियम B2B लगेज सप्लाई चेन',
      description:
        'TRAVELDAY, Shanghai Daicheng Industrial Co., Ltd., लगेज और कंपोनेंट सप्लाई चेन पर केंद्रित है, और वैश्विक आयातकों, थोक विक्रेताओं तथा विदेशी कारखानों के लिए OEM, ODM और सप्लाई चेन समाधान प्रदान करता है।',
      nav: ['होम', 'उत्पाद', 'समाधान', 'हमारे बारे में', 'बाज़ार', 'संपर्क'],
      quote: 'कोटेशन लें →',
      heroEyebrow: 'लगेज और कंपोनेंट सप्लाई चेन पार्टनर',
      heroTitle: 'चीन की सप्लाई चेन से\nवैश्विक उत्पादन तक',
      heroButtonPrimary: 'कोटेशन लें →',
      heroButtonSecondary: 'उत्पाद देखें',
      heroStats: [
        ['2016 से', 'उद्योग अनुभव'],
        ['400+ कंटेनर', 'वार्षिक निर्यात मात्रा'],
        ['OEM & ODM', 'वन-स्टॉप समाधान'],
        ['वैश्विक बाज़ार', 'विश्वसनीय साझेदार'],
      ],
      products: ['लगेज', 'हैंडल', 'ग्रिप', 'पहिए', 'डिज़ाइन'],
      videoKicker: 'SHOWCASE VIDEO',
      videoTitle: 'उत्पाद प्रदर्शन',
      videoDesc: 'लगेज की संरचना, शिल्प, पहियों और बारीकियों को विस्तार से देखें।',
      videoButton: 'वीडियो देखें ▶',
      hoverEntry: 'विवरण देखें',
      served: [
        ['आयातक', 'आपकी वैश्विक मांग के लिए स्थिर उत्पाद आपूर्ति।'],
        ['थोक विक्रेता', 'प्रतिस्पर्धी मूल्य और लचीले ऑर्डर विकल्प।'],
        ['विदेशी कारखाने', 'उत्पादन के लिए सेमी-फिनिश्ड और कंपोनेंट सप्लाई।'],
      ],
      seriesTitle: 'लगेज श्रृंखला',
      seriesDesc: 'कैरी-ऑन, चेक-इन लगेज, थोक और प्राइवेट-लेबल प्रोजेक्ट्स।',
      dual: [
        ['लगेज हैंडल', 'फंक्शनल और प्रोफेशनल अपील वाले बिज़नेस बैग और ट्रैवल बैग के लिए।'],
        ['लगेज पहिए', 'ब्रिफकेस, टोट और प्रीमियम बिज़नेस कैरी समाधान।'],
      ],
      why: [
        ['स्थिर सप्लाई चेन', 'लंबी अवधि के भरोसेमंद सप्लायर, स्थिर डिलीवरी के लिए।'],
        ['सख्त गुणवत्ता नियंत्रण', 'कच्चे माल से तैयार उत्पाद तक कड़ी निगरानी।'],
        ['लचीला कस्टमाइज़ेशन', 'विभिन्न बाज़ार आवश्यकताओं के लिए OEM & ODM।'],
        ['प्रतिस्पर्धी मूल्य', 'बेहतर मूल्य के लिए कुशल सप्लाई चेन प्रबंधन।'],
        ['समय पर डिलीवरी', 'विश्वसनीय डिलीवरी के लिए परिपक्व उत्पादन और लॉजिस्टिक्स।'],
        ['पेशेवर सहायता', 'समर्पित सेल्स और आफ्टर-सेल्स टीम।'],
      ],
      productionTitle: 'चीन की सप्लाई चेन पर आधारित,\nवैश्विक डिलीवरी की सेवा।',
      productionEyebrow: 'लगेज और कंपोनेंट सप्लाई चेन पार्टनर',
      productionProofOneTitle: 'वैश्विक दृष्टिकोण',
      productionProofOneDesc: 'पेशेवर टीम, अंतरराष्ट्रीय मानकों की समझ',
      productionProofTwoTitle: 'गुणवत्ता प्रतिबद्धता',
      productionProofTwoDesc: 'स्थिर और विश्वसनीय डिलीवरी के लिए कठोर परीक्षण',
      statsTitle: 'एक सप्लाई चेन पार्टनर जिस पर आप भरोसा कर सकते हैं',
      stats: [
        ['2016 से', 'वर्षों का अनुभव'],
        ['50+', 'टीम सदस्य'],
        ['100+', 'वैश्विक ग्राहक'],
        ['5%', 'शुद्ध लाभ मार्जिन'],
      ],
      globalKicker: 'GLOBAL FOOTPRINT',
      globalTitle: 'वैश्विक उपस्थिति',
      globalDesc:
        'चीन में आधारित होकर, हम एशिया, अफ्रीका, मध्य पूर्व और यूरोप के उभरते बाज़ारों को कुशल, भरोसेमंद सप्लाई सेवाएँ प्रदान करते हैं।',
      globalButton: 'और जानें →',
      contactTitle: 'संपर्क करें',
      contactPhoneLabel: 'फ़ोन:',
      contactEmailLabel: 'ईमेल:',
      contactAddressLabel: 'पता:',
      contactAddress: 'No. 88 Lishui Avenue, Lishui Town, Nanhai District, Foshan, Guangdong, China',
      companyCn: 'Shanghai Daicheng Industrial Co., Ltd.',
      companyEn: 'Shanghai Daicheng Industrial Co., Ltd.',
      contactDesc:
        'लगेज और कंपोनेंट सप्लाई चेन में विशेषज्ञ, वैश्विक ग्राहकों के लिए उच्च गुणवत्ता के उत्पाद और पेशेवर सप्लाई चेन समाधान।',
      quoteTitle: 'हर पूछताछ को एक ही प्रवेश बिंदु में लाएं।',
      formName: 'आपका नाम',
      formCompany: 'कंपनी का नाम',
      formEmail: 'ईमेल पता',
      formMessage: 'संदेश',
      formSubmit: 'पूछताछ भेजें',
      footer: '© 2016-2024 TRAVELDAY. सर्वाधिकार सुरक्षित।',
      footerLinks: ['गोपनीयता नीति', 'सेवा की शर्तें', 'साइटमैप'],
      modalClose: 'वीडियो बंद करें',
    },
  };

  const state = {
    lang: DEFAULT_LANG,
    videoReady: false,
  };

  const PRODUCT_LABELS = {
    zh: ['行李箱', '配件', '公司风采'],
    en: ['Luggage', 'ACCESORIES', 'Company Presence'],
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

  const FIXED_DESKTOP_BREAKPOINT = 1280;
  const DESKTOP_CANVAS_WIDTH = 1500;
  const DESKTOP_CANVAS_MARGIN = 46;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const readInitialLanguage = () => {
    try {
      const queryLang = new URLSearchParams(window.location.search).get('lang');
      if (LANGS.includes(queryLang)) return queryLang;
    } catch {
      // Ignore malformed URLs and fall back to stored/default language.
    }

    try {
      const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (LANGS.includes(storedLang)) return storedLang;
    } catch {
      // Some file:// contexts can block storage access.
    }

    return DEFAULT_LANG;
  };

  const persistLanguage = (lang) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Storage is best-effort only.
    }
  };

  const updateLanguageInUrl = (lang) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({ lang }, '', url);
    } catch {
      // Some file:// contexts or locked-down browsers can block history updates.
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

  const getCurrentPageKey = () => {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.endsWith('/product-center-preview.html')) return 'products';
    if (pathname.endsWith('/solution-preview.html')) return 'solutions';
    if (pathname.endsWith('/company-presence-preview.html')) return 'about';
    if (pathname.endsWith('/market-preview.html')) return 'market';
    return 'home';
  };

  const ensureNavStandardStyles = () => {
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
    `;
    document.head.appendChild(style);
  };

  const syncPrimaryNavigation = (lang) => {
    const navLinks = $$('.primary-nav a');
    if (!navLinks.length) return;

    ensureNavStandardStyles();
    ensureInquiryStandardStyles();

    const root = getProjectRootUrl();
    const hasLocalContact = Boolean(document.getElementById('contact'));
    const homeUrl = new URL('index.html', root);
    const labels = NAV_LABELS[lang] || NAV_LABELS[DEFAULT_LANG];
    const targets = [
      { key: 'home', href: withLanguage(new URL('index.html', root), lang) },
      { key: 'products', href: withLanguage(new URL('mockups/product-center-preview.html', root), lang) },
      { key: 'solutions', href: withLanguage(new URL('mockups/solution-preview.html', root), lang) },
      { key: 'about', href: withLanguage(new URL('mockups/company-presence-preview.html', root), lang) },
      { key: 'market', href: withLanguage(new URL('mockups/market-preview.html', root), lang) },
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
    $$('a[href]').forEach((anchor) => {
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

  const applyFixedDesktopStage = () => {
    const stage = $('.page-stage');
    const shell = $('.page-shell');
    if (!stage || !shell) return;

    const shouldUseDesktopScale = window.innerWidth <= FIXED_DESKTOP_BREAKPOINT;
    document.body.classList.toggle('fixed-desktop-stage', shouldUseDesktopScale);

    if (!shouldUseDesktopScale) {
      document.documentElement.style.setProperty('--desktop-scale', '1');
      document.documentElement.style.setProperty('--scaled-shell-height', 'auto');
      stage.style.minHeight = '';
      stage.style.height = '';
      return;
    }

    const availableWidth = Math.max(320, window.innerWidth - 20);
    const scale = Math.min(1, availableWidth / DESKTOP_CANVAS_WIDTH);
    const scaledHeight = Math.ceil((shell.offsetHeight + DESKTOP_CANVAS_MARGIN) * scale);

    document.documentElement.style.setProperty('--desktop-scale', scale.toFixed(5));
    document.documentElement.style.setProperty('--scaled-shell-height', `${scaledHeight}px`);
    stage.style.minHeight = `${scaledHeight}px`;
    stage.style.height = `${scaledHeight}px`;
  };

  const getViewportBucket = () => {
    if (document.body.classList.contains('fixed-desktop-stage')) return 'desktop';
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

  const clearTypeTuning = (node) => {
    if (!node) return;
    node.style.fontSize = '';
    node.style.lineHeight = '';
    node.style.maxWidth = '';
    node.style.minHeight = '';
    node.style.paddingTop = '';
    node.style.letterSpacing = '';
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

    if (!heroTitle) clearTypeTuning(heroTitle);
    if (!productionTitle) clearTypeTuning(productionTitle);
  };

  const applyI18n = (lang) => {
    const t = translations[lang] || translations[DEFAULT_LANG];

    setDocText({ ...t, lang, langTag: lang === 'zh' ? 'zh-CN' : lang });
    document.documentElement.dataset.lang = lang;
    document.documentElement.style.setProperty('--hover-entry-label', `"${t.hoverEntry}"`);
    syncLanguageLinks(lang);
    syncPrimaryNavigation(lang);

    // Header
    $$('#primaryNav a').forEach((link, index) => {
      if (t.nav[index]) link.textContent = t.nav[index];
    });
    syncPrimaryNavigation(lang);
    setText('.quote-button', t.quote);
    const langSelect = $('.language-select');
    if (langSelect && langSelect.value !== lang) langSelect.value = lang;
    document.documentElement.dataset.navReady = 'true';

    // Hero
    setText('[data-i18n="heroEyebrow"]', t.heroEyebrow);
    setHTML('[data-i18n="heroTitle"]', t.heroTitle.replace(/\n/g, '<br />'));
    setText('[data-i18n="heroButtonPrimary"]', t.heroButtonPrimary);
    setText('[data-i18n="heroButtonSecondary"]', t.heroButtonSecondary);
    applyFixedDesktopStage();
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
    setText('#contact .contact-info h2', t.contactTitle);
    const contactItems = $$('#contact .contact-info ul li');
    if (contactItems[0]) {
      contactItems[0].innerHTML = `<span>${t.contactPhoneLabel}</span><strong>+86 133 1234 5678</strong>`;
    }
    if (contactItems[1]) {
      contactItems[1].innerHTML = `<span>${t.contactEmailLabel}</span><a href="mailto:info@traveldaysuitcase.com">info@traveldaysuitcase.com</a>`;
    }
    if (contactItems[2]) {
      contactItems[2].innerHTML = `<span>${t.contactAddressLabel}</span>${t.contactAddress}`;
    }
    setHTML('#contact .company-name', `${t.companyCn}<br />${t.companyEn}`);
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

    requestAnimationFrame(() => applyFixedDesktopStage());
  };

  const openVideo = async () => {
    const modal = $('[data-video-modal]');
    const player = $('[data-video-player]');
    if (!modal || !player) return;
    if (!state.videoReady) {
      const src = player.getAttribute('data-src');
      if (src) {
        player.src = src;
        state.videoReady = true;
      }
    }
    player.preload = 'none';
    player.muted = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    try {
      player.currentTime = 0;
      await player.play();
    } catch {
      // If autoplay policies block it, the user still gets the ready player.
    }
  };

  const closeVideo = () => {
    const modal = $('[data-video-modal]');
    const player = $('[data-video-player]');
    if (!modal || !player) return;
    player.pause();
    player.currentTime = 0;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
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
    }
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeVideo();
    });
  };

  const bindMobileMenu = () => {
    const mobileMenuButton = $('.mobile-menu-button');
    const nav = $('#primaryNav');
    if (!mobileMenuButton || !nav) return;

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
    $$('#primaryNav a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth > 980) closeMobileMenu();
      },
      { passive: true },
    );
  };

  const bindContactForm = () => {
    const form = $('.inquiry-form');
    const status = $('.form-status');
    if (!form || !status) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = state.lang === 'zh' ? '我们已收到您的需求，会尽快联系您。' : 'We have received your request and will contact you soon.';
      form.reset();
    });
  };

  const bindTopButton = () => {
    const topButton = $('.floating-top');
    if (!topButton) return;
    const toggle = () => {
      topButton.classList.toggle('is-visible', window.scrollY > 500);
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  };

  const setSiteLanguage = (lang) => {
    const next = LANGS.includes(lang) ? lang : DEFAULT_LANG;
    state.lang = next;
    persistLanguage(next);
    updateLanguageInUrl(next);
    applyI18n(next);
    ensureInquiryStandardStyles();
    schedulePrimaryNavigationSync(next);
    window.dispatchEvent(new CustomEvent('travelday:languagechange', { detail: { lang: next } }));
  };

  const init = () => {
    bindMobileMenu();
    bindVideo();
    bindContactForm();
    bindTopButton();
    window.setSiteLanguage = setSiteLanguage;

    const select = $('.language-select');
    if (select) {
      select.addEventListener('change', (event) => setSiteLanguage(event.target.value));
      select.addEventListener('input', (event) => setSiteLanguage(event.target.value));
    }

    applyFixedDesktopStage();
    setSiteLanguage(readInitialLanguage());
    window.addEventListener(
      'resize',
      () => {
        applyFixedDesktopStage();
        applyResponsiveTypeTuning(state.lang);
        requestAnimationFrame(() => applyFixedDesktopStage());
      },
      { passive: true },
    );
    window.addEventListener('load', () => applyFixedDesktopStage(), { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
