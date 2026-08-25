// ==========================================================================
// RADLIGHT GIŻYCKO — MASTER INTERACTIVE ENGINE (WHEEL, THEME & I18N)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  let activeIndex = 0;
  let autoRotateTimer = null;

  // ==========================================================================
  // 1. DAY / NIGHT MODE THEME TOGGLE ENGINE (☀️ / 🌙)
  // ==========================================================================

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Check stored theme preference (Default is Dark Mode)
  const savedTheme = localStorage.getItem('radlight_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('radlight_theme', isLight ? 'light' : 'dark');
      console.log(`Theme toggled to: ${isLight ? 'LIGHT ☀️' : 'DARK PRESTIGE 🌙'}`);
    });
  });

  // ==========================================================================
  // 2. MULTI-LANGUAGE SYSTEM (PL / DE / EN)
  // ==========================================================================
  // 2. MULTI-LANGUAGE SYSTEM (PL / DE / EN) — ULTRA ROBUST
  // ==========================================================================

  let currentLang = localStorage.getItem('radlight_lang') || 'pl';

  function setLanguage(lang) {
    if (!lang) return;
    if (typeof translations === 'undefined' || !translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('radlight_lang', lang);

    // Update active class on all language buttons across page
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Translate titles & aria-labels
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('title', translations[lang][key]);
        if (el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', translations[lang][key]);
        }
      }
    });

    // Refresh active wheel node & hub display if present
    if (typeof updateShowcase === 'function' && typeof activeIndex !== 'undefined') {
      try {
        updateShowcase(activeIndex);
      } catch (err) {
        console.warn('updateShowcase skipped on subpage');
      }
    }

    console.log(`Language set to: ${lang.toUpperCase()}`);
  }

  // Global delegated click listener for ALL language buttons (top bar, sticky header, mobile drawer)
  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
      e.preventDefault();
      const selectedLang = langBtn.getAttribute('data-lang');
      if (selectedLang) {
        setLanguage(selectedLang);
      }
    }
  });

  // ==========================================================================
  // 2.5 BACK TO TOP FLOATING BUTTON (MOBILE & DESKTOP)
  // ==========================================================================

  let backToTopBtn = document.getElementById('btn-back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'btn-back-to-top';
    backToTopBtn.className = 'btn-back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Przewiń na górę strony');
    backToTopBtn.setAttribute('title', 'Przewiń na górę');
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
  }

  let lastScrollY = window.scrollY || 0;
  const scrollThreshold = 6;

  const handleScrollBackToTop = () => {
    const currentScrollY = window.scrollY || 0;

    if (window.innerWidth <= 768) {
      // MOBILE: Hide when scrolling down, show only when actively scrolling UP
      if (currentScrollY > 200) {
        if (currentScrollY < lastScrollY - scrollThreshold) {
          // User is scrolling UP on mobile -> show back-to-top button
          backToTopBtn.classList.add('visible');
        } else if (currentScrollY > lastScrollY + scrollThreshold) {
          // User is scrolling DOWN on mobile -> hide back-to-top button
          backToTopBtn.classList.remove('visible');
        }
      } else {
        // At or near top -> hide button
        backToTopBtn.classList.remove('visible');
      }
    } else {
      // DESKTOP: show when scrolled past hero
      if (currentScrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScrollBackToTop, { passive: true });
  handleScrollBackToTop();

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================================================
  // 3. MOBILE NAVIGATION DRAWER
  // ==========================================================================

  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dockMenuBtn = document.getElementById('dock-menu-btn');

  function toggleMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.toggle('active');
    const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
    if (icon) {
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  if (dockMenuBtn) {
    dockMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileMenu();
      if (navMenu && navMenu.classList.contains('active')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Sticky Header Scrolled State (shows quick actions on PC navbar)
  const mainHeader = document.querySelector('.main-header');
  if (mainHeader) {
    const checkHeaderScroll = () => {
      if (window.scrollY > 45) {
        mainHeader.classList.add('is-scrolled');
      } else {
        mainHeader.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', checkHeaderScroll, { passive: true });
    checkHeaderScroll();
  }

  // Close menu when clicking nav links on mobile
  if (navMenu) {
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          const icon = mobileToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      });
    });
  }

  // ==========================================================================
  // 4. DATA FOR THE 8 SERVICES ON THE 360° WHEEL
  // ==========================================================================

  const servicesData = [
    {
      index: 0,
      title: "Jedna Firma",
      sub: "wiele możliwości",
      desc: "Centralna baza usług w Giżycku. Łączymy luksusowe apartamenty, pralnię przemysłową, obsługę najmu, magazyny self-storage, helipad oraz marinę z zimowaniem jachtów przy ul. Myśliwskiej 3.",
      img: "images/na-strone-Radlight.pl-Logo-pomarancz-czarny.png",
      bgImg: "images/DJI_0101-1536x864.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "uslugi.html",
      cardId: "uslugi",
      category: "RADLIGHT CENTRUM",
      tag: "CENTRUM RADLIGHT"
    },
    {
      index: 1,
      title: "Apartamenty",
      sub: "www.mazury.holiday",
      desc: "Luksusowy wynajem całorocznych apartamentów, domków letniskowych i pokoi w centrum Giżycka i nad mazurskimi jeziorami. Klimatyzacja, szybkie Wi-Fi, pościel hotelowa z naszej pralni oraz dedykowany parking.",
      img: "images/stranda_hero_jacuzzi.webp",
      nodeImg: "images/512X512-mh.png",
      bgImg: "images/IMG_6185-1536x1152.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:rezerwacje@mazury.holiday",
      emailDisplay: "rezerwacje@mazury.holiday",
      link: "apartamenty.html",
      cardId: "card-apartamenty",
      category: "TURYSTYKA & NOCLEGI",
      tag: "APARTAMENTY & DOMKI"
    },
    {
      index: 2,
      title: "Zarządzanie najmem",
      sub: "Zajmiemy się wszystkim",
      desc: "Zajmujemy się wszystkim: od profesjonalnej sesji zdjęciowej i marketingu na Booking/Airbnb, po zameldowanie gości, pranie pościeli, sprzątanie pobytowe i terminowe rozliczenia.",
      img: "images/103761_7.jpg",
      nodeImg: "images/real-estate-agent-holding-key-with-house-shaped-keychain--1536x1024.jpg",
      bgImg: "images/103779_7.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "zarzadzanie-najmem.html",
      cardId: "card-zarzadzanie",
      category: "OBSŁUGA NIERUCHOMOŚCI",
      tag: "ZARZĄDZANIE NAJMEM"
    },
    {
      index: 3,
      title: "Własna pralnia",
      sub: "www.pralniagizycko.pl",
      desc: "Nowoczesny park pralniczy dla hoteli, pensjonatów, jachtów, restauracji i klientów indywidualnych w Giżycku. Odbiór i dowóz prania własnym transportem w promieniu 50 km.",
      img: "images/work-in-laundry-2025-03-17-04-27-23-utc-1536x1024.jpg",
      nodeImg: "images/logo-kwadrat.jpg",
      bgImg: "images/pralnia-industrial-plant.jpg",
      phone: "tel:+48730064044",
      phoneDisplay: "+48 730 064 044",
      email: "mailto:biuro@pralniagizycko.pl",
      emailDisplay: "biuro@pralniagizycko.pl",
      link: "pralnia.html",
      cardId: "card-pralnia",
      category: "PRALNIA PRZEMYSŁOWA",
      tag: "PARK PRALNICZY"
    },
    {
      index: 4,
      title: "Profesjonalne usługi sprzątające",
      sub: "Domy, biura, apartamenty",
      desc: "Certyfikowany zespół, profesjonalny sprzęt Kärcher i ekologiczne środki czystości. Kompleksowe sprzątanie cykliczne, poremontowe oraz doczyszczanie jachtów po sezonie.",
      img: "images/modern-office-2025-02-22-16-24-55-utc-2048x1365.jpg",
      nodeImg: "images/pralnia-1536x863.png",
      bgImg: "images/modern-office-2025-02-22-16-24-55-utc-2048x1365.jpg",
      phone: "tel:+48730067027",
      phoneDisplay: "+48 730 067 027",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "sprzatanie.html",
      cardId: "card-sprzatanie",
      category: "SERWIS CZYSTOŚCI",
      tag: "SPRZĄTANIE OBIEKTÓW"
    },
    {
      index: 5,
      title: "Powierzchnie usługowo magazynowe",
      sub: "Sprawdź ofertę",
      desc: "Nowoczesne hale produkcyjno-magazynowe, boksy magazynowe self-storage, powierzchnie użytkowe i komercyjne oraz utwardzone place składowe przy ul. Sybiraków 15. Monitoring CCTV 24/7, bramy z poziomu 0 i dogodny dojazd TIR.",
      img: "images/hala-zimowanie-3.jpg",
      nodeImg: "images/DJI_0121small-1536x1171.jpg",
      bgImg: "images/hala-zimowanie-3.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "magazyny.html",
      cardId: "card-magazyny",
      category: "INFRASTRUKTURA & HALE",
      tag: "HALE & MAGAZYNY"
    },
    {
      index: 6,
      title: "Lądowisko dla śmigłowców",
      sub: "www.helipadmazury.pl",
      desc: "Certyfikowane lądowisko dla śmigłowców w Giżycku z pełnym oświetleniem nawigacyjnym, zapleczem hangarowym, tankowaniem i profesjonalną logistyką VIP / LPR.",
      img: "images/air-rescue-service-1536x1024.jpg",
      nodeImg: "images/512X512-heli.png",
      bgImg: "images/air-rescue-service-1536x1024.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@helipadmazury.pl",
      emailDisplay: "biuro@helipadmazury.pl",
      link: "helipad.html",
      cardId: "card-helipad",
      category: "LOTNICTWO & LOGISTYKA",
      tag: "LĄDOWISKO HELI"
    },
    {
      index: 7,
      title: "Czarter Stillo30 VIP",
      sub: "Zarezerwuj swój rejs!",
      desc: "Luksusowy czarter nowoczesnych jednostek motorowych typu Houseboat bez patentu po Szlaku Wielkich Jezior Mazurskich.",
      img: "images/103945_3.jpg",
      nodeImg: "images/103945_3.jpg",
      bgImg: "images/103945_3.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "czarter.html",
      cardId: "card-czarter",
      category: "CZARTER & REJSY",
      tag: "CZARTER JACHTÓW"
    },
    {
      index: 8,
      title: "Zimowanie łodzi",
      sub: "kliknij po więcej informacji",
      desc: "Nowoczesna ogrzewana hala, strzeżony plac, slipowanie dźwigiem, transport specjalistyczny, mycie dna, zabezpieczenie antyporostowe i autoryzowany serwis silników jachtowych.",
      img: "images/hero-yard-evening-v3.jpg",
      nodeImg: "images/LOGO-ALL-BOAT.jpg",
      bgImg: "images/hero-yard-evening-v3.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "zimowanie-jachtow.html",
      cardId: "card-zimowanie",
      category: "MARINE & ŻEGLARSTWO",
      tag: "ZIMOWANIE & SERWIS"
    }
  ];

  // ==========================================================================
  // 5. 360° INTERACTIVE WHEEL & SHOWCASE SYNCHRONIZATION
  // ==========================================================================

  const wheelContainer = document.getElementById('interactive-wheel');
  const wheelOrbit = document.getElementById('wheel-orbit');
  let nodes = document.querySelectorAll('.wheel-node');
  const centerHub = document.getElementById('wheel-center-hub');

  // Center Hub DOM Elements
  const hubAvatarImg = document.getElementById('hub-avatar-img');
  const hubTitle = document.getElementById('hub-title');
  const hubSub = document.getElementById('hub-sub');
  const hubPhoneBtn = document.getElementById('hub-phone-btn');
  const hubMailBtn = document.getElementById('hub-mail-btn');
  const hubContactEmail = document.getElementById('hub-contact-email');
  const hubEmailText = document.getElementById('hub-email-text');
  const hubContactWeb = document.getElementById('hub-contact-web');
  const hubWebText = document.getElementById('hub-web-text');

  // Position nodes radially on the orbit ring
  function positionNodes() {
    nodes = document.querySelectorAll('.wheel-node');
    if (!wheelContainer || nodes.length === 0) return;
    const total = nodes.length;
    const isMobile = window.innerWidth <= 768;
    const containerW = wheelContainer.offsetWidth || (isMobile ? 350 : 760);
    const radius = isMobile ? Math.round(containerW * 0.415) : 285;

    nodes.forEach((node, i) => {
      const angle = ((i * (360 / total)) - 90) * (Math.PI / 180);
      const x = Math.round(radius * Math.cos(angle));
      const y = Math.round(radius * Math.sin(angle));
      node.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // Update Center Hub with smooth animation & multi-language support
  function updateShowcase(index) {
    const data = servicesData[index];
    if (!data) return;

    const langData = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang].servicesWheel)
      ? translations[currentLang].servicesWheel[index]
      : null;

    const displayTitle = langData ? langData.title : data.title;
    const displaySub = langData ? langData.sub : data.sub;

    const hubInner = document.getElementById('hub-inner-core');
    if (hubInner) {
      hubInner.classList.remove('animate-in');
      void hubInner.offsetWidth;
      hubInner.classList.add('animate-in');
    }

    // 1. Update Center Hub (Standalone large logo for index 0 / Radlight Central)
    const hubAvatar = document.getElementById('hub-avatar') || document.querySelector('.hub-avatar');
    const hubAvatarCircle = document.querySelector('.hub-avatar-circle');
    const isStandalone = (index === 0);

    if (hubAvatar) {
      hubAvatar.classList.toggle('is-standalone-logo', isStandalone);
    }
    if (hubAvatarCircle) {
      hubAvatarCircle.classList.toggle('is-standalone-logo', isStandalone);
    }

    if (hubAvatarImg) {
      hubAvatarImg.src = data.img;
      hubAvatarImg.alt = displayTitle;
      const isLogo = isStandalone || data.img.includes('Logo') || data.img.includes('logo') || data.img.includes('512X512') || data.img.includes('LOGO');
      if (hubAvatarCircle) {
        hubAvatarCircle.classList.toggle('logo-type', isLogo);
      }
    }
    if (hubTitle) hubTitle.textContent = displayTitle;
    if (hubSub) hubSub.textContent = displaySub;
    
    const hubCtaLink = document.getElementById('hub-cta-link');
    const hubCtaText = document.getElementById('hub-cta-text');
    if (hubCtaLink) {
      hubCtaLink.href = data.link;
      const ctaLabel = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang].btnReadMoreHub) ? translations[currentLang].btnReadMoreHub : 'Czytaj dalej';
      if (hubCtaText) hubCtaText.textContent = ctaLabel;
    }
    if (hubPhoneBtn) {
      hubPhoneBtn.href = data.phone;
      const phoneTip = currentLang === 'de' ? `Anrufen: ${data.phoneDisplay}` : (currentLang === 'en' ? `Call: ${data.phoneDisplay}` : `Zadzwoń: ${data.phoneDisplay}`);
      hubPhoneBtn.setAttribute('title', phoneTip);
    }
    if (hubMailBtn) {
      hubMailBtn.href = data.email;
      const mailTip = currentLang === 'de' ? `E-Mail schreiben: ${data.emailDisplay}` : (currentLang === 'en' ? `Send email: ${data.emailDisplay}` : `Napisz: ${data.emailDisplay}`);
      hubMailBtn.setAttribute('title', mailTip);
    }
    if (hubContactEmail) {
      hubContactEmail.href = data.email;
    }
    if (hubEmailText) {
      hubEmailText.textContent = data.emailDisplay;
    }
    if (hubContactWeb) {
      hubContactWeb.href = data.link;
    }
    if (hubWebText) {
      hubWebText.textContent = (displaySub && displaySub.startsWith('www.')) ? displaySub : 'www.radlight.pl';
    }

    // 2. Highlight Active Node & Update Tooltips in Current Language
    nodes = document.querySelectorAll('.wheel-node');
    nodes.forEach((n, idx) => {
      n.classList.toggle('active', idx === index);
      const nodeLang = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang].servicesWheel)
        ? translations[currentLang].servicesWheel[idx]
        : null;
      if (nodeLang) {
        if (nodeLang.tooltip) n.setAttribute('title', nodeLang.tooltip);
        if (nodeLang.title) n.setAttribute('aria-label', nodeLang.title);
      }
    });
  }

  function setActiveIndex(newIndex) {
    nodes = document.querySelectorAll('.wheel-node');
    const total = nodes.length;
    activeIndex = (newIndex + total) % total;

    updateShowcase(activeIndex);
  }

  function startAutoRotate() {
    // Keep fixed like radlight.pl
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  // Node Click and Hover Handlers (1:1 with radlight.pl)
  nodes.forEach((node, i) => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveIndex(i);
    });

    node.addEventListener('mouseenter', () => {
      setActiveIndex(i);
    });
  });

  // Center Hub Click Handler
  if (centerHub) {
    centerHub.addEventListener('click', (e) => {
      // If clicking any link or button (phone, email mailto, web link or CTA button), allow default browser action
      if (e.target.closest('a, button, .hub-action-btn, #hub-contact-email, #hub-phone-btn, #hub-mail-btn, #hub-cta-link, #hub-contact-web')) {
        stopAutoRotate();
        return;
      }
      e.preventDefault();
      stopAutoRotate();
      const data = servicesData[activeIndex];
      if (data && data.link) {
        if (data.link.startsWith('#')) {
          scrollToTargetCard(data.link);
        } else if (data.link.startsWith('http')) {
          window.open(data.link, '_blank');
        } else {
          window.location.href = data.link;
        }
      }
    });
  }

  const hubScrollBtn = document.querySelector('.btn-explore-offer');
  if (hubScrollBtn) {
    hubScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTargetCard('uslugi');
    });
  }

  const heroPulseArrow = document.querySelector('.hero-pulse-arrow');
  if (heroPulseArrow) {
    heroPulseArrow.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTargetCard('uslugi');
    });
  }

  // Smooth scroll and pulse highlight on target service card or section
  function scrollToTargetCard(cardId) {
    if (!cardId) return;
    const cleanId = cardId.replace(/^#/, '');
    const targetEl = document.getElementById(cleanId);
    if (!targetEl) return;

    // Header offset for sticky navigation
    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 75;
    const extraMargin = 25;
    const headerOffset = headerHeight + extraMargin;

    // If inside services catalog, ensure all filter is active
    if (targetEl.classList.contains('service-card')) {
      const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allFilterBtn) allFilterBtn.click();
    }

    const elementPosition = targetEl.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    if (targetEl.classList.contains('service-card')) {
      document.querySelectorAll('.card-target-highlight').forEach(el => {
        el.classList.remove('card-target-highlight');
      });

      setTimeout(() => {
        targetEl.classList.add('card-target-highlight');
      }, 300);

      setTimeout(() => {
        targetEl.classList.remove('card-target-highlight');
      }, 3200);
    }
  }

  // Window resize handler for responsive node positioning
  window.addEventListener('resize', () => {
    positionNodes();
  });

  // Initial page & wheel setup
  setLanguage(currentLang);
  positionNodes();
  setActiveIndex(0);
  startAutoRotate();

  setTimeout(() => {
    positionNodes();
    setActiveIndex(0);
  }, 100);

  // ==========================================================================
  // 6. SERVICES CATALOG FILTER TABS
  // ==========================================================================

  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  // Ensure all service cards are immediately visible
  serviceCards.forEach(card => {
    card.style.display = 'flex';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCat === filterValue) {
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
  // 7. FAQ ACCORDION TOGGLE
  // ==========================================================================

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ==========================================================================
  // 8. CONTACT FORM SUBMISSION FEEDBACK
  // ==========================================================================

  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-submit-form');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Dziękujemy! Wiadomość wysłana.';
        submitBtn.style.background = '#10b981';
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 4000);
      }
    });
  }

  // ==========================================================================
  // 9. SMOOTH SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ==========================================================================

  const revealElements = document.querySelectorAll(
    '.service-card, .subpage-block, .subpage-feat-card, .stat-card, .contact-dept-card, .faq-item, .subpage-hero-card, .about-content, .eu-card'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px 100px 0px',
      threshold: 0
    });

    revealElements.forEach((el, index) => {
      el.classList.add('reveal-element');
      el.style.transitionDelay = `${(index % 4) * 0.04}s`;
      revealObserver.observe(el);
    });
  }

});
