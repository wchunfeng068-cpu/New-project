(() => {
  const STYLE_ID = 'travelday-inquiry-module-styles';
  const MODULE_CLASS = 'inquiry-standard';
  const TARGET_SELECTOR = 'section#contact';
  const DEFAULT_LANG = 'en';
  const INQUIRY_RECIPIENT = 'wchunfeng068@gmail.com';
  const SUBMIT_ENDPOINT = `https://formsubmit.co/${encodeURIComponent(INQUIRY_RECIPIENT)}`;

  const COPY = {
    zh: {
      eyebrow: 'INQUIRY / CONTACT',
      title: '让合作更快发生',
      desc: '告诉我们你的市场、产品或定制需求，我们会在同一条资源链里快速响应。',
      pill1: '24小时内回复',
      pill2: '资源协同',
      pill3: '统一报价',
      contactTitle: '直接联系',
      contactDesc: 'wchunfeng068@gmail.com · 详细需求可直接沟通。',
      email: INQUIRY_RECIPIENT,
      formTitle: '快速询盘',
      formHint: '第一步就能开始对接',
      formAria: '快速询盘',
      nameLabel: '姓名',
      namePlaceholder: '请输入您的姓名',
      companyLabel: '公司名称',
      companyPlaceholder: '请输入公司名称',
      emailLabel: '邮箱',
      emailPlaceholder: '请输入邮箱地址',
      needLabel: '采购需求',
      needPlaceholder: '例如：整箱采购、轮子配件、拉杆配套、定制需求',
      messageLabel: '补充说明',
      messagePlaceholder: '请简单说明数量、目标市场和交期要求',
      button: '提交询盘',
      note: '我们会尽快与您联系，并给出适合的资源匹配方案。',
      status: '我们已收到您的需求，会尽快联系您。',
      sending: '发送中...',
      submitError: '发送遇到问题，请直接通过邮箱联系我们。',
    },
    en: {
      eyebrow: 'INQUIRY / CONTACT',
      title: 'Turn every inquiry into one elegant entry point.',
      desc: 'Tell us your market, product or customization needs and we will respond through one integrated resource chain.',
      pill1: 'Reply within 24h',
      pill2: 'Resource coordination',
      pill3: 'Unified quote',
      contactTitle: 'Direct contact',
      contactDesc: 'wchunfeng068@gmail.com · More details can be discussed in one step.',
      email: INQUIRY_RECIPIENT,
      formTitle: 'Quick inquiry form',
      formHint: 'One step to start the conversation',
      formAria: 'Quick inquiry form',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      companyLabel: 'Company',
      companyPlaceholder: 'Company name',
      emailLabel: 'Email',
      emailPlaceholder: 'Email address',
      needLabel: 'Need',
      needPlaceholder: 'Market direction, product line or customization request',
      messageLabel: 'Notes',
      messagePlaceholder: 'Please tell us quantity, target market and timeline',
      button: 'Send inquiry',
      note: 'We will get back to you quickly with a suitable resource-matching plan.',
      status: 'We have received your request and will contact you soon.',
      sending: 'Sending...',
      submitError: 'We could not send your inquiry. Please contact us directly by email.',
    },
    es: {
      eyebrow: 'INQUIRY / CONTACT',
      title: 'Convierte cada consulta en una entrada clara y elegante.',
      desc: 'Cuéntanos tu mercado, producto o necesidad de personalización y responderemos con una cadena integrada de recursos.',
      pill1: 'Respuesta en 24h',
      pill2: 'Coordinación de recursos',
      pill3: 'Cotización unificada',
      contactTitle: 'Contacto directo',
      contactDesc: 'wchunfeng068@gmail.com · Se pueden discutir más detalles en un solo paso.',
      email: INQUIRY_RECIPIENT,
      formTitle: 'Formulario rápido',
      formHint: 'Un solo paso para iniciar la conversación',
      formAria: 'Formulario rápido',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre',
      companyLabel: 'Empresa',
      companyPlaceholder: 'Nombre de la empresa',
      emailLabel: 'Correo',
      emailPlaceholder: 'Dirección de correo',
      needLabel: 'Necesidad',
      needPlaceholder: 'Mercado, línea de producto o personalización',
      messageLabel: 'Notas',
      messagePlaceholder: 'Indica cantidad, mercado objetivo y plazo',
      button: 'Enviar consulta',
      note: 'Te responderemos pronto con una propuesta adecuada de recursos.',
      status: 'Hemos recibido tu consulta y te contactaremos pronto.',
      sending: 'Enviando...',
      submitError: 'No se pudo enviar tu consulta. Escríbenos directamente por correo.',
    },
    hi: {
      eyebrow: 'INQUIRY / CONTACT',
      title: 'हर पूछताछ को एक स्पष्ट और सुरुचिपूर्ण प्रवेश बिंदु में बदलें।',
      desc: 'हमें अपना बाज़ार, उत्पाद या कस्टमाइज़ेशन आवश्यकता बताएं, हम एकीकृत संसाधन श्रृंखला के साथ जवाब देंगे।',
      pill1: '24 घंटे में जवाब',
      pill2: 'रिसोर्स समन्वय',
      pill3: 'एकीकृत कोटेशन',
      contactTitle: 'सीधा संपर्क',
      contactDesc: 'wchunfeng068@gmail.com · अधिक विवरण एक ही चरण में चर्चा किए जा सकते हैं।',
      email: INQUIRY_RECIPIENT,
      formTitle: 'त्वरित पूछताछ फॉर्म',
      formHint: 'बातचीत शुरू करने के लिए एक ही चरण',
      formAria: 'त्वरित पूछताछ फॉर्म',
      nameLabel: 'नाम',
      namePlaceholder: 'अपना नाम लिखें',
      companyLabel: 'कंपनी',
      companyPlaceholder: 'कंपनी का नाम',
      emailLabel: 'ईमेल',
      emailPlaceholder: 'ईमेल पता',
      needLabel: 'आवश्यकता',
      needPlaceholder: 'बाज़ार, उत्पाद श्रृंखला या कस्टमाइज़ेशन अनुरोध',
      messageLabel: 'अतिरिक्त विवरण',
      messagePlaceholder: 'कृपया मात्रा, लक्ष्य बाज़ार और समय सीमा बताएं',
      button: 'पूछताछ भेजें',
      note: 'हम उपयुक्त संसाधन-मिलान योजना के साथ जल्द ही आपसे संपर्क करेंगे।',
      status: 'हमने आपकी पूछताछ प्राप्त कर ली है और जल्द ही संपर्क करेंगे।',
      sending: 'भेजा जा रहा है...',
      submitError: 'पूछताछ नहीं भेजी जा सकी। कृपया सीधे ईमेल से संपर्क करें।',
    },
  };

  const getLanguage = () => {
    const shellLang = window.traveldayShell?.getLanguage?.();
    if (COPY[shellLang]) return shellLang;

    const attrLang = document.documentElement?.dataset?.lang;
    if (COPY[attrLang]) return attrLang;

    try {
      const queryLang = new URLSearchParams(window.location.search).get('lang');
      if (COPY[queryLang]) return queryLang;
    } catch {
      // Ignore malformed URLs.
    }

    return DEFAULT_LANG;
  };

  const ensureStyles = () => {
    // If styles.css is loaded, the inquiry module CSS is already available
    const hasStylesCSS = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (link) => link.href.includes('styles.css'),
    );
    if (hasStylesCSS) return;

    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      body .inquiry-standard {
        display: grid;
        grid-template-columns: minmax(360px, 0.88fr) minmax(540px, 1.12fr);
        align-items: stretch;
        min-height: 420px;
        padding: 0;
        overflow: hidden;
        border: 1px solid rgba(225, 213, 198, 0.82);
        border-radius: 28px;
        background: linear-gradient(180deg, #f8f3eb 0%, #efe3d4 100%);
        box-shadow: 0 16px 40px rgba(59, 43, 24, 0.06);
      }

      body .inquiry-standard .inquiry-copy {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 44px 44px 44px 48px;
      }

      body .inquiry-standard .inquiry-eyebrow {
        margin: 0 0 16px;
        color: #a87300;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.22em;
      }

      body .inquiry-standard .inquiry-title {
        margin: 0;
        color: #171514;
        font-family: "SimHei", "Microsoft YaHei", sans-serif;
        font-size: clamp(32px, 3.6vw, 48px);
        font-weight: 900;
        line-height: 1.03;
        letter-spacing: -0.03em;
      }

      body .inquiry-standard .inquiry-desc {
        max-width: 500px;
        margin: 18px 0 0;
        color: #6d6257;
        font-size: 16px;
        line-height: 1.8;
      }

      body .inquiry-standard .inquiry-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 24px;
      }

      body .inquiry-standard .meta-pill {
        display: inline-flex;
        align-items: center;
        min-height: 36px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid #e2d7c8;
        background: rgba(255, 255, 255, 0.82);
        color: #665c50;
        font-size: 12px;
        font-weight: 800;
      }

      body .inquiry-standard .inquiry-contact {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-top: 28px;
        padding-top: 22px;
        border-top: 1px solid rgba(226, 215, 200, 0.95);
      }

      body .inquiry-standard .inquiry-contact strong {
        display: block;
        color: #171514;
        font-size: 15px;
        font-weight: 900;
      }

      body .inquiry-standard .inquiry-contact span {
        display: block;
        margin-top: 4px;
        color: #6d6257;
        font-size: 13px;
        line-height: 1.6;
      }

      body .inquiry-standard .inquiry-email {
        display: inline-flex;
        align-items: center;
        min-height: 42px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(224, 214, 202, 0.82);
        background: rgba(255, 255, 255, 0.88);
        color: #171514;
        font-size: 13px;
        font-weight: 900;
        box-shadow: 0 10px 18px rgba(49, 39, 27, 0.05);
      }

      body .inquiry-standard .inquiry-form-wrap {
        margin: 16px 16px 16px 0;
        padding: 26px;
        border-radius: 26px;
        border: 1px solid rgba(225, 213, 198, 0.8);
        background: linear-gradient(180deg, rgba(251, 247, 240, 0.96), rgba(243, 234, 223, 0.96));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.54);
      }

      body .inquiry-standard .inquiry-form-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }

      body .inquiry-standard .inquiry-form-head p {
        margin: 0;
        color: #171514;
        font-size: 18px;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      body .inquiry-standard .inquiry-form-head span {
        color: #6d6257;
        font-size: 13px;
        font-weight: 700;
      }

      body .inquiry-standard .inquiry-form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      body .inquiry-standard .inquiry-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      body .inquiry-standard .inquiry-field.full {
        grid-column: 1 / -1;
      }

      body .inquiry-standard .inquiry-field label {
        color: #675d52;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      body .inquiry-standard .inquiry-field input,
      body .inquiry-standard .inquiry-field textarea {
        width: 100%;
        border: 1px solid #e1d6c7;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.9);
        color: #2b2824;
        font-size: 14px;
        font-weight: 600;
        padding: 15px 16px;
        outline: none;
        box-shadow: 0 8px 18px rgba(43, 34, 24, 0.04);
      }

      body .inquiry-standard .inquiry-field input::placeholder,
      body .inquiry-standard .inquiry-field textarea::placeholder {
        color: #8a7f74;
        font-weight: 500;
      }

      body .inquiry-standard .inquiry-field input:focus,
      body .inquiry-standard .inquiry-field textarea:focus {
        border-color: rgba(211, 154, 0, 0.5);
        box-shadow: 0 0 0 4px rgba(211, 154, 0, 0.09);
      }

      body .inquiry-standard .inquiry-field textarea {
        min-height: 138px;
        resize: none;
        line-height: 1.7;
      }

      body .inquiry-standard .inquiry-form-footer {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-top: 4px;
      }

      body .inquiry-standard .inquiry-note {
        max-width: 320px;
        color: #7b7166;
        font-size: 12px;
        line-height: 1.6;
      }

      body .inquiry-standard .inquiry-form .button {
        min-width: 168px;
      }

      body .inquiry-standard .form-status {
        margin: 0;
      }

      @media (max-width: 1180px) {
        body .inquiry-standard {
          grid-template-columns: 1fr;
        }

        body .inquiry-standard .inquiry-form-wrap {
          margin: 0 16px 16px;
        }
      }

      @media (max-width: 720px) {
        body .inquiry-standard .inquiry-copy {
          padding: 34px 24px 18px;
        }

        body .inquiry-standard .inquiry-form-wrap {
          padding: 20px;
          margin: 0 12px 12px;
        }

        body .inquiry-standard .inquiry-form {
          grid-template-columns: 1fr;
        }

        body .inquiry-standard .inquiry-form-footer {
          flex-direction: column;
          align-items: stretch;
        }

        body .inquiry-standard .inquiry-form .button {
          width: 100%;
        }

        body .inquiry-standard .inquiry-note {
          max-width: none;
        }

        body .inquiry-standard .inquiry-contact {
          flex-direction: column;
          align-items: stretch;
        }

        body .inquiry-standard .inquiry-email {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const template = () => `
    <div class="inquiry-copy">
      <p class="inquiry-eyebrow" data-inquiry-copy="eyebrow">INQUIRY / CONTACT</p>
      <h2 class="inquiry-title" data-inquiry-copy="title">Turn every inquiry into one elegant entry point.</h2>
      <p class="inquiry-desc" data-inquiry-copy="desc">Tell us your market, product or customization needs and we will respond through one integrated resource chain.</p>

      <div class="inquiry-meta">
        <span class="meta-pill" data-inquiry-copy="pill1">Reply within 24h</span>
        <span class="meta-pill" data-inquiry-copy="pill2">Resource coordination</span>
        <span class="meta-pill" data-inquiry-copy="pill3">Unified quote</span>
      </div>

      <div class="inquiry-contact">
        <div>
          <strong data-inquiry-copy="contactTitle">Direct contact</strong>
          <span data-inquiry-copy="contactDesc">wchunfeng068@gmail.com · More details can be discussed in one step.</span>
        </div>
        <a class="inquiry-email" href="mailto:wchunfeng068@gmail.com" data-inquiry-copy="email">wchunfeng068@gmail.com</a>
      </div>
    </div>

    <div class="inquiry-form-wrap">
      <div class="inquiry-form-head">
        <p data-inquiry-copy="formTitle">Quick inquiry form</p>
        <span data-inquiry-copy="formHint">One step to start the conversation</span>
      </div>
      <form class="inquiry-form" aria-label="Quick inquiry form" action="${SUBMIT_ENDPOINT}" method="post">
        <input type="hidden" name="_captcha" value="false" />
        <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none" />
        <div class="inquiry-field">
          <label for="inq-name" data-inquiry-copy="nameLabel">Name</label>
          <input id="inq-name" name="name" type="text" autocomplete="name" data-inquiry-placeholder="namePlaceholder" placeholder="Your name" required />
        </div>
        <div class="inquiry-field">
          <label for="inq-company" data-inquiry-copy="companyLabel">Company</label>
          <input id="inq-company" name="company" type="text" autocomplete="organization" data-inquiry-placeholder="companyPlaceholder" placeholder="Company name" />
        </div>
        <div class="inquiry-field">
          <label for="inq-email" data-inquiry-copy="emailLabel">Email</label>
          <input id="inq-email" name="email" type="email" autocomplete="email" data-inquiry-placeholder="emailPlaceholder" placeholder="Email address" required />
        </div>
        <div class="inquiry-field">
          <label for="inq-need" data-inquiry-copy="needLabel">Need</label>
          <input id="inq-need" name="need" type="text" data-inquiry-placeholder="needPlaceholder" placeholder="Market direction, product line or customization request" />
        </div>
        <div class="inquiry-field full">
          <label for="inq-message" data-inquiry-copy="messageLabel">Notes</label>
          <textarea id="inq-message" name="message" data-inquiry-placeholder="messagePlaceholder" placeholder="Please tell us quantity, target market and timeline" required></textarea>
        </div>
        <div class="inquiry-form-footer">
          <p class="inquiry-note" data-inquiry-copy="note">We will get back to you quickly with a suitable resource-matching plan.</p>
          <button class="button button-primary form-submit" type="submit" data-inquiry-copy="button">Send inquiry</button>
        </div>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  `;

  const setText = (root, selector, value, useHTML = false) => {
    const node = root.querySelector(selector);
    if (!node || value === undefined || value === null) return;
    if (useHTML) {
      node.innerHTML = value;
    } else {
      node.textContent = value;
    }
  };

  const setPlaceholder = (root, selector, value) => {
    const node = root.querySelector(selector);
    if (node && value !== undefined && value !== null) node.setAttribute('placeholder', value);
  };

  const bindSubmit = (section, copy) => {
    const form = section.querySelector('.inquiry-form');
    const status = section.querySelector('.form-status');
    if (!form || !status || form.dataset.inquiryBound === 'true') return;

    form.dataset.inquiryBound = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('[type="submit"]');
      const returnUrl = new URL('thank-you.html', window.location.href);
      returnUrl.searchParams.set('lang', getLanguage());
      const payload = new FormData(form);
      payload.set('_captcha', 'false');

      status.textContent = copy.sending || 'Sending...';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = '...';
      }

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(INQUIRY_RECIPIENT)}`, {
          method: 'POST',
          body: payload,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Inquiry submission failed: ${response.status}`);
        if (response.ok) {
          status.textContent = copy.status;
          window.location.assign(returnUrl.toString());
        }
      } catch (error) {
        status.textContent = copy.submitError || 'Unable to send your inquiry right now. Please email us directly.';
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || '';
          delete submitButton.dataset.originalText;
        }
      }
    });
  };

  const renderSection = (section, copy) => {
    section.classList.add(MODULE_CLASS);

    if (section.dataset.inquiryStandardMounted !== 'true') {
      section.innerHTML = template();
      section.dataset.inquiryStandardMounted = 'true';
    }

    setText(section, '[data-inquiry-copy="eyebrow"]', copy.eyebrow);
    setText(section, '[data-inquiry-copy="title"]', copy.title);
    setText(section, '[data-inquiry-copy="desc"]', copy.desc);
    setText(section, '[data-inquiry-copy="pill1"]', copy.pill1);
    setText(section, '[data-inquiry-copy="pill2"]', copy.pill2);
    setText(section, '[data-inquiry-copy="pill3"]', copy.pill3);
    setText(section, '[data-inquiry-copy="contactTitle"]', copy.contactTitle);
    setText(section, '[data-inquiry-copy="contactDesc"]', copy.contactDesc);
    setText(section, '[data-inquiry-copy="email"]', copy.email);
    setText(section, '[data-inquiry-copy="formTitle"]', copy.formTitle);
    setText(section, '[data-inquiry-copy="formHint"]', copy.formHint);
    setText(section, '[data-inquiry-copy="nameLabel"]', copy.nameLabel);
    setText(section, '[data-inquiry-copy="companyLabel"]', copy.companyLabel);
    setText(section, '[data-inquiry-copy="emailLabel"]', copy.emailLabel);
    setText(section, '[data-inquiry-copy="needLabel"]', copy.needLabel);
    setText(section, '[data-inquiry-copy="messageLabel"]', copy.messageLabel);
    setText(section, '[data-inquiry-copy="note"]', copy.note);
    setText(section, '[data-inquiry-copy="button"]', copy.button);
    setPlaceholder(section, '[data-inquiry-placeholder="namePlaceholder"]', copy.namePlaceholder);
    setPlaceholder(section, '[data-inquiry-placeholder="companyPlaceholder"]', copy.companyPlaceholder);
    setPlaceholder(section, '[data-inquiry-placeholder="emailPlaceholder"]', copy.emailPlaceholder);
    setPlaceholder(section, '[data-inquiry-placeholder="needPlaceholder"]', copy.needPlaceholder);
    setPlaceholder(section, '[data-inquiry-placeholder="messagePlaceholder"]', copy.messagePlaceholder);

    const form = section.querySelector('.inquiry-form');
    if (form) form.setAttribute('aria-label', copy.formAria || copy.formTitle);
    const email = section.querySelector('.inquiry-email');
    if (email) email.setAttribute('href', `mailto:${copy.email}`);

    bindSubmit(section, copy);
  };

  const sync = (lang = getLanguage()) => {
    ensureStyles();
    const copy = COPY[lang] || COPY[DEFAULT_LANG];
    const sections = Array.from(document.querySelectorAll(TARGET_SELECTOR));
    sections.forEach((section) => renderSection(section, copy));
  };

  window.traveldayInquiry = {
    version: '2026-05-31',
    getLanguage,
    getCopy: (lang) => COPY[lang] || COPY[DEFAULT_LANG],
    sync,
    render: sync,
  };

  window.addEventListener('travelday:languagechange', (event) => {
    sync(COPY[event.detail?.lang] ? event.detail.lang : getLanguage());
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sync(getLanguage()), { once: true });
  } else {
    sync(getLanguage());
  }
})();
