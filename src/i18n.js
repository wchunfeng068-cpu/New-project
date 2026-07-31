/**
 * src/i18n.js — 国际化单一数据源（Single Source of Truth）
 *
 * script.js 与 shared-shell.js 都从这里 import，禁止各自 copy 语言常量与助手函数。
 * 所有语言读取/写入逻辑只在此定义一次，改一处即全局生效。
 *
 * 设计原则：
 * - 纯函数、无内部状态（state 由各页面脚本自己持有）
 * - 所有 localStorage / URL 解析都 try/catch，file:// 或隐私模式下不崩
 * - 语言解析顺序固定：URL ?lang= → localStorage → data-default-lang → DEFAULT_LANG
 */

export const LANGS = ['zh', 'en', 'es', 'hi'];
export const DEFAULT_LANG = 'en';
export const LANGUAGE_STORAGE_KEY = 'travelday-site-language';

export const NAV_LABELS = {
  zh: ['首页', '产品中心', 'OEM/ODM 定制', '关于我们', '市场', '联系我们'],
  en: ['Home', 'Products', 'OEM/ODM', 'About', 'Market', 'Contact'],
  es: ['Inicio', 'Productos', 'OEM/ODM', 'Nosotros', 'Mercado', 'Contacto'],
  hi: ['होम', 'उत्पाद', 'OEM/ODM', 'हमारे बारे में', 'बाज़ार', 'संपर्क'],
};

export const isValidLang = (value) => LANGS.includes(value);

export const getDefaultLang = (fallback = DEFAULT_LANG) => {
  const declared = document.documentElement?.dataset?.defaultLang;
  if (isValidLang(declared)) return declared;
  return isValidLang(fallback) ? fallback : DEFAULT_LANG;
};

export const readLanguage = (fallback = DEFAULT_LANG) => {
  try {
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    if (isValidLang(queryLang)) return queryLang;
  } catch {
    // 忽略畸形 URL，回退到存储 / 默认语言
  }

  try {
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isValidLang(storedLang)) return storedLang;
  } catch {
    // file:// 等上下文可能禁止读取存储
  }

  return getDefaultLang(fallback);
};

export const persistLanguage = (lang) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // 存储为尽力而为，失败不影响页面
  }
};

export const getProjectRootUrl = () => {
  const current = new URL(window.location.href);
  return new URL(current.pathname.includes('/mockups/') ? '../' : './', current);
};

export const withLanguage = (url, lang) => {
  url.searchParams.set('lang', lang);
  return url.toString();
};

/** 传入当前语言；无效则返回读取到的语言 */
export const getActiveLanguage = (currentLang) =>
  isValidLang(currentLang) ? currentLang : readLanguage();

export const addLanguageToAnchor = (anchor, lang) => {
  const rawHref = anchor?.getAttribute('href');
  if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

  try {
    const url = new URL(rawHref, document.baseURI);
    if (!['file:', 'http:', 'https:'].includes(url.protocol)) return;
    url.searchParams.set('lang', lang);
    anchor.setAttribute('href', url.toString());
  } catch {
    // 浏览器拒绝解析异常 href 时，保留原链接
  }
};

export const getCurrentPageKey = () => {
  const pathname = window.location.pathname.toLowerCase();
  if (
    pathname.endsWith('/product-center-preview.html') ||
    pathname.endsWith('/product-detail-preview.html')
  )
    return 'products';
  if (pathname.endsWith('/solution-preview.html')) return 'solutions';
  if (pathname.endsWith('/company-presence-preview.html')) return 'about';
  if (pathname.endsWith('/market-preview.html')) return 'market';
  return 'home';
};

// 首页 UI 翻译字典 —— 原 script.js 内联，已收口为单一数据源
export const TRANSLATIONS = {
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
        ['自2006年起', '行业经验'],
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
        ['1000+', '全球客户'],
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
      contactAddress: '上海市奉贤区茂园路260号4幢801室',
      contactPhone: '+86 21 37599980',
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
      footer: '© 2006-2026 TRAVELDAY. 保留所有权利。',
      footerLinks: ['隐私政策', '服务条款', '网站地图'],
      modalClose: '关闭视频',
    },
    en: {
      title: 'TRAVELDAY | Premium B2B Luggage Supply Chain',
      description:
        'TRAVELDAY, Shanghai Daicheng Industrial Co., Ltd., focuses on luggage and component supply chains, offering OEM, ODM, and supply chain solutions for global importers, wholesalers, and overseas factories.',
      nav: ['Home', 'Products', 'Solutions', 'About', 'Market', 'Contact'],
      quote: 'Get Quote →',
      heroEyebrow: 'Luggage and component supply chain partner',
      heroTitle: 'From China supply chain\nto global production',
      heroButtonPrimary: 'Get Quote →',
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
        ['1000+', 'Global customers'],
        ['5%', 'Net profit margin'],
      ],
      globalKicker: 'GLOBAL FOOTPRINT',
      globalTitle: 'Global footprint',
      globalDesc:
        'Rooted in China, serving emerging markets across Asia, Africa, the Middle East, and Europe with efficient, reliable supply chain services.',
      globalButton: 'Learn more →',
      contactTitle: 'Contact us',
      contactPhoneLabel: 'Phone:',
      contactEmailLabel: 'Email:',
      contactAddressLabel: 'Address:',
      contactAddress: 'Room 801, Building 4, No. 260 Maoyuan Road, Fengxian District, Shanghai, China',
      contactPhone: '+86 21 37599980',
      companyCn: '上海戴承实业有限公司',
      companyEn: 'Shanghai Daicheng Industrial Co., Ltd.',
      contactDesc:
        'Focused on luggage and component supply chains, delivering high-quality products and professional supply chain solutions for global customers.',
      quoteTitle: 'Turn every inquiry into one elegant entry point.',
      formName: 'Your name',
      formCompany: 'Company name',
      formEmail: 'Email address',
      formMessage: 'Message',
      formSubmit: 'Send inquiry',
      footer: '© 2006-2026 TRAVELDAY. All rights reserved.',
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
        ['Desde 2006', 'Experiencia'],
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
        ['Desde 2006', 'Años de experiencia'],
        ['50+', 'Miembros del equipo'],
        ['1000+', 'Clientes globales'],
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
      contactAddress: 'Room 801, Building 4, No. 260 Maoyuan Road, Fengxian District, Shanghai, China',
      contactPhone: '+86 21 37599980',
      companyCn: '上海戴承实业有限公司',
      companyEn: 'Shanghai Daicheng Industrial Co., Ltd.',
      contactDesc:
        'Especializados en equipaje y componentes, ofrecemos productos de alta calidad y soluciones profesionales de cadena de suministro para clientes globales.',
      quoteTitle: 'Convierte cada consulta en una entrada clara y elegante.',
      formName: 'Tu nombre',
      formCompany: 'Nombre de la empresa',
      formEmail: 'Correo electrónico',
      formMessage: 'Mensaje',
      formSubmit: 'Enviar consulta',
      footer: '© 2006-2026 TRAVELDAY. Todos los derechos reservados.',
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
        ['2006 से', 'उद्योग अनुभव'],
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
        ['2006 से', 'वर्षों का अनुभव'],
        ['50+', 'टीम सदस्य'],
        ['1000+', 'वैश्विक ग्राहक'],
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
      contactAddress: 'Room 801, Building 4, No. 260 Maoyuan Road, Fengxian District, Shanghai, China',
      contactPhone: '+86 21 37599980',
      companyCn: '上海戴承实业有限公司',
      companyEn: 'Shanghai Daicheng Industrial Co., Ltd.',
      contactDesc:
        'लगेज और कंपोनेंट सप्लाई चेन में विशेषज्ञ, वैश्विक ग्राहकों के लिए उच्च गुणवत्ता के उत्पाद और पेशेवर सप्लाई चेन समाधान।',
      quoteTitle: 'हर पूछताछ को एक ही प्रवेश बिंदु में लाएं।',
      formName: 'आपका नाम',
      formCompany: 'कंपनी का नाम',
      formEmail: 'ईमेल पता',
      formMessage: 'संदेश',
      formSubmit: 'पूछताछ भेजें',
      footer: '© 2006-2026 TRAVELDAY. सर्वाधिकार सुरक्षित।',
      footerLinks: ['गोपनीयता नीति', 'सेवा की शर्तें', 'साइटमैप'],
      modalClose: 'वीडियो बंद करें',
    },
  };
