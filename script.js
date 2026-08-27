// ==========================================================================
// CANTINHO VERDE — SCRIPT INTERATIVO & RESPONSIVO (SETE LAGOAS MG)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MENU MOBILE COM ANIMAÇÃO HAMBURGUER EM 'X' ---
  const burger = document.getElementById('burger');
  const navWrapper = document.getElementById('navWrapper');

  if (burger && navWrapper) {
    burger.addEventListener('click', () => {
      const isActive = navWrapper.classList.toggle('active');
      burger.classList.toggle('active', isActive);
      burger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navWrapper.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navWrapper.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 2. FILTRO DE CATEGORIAS DE PRODUTOS ---
  const catTabs = document.querySelectorAll('.cat-tab');
  const productCards = document.querySelectorAll('.product-card');

  window.filterCategory = function(cat) {
    catTabs.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-category') === cat);
    });

    productCards.forEach(card => {
      if (cat === 'todos' || card.getAttribute('data-category') === cat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      filterCategory(cat);
    });
  });

  // --- 3. CARROSSEL DE AVALIAÇÕES COM ROLAGEM HORIZONTAL E AUTO-PLAY ---
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('revPrevBtn');
  const nextBtn = document.getElementById('revNextBtn');
  const dotsContainer = document.getElementById('reviewsDots');

  if (track) {
    const cards = track.querySelectorAll('.review-card');
    
    // Create dots
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 24;
        track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateDots() {
      const cardWidth = cards[0].offsetWidth + 24;
      const activeIdx = Math.round(track.scrollLeft / cardWidth);
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === activeIdx);
      });
    }

    track.addEventListener('scroll', updateDots, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 24;
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 24;
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }

    // Auto scroll every 5s
    let autoScrollInterval = setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const cardWidth = cards[0].offsetWidth + 24;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    track.addEventListener('touchstart', () => clearInterval(autoScrollInterval), { passive: true });
  }

  // --- 4. MONTE SEU PRESENTE PERSONALIZADO (INTERACTIVE BUILDER) ---
  let selectedOcasiao = 'Aniversário';
  let selectedEstilo = 'Buquê de Rosas Nobres';
  let selectedMimos = [];

  const summaryText = document.getElementById('summaryText');
  const sendBtn = document.getElementById('builderSendBtn');

  function updateBuilderWhatsApp() {
    let summaryParts = [selectedOcasiao, selectedEstilo];
    if (selectedMimos.length > 0) {
      summaryParts.push('+ ' + selectedMimos.join(', '));
    }
    
    if (summaryText) {
      summaryText.textContent = summaryParts.join(' • ');
    }

    let mimosText = selectedMimos.length > 0 ? selectedMimos.join(', ') : 'Nenhum adicional';

    let msg = `Olá! Gostaria de fazer um pedido personalizado na Floricultura Cantinho Verde:\n\n` +
              `🎂 Ocasião: ${selectedOcasiao}\n` +
              `🌸 Estilo Principal: ${selectedEstilo}\n` +
              `🎁 Acompanhamentos: ${mimosText}\n\n` +
              `Gostaria de ver as opções e valores disponíveis para entrega em Sete Lagoas!`;

    if (sendBtn) {
      sendBtn.href = `https://api.whatsapp.com/send?phone=5531997875680&text=${encodeURIComponent(msg)}`;
    }
  }

  // Handle Step 1 (Ocasião)
  document.querySelectorAll('[data-group="ocasiao"] .builder-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-group="ocasiao"] .builder-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOcasiao = btn.getAttribute('data-value');
      updateBuilderWhatsApp();
    });
  });

  // Handle Step 2 (Estilo)
  document.querySelectorAll('[data-group="estilo"] .builder-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-group="estilo"] .builder-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedEstilo = btn.getAttribute('data-value');
      updateBuilderWhatsApp();
    });
  });

  // Handle Step 3 (Mimos Multi-selection)
  document.querySelectorAll('[data-group="mimos"] .builder-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const val = btn.getAttribute('data-value');
      if (btn.classList.contains('active')) {
        if (!selectedMimos.includes(val)) selectedMimos.push(val);
      } else {
        selectedMimos = selectedMimos.filter(m => m !== val);
      }
      updateBuilderWhatsApp();
    });
  });

  updateBuilderWhatsApp();

});
