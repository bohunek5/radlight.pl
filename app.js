// RADLIGHT.PL - INTERACTIVE ROTATING WHEEL, MULTI-LANGUAGE (PL/DE/EN) & DAY/NIGHT THEME

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // MULTI-LANGUAGE SYSTEM (PL / DE / EN)
  // ==========================================================================

  let currentLang = 'pl';
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update active class on buttons
    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    console.log(`Switched language to: ${lang.toUpperCase()}`);
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
    });
  });

  // ==========================================================================
  // DAY / NIGHT MODE THEME TOGGLE ENGINE (☀️ / 🌙)
  // ==========================================================================

  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Check stored theme preference
  const savedTheme = localStorage.getItem('radlight_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('radlight_theme', isDark ? 'dark' : 'light');
      console.log(`Theme toggled to: ${isDark ? 'DARK 🌙' : 'LIGHT ☀️'}`);
    });
  }

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking links on mobile
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // ==========================================================================
  // HERO LAYOUT SWITCHER & 4-IN-1 ENGINE (SPLIT / COMMAND / CINEMATIC / BENTO)
  // ==========================================================================

  const heroSection = document.getElementById('kolo-uslug');
  const activeLayout = heroSection ? (heroSection.getAttribute('data-layout') || 'split') : 'split';

  // Position nodes on load
  setTimeout(() => {
    positionNodes();
    updateAllLayoutViews(0);
  }, 50);

  // ==========================================================================
  // ROTATING CIRCULAR WHEEL ENGINE & 8-SERVICE STATE SYNCHRONIZATION
  // Strictly CLICK ONLY navigation with full multi-layout reactivity:
  // 1st Click on outer node / category / dock -> Selects node & spins wheel
  // 2nd Click on Node or Center Hub -> Opens target URL / Subpage!
  // ==========================================================================

  const wheelOrbit = document.getElementById('wheel-orbit');
  const nodes = document.querySelectorAll('.wheel-node');
  const centerHub = document.getElementById('wheel-center-hub');
  const hubBgLayer = document.getElementById('hub-bg-layer');

  // Hub Banner Elements Below Wheel Stage
  const hubBannerTitle = document.getElementById('hub-banner-title');
  const hubBannerSub = document.getElementById('hub-banner-sub');
  const hubBannerPhone = document.getElementById('hub-banner-phone');
  const hubBannerMail = document.getElementById('hub-banner-mail');
  const hubBannerLink = document.getElementById('hub-banner-link');
  const hubBannerCount = document.getElementById('hub-banner-count');
  const hubActionBanner = document.getElementById('hub-action-banner');

  // Option 1 Split-Screen Elements
  const splitCardCategory = document.getElementById('split-card-category');
  const splitCardCount = document.getElementById('split-card-count');
  const splitCardImg = document.getElementById('split-card-img');
  const splitCardTitle = document.getElementById('split-card-title');
  const splitCardDesc = document.getElementById('split-card-desc');
  const splitCardPhone = document.getElementById('split-card-phone');
  const splitCardMail = document.getElementById('split-card-mail');
  const splitCardLink = document.getElementById('split-card-link');

  // Option 2 Command Center Elements
  const commandTelemetryIdx = document.getElementById('command-telemetry-idx');
  const commandTelemetryTag = document.getElementById('command-telemetry-tag');
  const commandTelemetryTitle = document.getElementById('command-telemetry-title');
  const commandTelemetryDesc = document.getElementById('command-telemetry-desc');
  const commandTelemetryPhone = document.getElementById('command-telemetry-phone');
  const commandTelemetryEmail = document.getElementById('command-telemetry-email');
  const commandTelemetryLink = document.getElementById('command-telemetry-link');
  const commandCatBtns = document.querySelectorAll('.command-cat-btn');
  const dockItems = document.querySelectorAll('.dock-item');

  // Option 3 Cinematic Spotlight Elements
  const cinematicBgLayer = document.getElementById('cinematic-bg-layer');
  const cinematicCounter = document.getElementById('cinematic-counter');
  const cinematicTitle = document.getElementById('cinematic-title');
  const cinematicSub = document.getElementById('cinematic-sub');
  const cinematicStripPhone = document.getElementById('cinematic-strip-phone');
  const cinematicStripEmail = document.getElementById('cinematic-strip-email');
  const cinematicStripLink = document.getElementById('cinematic-strip-link');

  // Floating Glassmorphism Hologram HUD Screen Elements
  const heroGlassmorphScreen = document.getElementById('hero-glassmorph-screen');
  const glassSectorTag = document.getElementById('glass-sector-tag');
  const glassCounterBadge = document.getElementById('glass-counter-badge');
  const glassScreenImg = document.getElementById('glass-screen-img');
  const glassScreenTitle = document.getElementById('glass-screen-title');
  const glassScreenSub = document.getElementById('glass-screen-sub');
  const glassScreenDesc = document.getElementById('glass-screen-desc');
  const glassPhoneBtn = document.getElementById('glass-phone-btn');
  const glassPhoneText = document.getElementById('glass-phone-text');
  const glassEmailBtn = document.getElementById('glass-email-btn');
  const glassPrimaryBtn = document.getElementById('glass-primary-btn');
  const glassScrollBtn = document.getElementById('glass-scroll-btn');

  // Option 4 Bento Grid Matrix Elements
  const bentoCatCards = document.querySelectorAll('.bento-cat-card');
  const bentoLiveImg = document.getElementById('bento-live-img');
  const bentoCountBadge = document.getElementById('bento-count-badge');
  const bentoLiveTitle = document.getElementById('bento-live-title');
  const bentoLiveDesc = document.getElementById('bento-live-desc');
  const bentoPhoneBtn = document.getElementById('bento-phone-btn');
  const bentoPhoneText = document.getElementById('bento-phone-text');
  const bentoDetailsBtn = document.getElementById('bento-details-btn');

  // Data for the 8 services on the wheel with real photos & yacht wintering hall
  const servicesData = [
    {
      index: 0,
      title: "Radlight Giżycko",
      sub: "Jedna firma. Wiele możliwości.",
      desc: "Centralna grupa usługowo-nieruchomościowa na Mazurach. Łączymy turystykę, logistykę i obsługę firm w jednym punkcie.",
      img: "images/logo-w-kole.png",
      bgImg: "images/DJI_0101-1536x864.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "#o-nas",
      cardId: "o-nas",
      category: "Grupa Centralna",
      tag: "LIDER REGIONU",
      dockTitle: "Radlight"
    },
    {
      index: 1,
      title: "Apartamenty na Mazurach",
      sub: "www.mazury.holiday",
      desc: "Wynajem luksusowych, całorocznych apartamentów w centrum Giżycka i nad mazurskimi jeziorami.",
      img: "images/512X512-mh.png",
      bgImg: "images/IMG_6185-1536x1152.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:rezerwacje@mazury.holiday",
      emailDisplay: "rezerwacje@mazury.holiday",
      link: "https://www.mazury.holiday",
      cardId: "card-apartamenty",
      category: "Turystyka & Noclegi",
      tag: "APARTAMENTY PREMIUM",
      dockTitle: "Apartamenty"
    },
    {
      index: 2,
      title: "Zarządzanie Najmem",
      sub: "Kompleksowa obsługa apartamentów",
      desc: "Zajmujemy się wszystkim: od marketingu, rezerwacji i zameldowania, po pranie pościeli, sprzątanie i rozliczenia.",
      img: "images/positive-african-american-property-realtor-with-folder-showing-contemporary-cottage-to-happy-owners-1536x1024.jpg",
      bgImg: "images/real-estate-agent-holding-key-with-house-shaped-keychain--1536x1024.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "#card-zarzadzanie",
      cardId: "card-zarzadzanie",
      category: "Nieruchomości",
      tag: "OBSŁUGA NAJMU",
      dockTitle: "Najem"
    },
    {
      index: 3,
      title: "Pralnia Giżycko",
      sub: "www.pralniagizycko.pl",
      desc: "Nowoczesny park pralniczy dla hoteli, pensjonatów, jachtów, restauracji i klientów indywidualnych w Giżycku.",
      img: "images/logo-kwadrat.jpg",
      bgImg: "images/pralnia-1536x863.png",
      phone: "tel:+48730064044",
      phoneDisplay: "+48 730 064 044",
      email: "mailto:biuro@pralniagizycko.pl",
      emailDisplay: "biuro@pralniagizycko.pl",
      link: "https://www.pralniagizycko.pl",
      cardId: "card-pralnia",
      category: "Czystość & Pralnia",
      tag: "PRALNIA PRZEMYSŁOWA",
      dockTitle: "Pralnia"
    },
    {
      index: 4,
      title: "Usługi Sprzątające",
      sub: "Domy, biura, apartamenty wakacyjne",
      desc: "Certyfikowany zespół, profesjonalny sprzęt i dedykowane środki czystości. Sprzątanie cykliczne i poremontowe.",
      img: "images/123321-1152x1536.jpg",
      bgImg: "images/123321-1152x1536.jpg",
      phone: "tel:+48730067027",
      phoneDisplay: "+48 730 067 027",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "#card-sprzatanie",
      cardId: "card-sprzatanie",
      category: "Serwis Czystości",
      tag: "SPRZĄTANIE OBIEKTÓW",
      dockTitle: "Sprzątanie"
    },
    {
      index: 5,
      title: "Powierzchnie Magazynowe i Hale",
      sub: "Wynajem komercyjny w Giżycku",
      desc: "Nowoczesne ogrzewane hale, boksy magazynowe self-storage oraz lokale usługowe przy ul. Myśliwskiej 3 w Giżycku.",
      img: "images/hala-zimowanie-ogrzewana.jpg",
      bgImg: "images/hala-zimowanie-3.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "#card-magazyny",
      cardId: "card-magazyny",
      category: "Infrastruktura & Magazyny",
      tag: "HALE I BOKSY",
      dockTitle: "Hale & Magazyny"
    },
    {
      index: 6,
      title: "Helipad Mazury",
      sub: "www.helipadmazury.pl",
      desc: "Certyfikowane lądowisko dla śmigłowców w Giżycku z pełnym zapleczem hangarowym, tankowaniem i logistyką VIP.",
      img: "images/512X512-heli.png",
      bgImg: "images/air-rescue-service-1536x1024.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@helipadmazury.pl",
      emailDisplay: "biuro@helipadmazury.pl",
      link: "https://www.helipadmazury.pl",
      cardId: "card-helipad",
      category: "Lotnictwo & Logistyka",
      tag: "LĄDOWISKO HELI",
      dockTitle: "Helipad"
    },
    {
      index: 7,
      title: "Zimowanie Jachtów Giżycko",
      sub: "zimowaniejachtow.com.pl",
      desc: "Ogrzewana hala, strzeżony plac, slipowanie dźwigiem, transport, mycie kadłubów, konserwacja i autoryzowany serwis silników.",
      img: "images/LOGO-ALL-BOAT.jpg",
      bgImg: "images/hero-yard-evening-v3.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@zimowaniejachtow.com.pl",
      emailDisplay: "biuro@zimowaniejachtow.com.pl",
      link: "https://zimowaniejachtow.com.pl/",
      cardId: "card-zimowanie",
      category: "Marine & Żeglarstwo",
      tag: "ZIMOWANIE & SERWIS",
      dockTitle: "Zimowanie Łodzi"
    }
  ];

  let activeIndex = 0;
  let autoRotateInterval = null;

  // Scroll to target service card on page and trigger glowing highlight pulse
  function scrollToAndHighlightCard(cardId) {
    if (!cardId) return;
    
    // Strip leading hash if present
    const cleanId = cardId.replace(/^#/, '');
    const targetEl = document.getElementById(cleanId);
    if (!targetEl) return;

    // If target is inside #uslugi catalog, ensure it is visible through filter
    if (targetEl.classList.contains('service-card')) {
      const cardCategory = targetEl.getAttribute('data-category');
      const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
      const currentActiveFilter = document.querySelector('.filter-btn.active');
      const activeFilterVal = currentActiveFilter ? currentActiveFilter.getAttribute('data-filter') : 'all';

      if (activeFilterVal !== 'all' && activeFilterVal !== cardCategory) {
        if (allFilterBtn) allFilterBtn.click();
      }
      targetEl.style.display = 'flex';
      targetEl.style.opacity = '1';
      targetEl.style.transform = 'translateY(0)';
    }

    // Smooth scroll directly to the card centered in viewport
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Clear highlight from any existing element
    document.querySelectorAll('.card-target-highlight').forEach(el => {
      el.classList.remove('card-target-highlight');
    });

    // Add glowing orange pulse highlight
    setTimeout(() => {
      targetEl.classList.add('card-target-highlight');
    }, 200);

    // Fade out highlight after 3.2s
    setTimeout(() => {
      targetEl.classList.remove('card-target-highlight');
    }, 3400);
  }

  // Helper to open link or scroll to card
  function openServiceLink(linkUrl, cardId) {
    if (cardId) {
      scrollToAndHighlightCard(cardId);
      return;
    }
    if (!linkUrl) return;
    if (linkUrl.startsWith('#')) {
      scrollToAndHighlightCard(linkUrl);
    } else if (linkUrl.startsWith('http')) {
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = linkUrl;
    }
  }

  // Position nodes on circular orbit based on container size
  function positionNodes() {
    const total = nodes.length;
    const container = document.getElementById('interactive-wheel') || document.querySelector('.wheel-container');
    if (!container) return;

    const orbitRing = container.querySelector('.orbit-ring');
    const radius = orbitRing && orbitRing.offsetWidth > 0 ? orbitRing.offsetWidth / 2 : (container.offsetWidth > 0 ? container.offsetWidth * 0.4 : 200);

    nodes.forEach((node, i) => {
      const angle = ((i * (360 / total)) - 90) * (Math.PI / 180);
      const x = Math.round(radius * Math.cos(angle));
      const y = Math.round(radius * Math.sin(angle));

      node.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // Update Dynamic Views Across ALL 3 Layouts
  function updateAllLayoutViews(index) {
    const data = servicesData[index];
    if (!data) return;

    const countStr = `${String(index + 1).padStart(2, '0')} / ${String(servicesData.length).padStart(2, '0')}`;

    // 1. Update Central Wheel Hub
    if (hubBgLayer) {
      hubBgLayer.style.backgroundImage = `url("${data.img}")`;
      if (data.img.includes('logo') || data.img.includes('512X512') || data.img.includes('svg') || index === 0) {
        hubBgLayer.style.backgroundColor = '#ffffff';
        hubBgLayer.style.backgroundSize = '70% auto';
        hubBgLayer.style.backgroundPosition = 'center';
        hubBgLayer.style.backgroundRepeat = 'no-repeat';
      } else {
        hubBgLayer.style.backgroundColor = 'transparent';
        hubBgLayer.style.backgroundSize = 'cover';
        hubBgLayer.style.backgroundPosition = 'center';
        hubBgLayer.style.backgroundRepeat = 'no-repeat';
      }
    }

    // 2. Update Default Action Banner
    if (hubActionBanner) {
      hubActionBanner.classList.remove('is-changing');
      void hubActionBanner.offsetWidth;
      hubActionBanner.classList.add('is-changing');
    }
    if (hubBannerTitle) hubBannerTitle.textContent = data.title;
    if (hubBannerSub) hubBannerSub.textContent = data.sub;
    if (hubBannerCount) hubBannerCount.textContent = countStr;
    if (hubBannerPhone) hubBannerPhone.href = data.phone;
    if (hubBannerMail) hubBannerMail.href = data.email || "mailto:biuro@radlight.pl";
    if (hubBannerLink) {
      hubBannerLink.href = data.link;
      if (data.link.startsWith('http')) hubBannerLink.target = '_blank';
      else hubBannerLink.removeAttribute('target');
    }

    // 3. Update Option 1 Split-Screen Live Card
    if (splitCardCategory) splitCardCategory.textContent = data.category;
    if (splitCardCount) splitCardCount.textContent = countStr;
    if (splitCardImg) {
      splitCardImg.src = data.img;
      splitCardImg.alt = data.title;
    }
    if (splitCardTitle) splitCardTitle.textContent = data.title;
    if (splitCardDesc) splitCardDesc.textContent = data.desc;
    if (splitCardPhone) splitCardPhone.href = data.phone;
    if (splitCardMail) splitCardMail.href = data.email || "mailto:biuro@radlight.pl";
    if (splitCardLink) {
      splitCardLink.href = data.link;
      if (data.link.startsWith('http')) splitCardLink.target = '_blank';
      else splitCardLink.removeAttribute('target');
    }

    // 4. Update Option 2 Command Center Telemetry & Dock
    if (commandTelemetryIdx) commandTelemetryIdx.textContent = countStr;
    if (commandTelemetryTag) commandTelemetryTag.textContent = data.tag;
    if (commandTelemetryTitle) commandTelemetryTitle.textContent = data.title;
    if (commandTelemetryDesc) commandTelemetryDesc.textContent = data.desc;
    if (commandTelemetryPhone) {
      commandTelemetryPhone.textContent = data.phoneDisplay;
      commandTelemetryPhone.href = data.phone;
    }
    if (commandTelemetryEmail) {
      commandTelemetryEmail.textContent = data.emailDisplay;
      commandTelemetryEmail.href = data.email;
    }
    if (commandTelemetryLink) {
      commandTelemetryLink.href = data.link;
      if (data.link.startsWith('http')) commandTelemetryLink.target = '_blank';
      else commandTelemetryLink.removeAttribute('target');
    }

    // Update Dock active state
    dockItems.forEach((dock, dIdx) => {
      dock.classList.toggle('active', dIdx === index);
    });

    // Update Category Button active state (matches closest node index)
    commandCatBtns.forEach(catBtn => {
      const targetIdx = parseInt(catBtn.getAttribute('data-node-target'), 10);
      catBtn.classList.toggle('active', targetIdx === index);
    });

    // 5. Update Option 3 Cinematic Spotlight
    if (cinematicBgLayer) {
      cinematicBgLayer.style.backgroundImage = `url("${data.bgImg || data.img}")`;
    }
    if (cinematicCounter) cinematicCounter.textContent = countStr;
    if (cinematicTitle) cinematicTitle.textContent = data.title;
    if (cinematicSub) cinematicSub.textContent = `${data.sub} — ${data.desc}`;
    if (cinematicStripPhone) {
      cinematicStripPhone.href = data.phone;
      const phoneSpan = cinematicStripPhone.querySelector('span');
      if (phoneSpan) phoneSpan.textContent = data.phoneDisplay;
    }
    if (cinematicStripEmail) {
      cinematicStripEmail.href = data.email;
      const emailSpan = cinematicStripEmail.querySelector('span');
      if (emailSpan) emailSpan.textContent = data.emailDisplay;
    }
    if (cinematicStripLink) {
      cinematicStripLink.href = data.link;
      if (data.link.startsWith('http')) cinematicStripLink.target = '_blank';
      else cinematicStripLink.removeAttribute('target');
    }

    // 6. Update Floating Glassmorphism Hologram HUD Screen
    if (glassSectorTag) glassSectorTag.textContent = data.tag;
    if (glassCounterBadge) glassCounterBadge.textContent = countStr;
    if (glassScreenImg) {
      glassScreenImg.src = data.bgImg || data.img;
      glassScreenImg.alt = data.title;
    }
    if (glassScreenTitle) glassScreenTitle.textContent = data.title;
    if (glassScreenSub) glassScreenSub.textContent = data.sub;
    if (glassScreenDesc) glassScreenDesc.textContent = data.desc;
    if (glassPhoneBtn) {
      glassPhoneBtn.href = data.phone;
    }
    if (glassPhoneText) {
      glassPhoneText.textContent = data.phoneDisplay;
    }
    if (glassEmailBtn) {
      glassEmailBtn.href = data.email;
    }
    if (glassPrimaryBtn) {
      glassPrimaryBtn.href = data.link;
      if (data.link.startsWith('http')) glassPrimaryBtn.target = '_blank';
      else glassPrimaryBtn.removeAttribute('target');
    }

    // 7. Update Option 2/4 Bento Grid Matrix
    if (bentoCountBadge) bentoCountBadge.textContent = countStr;
    if (bentoLiveTitle) bentoLiveTitle.textContent = data.title;
    if (bentoLiveDesc) bentoLiveDesc.textContent = data.desc;
    if (bentoLiveImg) {
      bentoLiveImg.src = data.img || data.bgImg;
      bentoLiveImg.alt = data.title;
    }
    if (bentoPhoneBtn) {
      bentoPhoneBtn.href = data.phone;
    }
    if (bentoPhoneText) {
      bentoPhoneText.textContent = data.phoneDisplay;
    }
    if (bentoDetailsBtn) {
      bentoDetailsBtn.href = data.link;
      if (data.link.startsWith('http')) bentoDetailsBtn.target = '_blank';
      else bentoDetailsBtn.removeAttribute('target');
    }
    bentoCatCards.forEach(card => {
      const targetIdx = parseInt(card.getAttribute('data-bento-target'), 10);
      card.classList.toggle('active', targetIdx === index);
    });

    // 8. Highlight active node on circular orbit
    nodes.forEach((n, idx) => {
      n.classList.toggle('active', idx === index);
    });
  }

  function setActiveIndex(newIndex) {
    const total = nodes.length;
    activeIndex = (newIndex + total) % total;
    
    // Rotate orbit so active node rotates smoothly
    const rotationAngle = -activeIndex * (360 / total);
    if (wheelOrbit) wheelOrbit.style.transform = `rotate(${rotationAngle}deg)`;

    // Counter-rotate node icons so they stay upright
    nodes.forEach((n) => {
      const innerBox = n.querySelector('.node-icon-box');
      if (innerBox) innerBox.style.setProperty('--counter-rotation', `${-rotationAngle}deg`);
    });

    updateAllLayoutViews(activeIndex);
  }

  // Auto rotation timer
  function startAutoRotate() {
    stopAutoRotate();
    autoRotateInterval = setInterval(() => {
      setActiveIndex(activeIndex + 1);
    }, 6000);
  }

  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  // Node Click Events (CLICK ONLY)
  nodes.forEach((node, i) => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoRotate();

      if (activeIndex === i) {
        const data = servicesData[i];
        if (data && data.cardId) {
          scrollToAndHighlightCard(data.cardId);
        } else if (data && data.link) {
          openServiceLink(data.link);
        }
      } else {
        setActiveIndex(i);
        startAutoRotate();
      }
    });
  });

  // Bento Category cards click handlers (Option 4)
  bentoCatCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoRotate();
      const targetIdx = parseInt(card.getAttribute('data-bento-target'), 10);
      if (!isNaN(targetIdx)) {
        setActiveIndex(targetIdx);
        startAutoRotate();
      }
    });
  });

  // Center Hub Click Handler (Smoothly scrolls to active service card and highlights it)
  if (centerHub) {
    centerHub.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoRotate();
      const data = servicesData[activeIndex];
      if (data && data.cardId) {
        scrollToAndHighlightCard(data.cardId);
      } else if (data && data.link) {
        openServiceLink(data.link);
      }
    });
  }

  // Glass Screen "W katalogu" button click handler
  if (glassScrollBtn) {
    glassScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoRotate();
      const data = servicesData[activeIndex];
      if (data && data.cardId) {
        scrollToAndHighlightCard(data.cardId);
      } else {
        scrollToAndHighlightCard('uslugi');
      }
    });
  }

  // Action buttons click listeners
  [splitCardLink, hubBannerLink, cinematicStripLink, bentoDetailsBtn, glassPrimaryBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        stopAutoRotate();
        scrollToAndHighlightCard(href);
      }
    });
  });

  // Mobile Bottom Navigation active item on scroll
  const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item');
  if (mobileNavItems.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 200;
      const uslugiSec = document.getElementById('uslugi');
      const aboutSec = document.getElementById('o-nas');
      const contactSec = document.getElementById('kontakt');

      mobileNavItems.forEach(item => {
        const href = item.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        let targetSec = null;
        if (href === '#kolo-uslug') targetSec = document.getElementById('kolo-uslug');
        else if (href === '#uslugi') targetSec = uslugiSec;
        else if (href === '#o-nas') targetSec = aboutSec;
        else if (href === '#kontakt') targetSec = contactSec;

        if (targetSec) {
          const top = targetSec.offsetTop;
          const height = targetSec.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
          }
        }
      });
    }, { passive: true });
  }

  // Ensure Video Background Plays
  const videoBg = document.getElementById('hero-video-bg');
  if (videoBg) {
    videoBg.play().catch(() => {
      console.log('Video autoplay handled by browser policy');
    });
  }

  // Initialize Position & Wheel
  positionNodes();
  setActiveIndex(0);
  startAutoRotate();

  window.addEventListener('resize', positionNodes);

  // Slightly denser header after the user starts scrolling.
  const header = document.getElementById('header');
  const syncHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });

  // ========================================================================== 
  // CATALOG FILTER TABS
  // ========================================================================== 

  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ========================================================================== 
  // FAQ ACCORDION ENGINE
  // ========================================================================== 

  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // If clicked item was not active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ========================================================================== 
  // LEGAL & RODO MODAL DIALOG
  // ========================================================================== 

  const legalModal = document.getElementById('legal-modal');
  const openPrivacyBtn = document.getElementById('open-privacy-btn');
  const openTermsBtn = document.getElementById('open-terms-btn');
  const openCookiesBtn = document.getElementById('open-cookies-btn');
  const closeLegalModalBtn = document.getElementById('close-legal-modal');
  const btnCloseModalInner = document.getElementById('btn-close-modal-inner');
  const modalTitle = document.getElementById('modal-title');

  function openLegalModal(titleText) {
    if (!legalModal) return;
    if (modalTitle && titleText) modalTitle.textContent = titleText;
    legalModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal('Polityka Prywatności i RODO');
    });
  }

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal('Regulamin Serwisu Radlight.pl');
    });
  }

  if (openCookiesBtn) {
    openCookiesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal('Polityka Plików Cookies (Ciasteczka)');
    });
  }

  if (closeLegalModalBtn) closeLegalModalBtn.addEventListener('click', closeLegalModal);
  if (btnCloseModalInner) btnCloseModalInner.addEventListener('click', closeLegalModal);

  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeLegalModal();
    });
  }

  console.log('Radlight Executive Website initialized.');
});
