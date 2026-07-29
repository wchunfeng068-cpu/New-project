(() => {
  const COPY = {
    zh: { title: '询盘已收到', description: '感谢您的咨询，我们将在 24 小时内与您联系。', home: '返回首页 →', products: '查看产品' },
    en: { title: 'Inquiry received', description: 'Thank you for your inquiry. We will contact you within 24 hours.', home: 'Back to home →', products: 'View products' },
    es: { title: 'Consulta recibida', description: 'Gracias por tu consulta. Te contactaremos en un plazo de 24 horas.', home: 'Volver al inicio →', products: 'Ver productos' },
    hi: { title: 'पूछताछ प्राप्त हुई', description: 'आपकी पूछताछ के लिए धन्यवाद। हम 24 घंटों के भीतर आपसे संपर्क करेंगे।', home: 'होम पर लौटें →', products: 'उत्पाद देखें' },
  };
  const sync = (lang) => {
    const copy = COPY[lang] || COPY.en;
    document.querySelectorAll('[data-thank-you]').forEach((node) => { node.textContent = copy[node.dataset.thankYou]; });
    document.title = `${copy.title} | TRAVELDAY`;
  };
  window.addEventListener('travelday:languagechange', (event) => sync(event.detail?.lang));
  sync(window.traveldayShell?.getLanguage?.() || 'en');
})();
