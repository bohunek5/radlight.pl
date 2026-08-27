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

  const dockBrandCenter = document.querySelector('.dock-brand-center');
  if (dockBrandCenter) {
    dockBrandCenter.addEventListener('click', (e) => {
      const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('.html');
      if (isIndex) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

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
  // 4. DATA FOR SERVICES ON THE 360° WHEEL (DESKTOP & MOBILE)
  // ==========================================================================

  // 8 Services for Desktop (PC)
  const desktopServicesData = [
    {
      index: 0,
      title: "Poznaj Radlight",
      sub: "",
      desc: "Centralna baza usług w Giżycku. Łączymy luksusowe apartamenty, pralnię przemysłową, obsługę najmu, magazyny self-storage, helipad oraz marinę z zimowaniem jachtów w Giżycku (baza centralna ul. Myśliwska 3).",
      img: "images/radlight-r-symbol.png",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "o-nas.html",
      linkTarget: "o-nas.html",
      linkText: "o-nas.html",
      category: "RADLIGHT CENTRUM",
      tag: "CENTRUM RADLIGHT"
    },
    {
      index: 1,
      title: "Apartamenty, domki, pokoje",
      sub: "",
      desc: "Luksusowy wynajem całorocznych apartamentów, domków letniskowych i pokoi w centrum Giżycka i nad mazurskimi jeziorami. Klimatyzacja, szybkie Wi-Fi, pościel hotelowa z naszej pralni oraz dedykowany parking.",
      img: "images/512X512-mh.png",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:rezerwacje@mazury.holiday",
      emailDisplay: "rezerwacje@mazury.holiday",
      link: "apartamenty.html",
      linkTarget: "apartamenty.html",
      linkText: "apartamenty.html",
      category: "TURYSTYKA & NOCLEGI",
      tag: "APARTAMENTY & DOMKI"
    },
    {
      index: 2,
      title: "Obsługa najmu",
      sub: "",
      desc: "Kompleksowa opieka nad apartamentem: marketing na Booking i Airbnb, meldunek gości kodem PIN, sprzątanie, wymiana i pranie pościeli oraz pełne rozliczenia finansowe.",
      img: "images/real-estate-agent-holding-key-with-house-shaped-keychain--1536x1024.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "zarzadzanie-najmem.html",
      linkTarget: "zarzadzanie-najmem.html",
      linkText: "zarzadzanie-najmem.html",
      category: "NIERUCHOMOŚCI",
      tag: "OBSŁUGA NAJMU"
    },
    {
      index: 3,
      title: "Pralnia przemysłowa",
      sub: "",
      desc: "Nowoczesny park pralniczy dla hoteli, pensjonatów, jachtów, restauracji i klientów indywidualnych w Giżycku. Odbiór i dowóz prania własnym transportem w promieniu 50 km.",
      img: "images/logo-kwadrat.jpg",
      phone: "tel:+48730064044",
      phoneDisplay: "+48 730 064 044",
      email: "mailto:pralnia@radlight.pl",
      emailDisplay: "pralnia@radlight.pl",
      link: "pralnia.html",
      linkTarget: "pralnia.html",
      linkText: "pralnia.html",
      category: "PRALNIA PRZEMYSŁOWA",
      tag: "PARK PRALNICZY"
    },
    {
      index: 4,
      title: "Usługi sprzątające",
      sub: "",
      desc: "Doświadczony zespół, profesjonalny sprzęt Kärcher i ekologiczne środki czystości. Sprzątanie cykliczne, poremontowe, mycie okien oraz doczyszczanie jachtów.",
      img: "images/modern-office-2025-02-22-16-24-55-utc-2048x1365.jpg",
      phone: "tel:+48730067027",
      phoneDisplay: "+48 730 067 027",
      email: "mailto:sprzatanie@radlight.pl",
      emailDisplay: "sprzatanie@radlight.pl",
      link: "sprzatanie.html",
      linkTarget: "sprzatanie.html",
      linkText: "sprzatanie.html",
      category: "USŁUGI PORZĄDKOWE",
      tag: "SERWIS CZYSTOŚCI"
    },
    {
      index: 5,
      title: "Hale, magazyny & lokale",
      sub: "",
      desc: "Nowoczesne hale produkcyjno-magazynowe, boksy samoobsługowe self-storage, powierzchnie użytkowe i komercyjne oraz place składowe w Giżycku. Monitoring 24/7, dostęp PIN i dojazd TIR.",
      img: "images/DJI_0121small-1536x1171.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:magazyny@radlight.pl",
      emailDisplay: "magazyny@radlight.pl",
      link: "magazyny.html",
      linkTarget: "magazyny.html",
      linkText: "magazyny.html",
      category: "MAGAZYNY & PLACE",
      tag: "HALE & MAGAZYNY"
    },
    {
      index: 6,
      title: "Helipad Mazury",
      sub: "",
      desc: "Certyfikowane lądowisko dla śmigłowców w Giżycku. Oświetlenie nawigacyjne do lotów nocnych, hangarowanie, tankowanie oraz transfery VIP i medyczne LPR.",
      img: "images/512X512-heli.png",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:helipad@radlight.pl",
      emailDisplay: "helipad@radlight.pl",
      link: "helipad.html",
      linkTarget: "helipad.html",
      linkText: "helipad.html",
      category: "LOTNICTWO",
      tag: "LĄDOWISKO HELI"
    },
    {
      index: 7,
      title: "Zimowanie jachtów",
      sub: "",
      desc: "Całoroczne bezpieczne zimowanie łodzi w ogrzewanej hali lub na strzeżonym placu. Slipowanie dźwigiem, mycie dna, serwis silników oraz czarter jachtu motorowego Stillo 30.",
      img: "images/LOGO-ALL-BOAT.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:zimowanie@radlight.pl",
      emailDisplay: "zimowanie@radlight.pl",
      link: "zimowanie-jachtow.html",
      linkTarget: "zimowanie-jachtow.html",
      linkText: "zimowanie-jachtow.html",
      category: "SEKTOR MORSKI",
      tag: "ZIMOWANIE & CZARTER"
    }
  ];

  // 9 Services for Mobile (1:1 with radlight.pl)
  const mobileServicesData = [
    {
      index: 0,
      title: "Poznaj Radlight",
      sub: "",
      desc: "Centralna baza usług w Giżycku. Łączymy luksusowe apartamenty, pralnię przemysłową, obsługę najmu, magazyny self-storage, helipad oraz marinę z zimowaniem jachtów w Giżycku.",
      img: "images/radlight-r-symbol.png",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "o-nas.html"
    },
    {
      index: 1,
      title: "Apartamenty",
      sub: "",
      desc: "Luksusowy wynajem całorocznych apartamentów, domków letniskowych i pokoi w centrum Giżycka.",
      img: "images/stranda_hero_jacuzzi.webp",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:rezerwacje@mazury.holiday",
      emailDisplay: "rezerwacje@mazury.holiday",
      link: "apartamenty.html"
    },
    {
      index: 2,
      title: "Zarządzanie najmem",
      sub: "",
      desc: "Kompleksowa opieka nad apartamentem: marketing na Booking i Airbnb, meldunek gości kodem PIN.",
      img: "images/103761_7.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "zarzadzanie-najmem.html"
    },
    {
      index: 3,
      title: "Własna pralnia",
      sub: "",
      desc: "Nowoczesny park pralniczy dla hoteli, pensjonatów, jachtów i restauracji w Giżycku.",
      img: "images/work-in-laundry-2025-03-17-04-27-23-utc-1536x1024.jpg",
      phone: "tel:+48730064044",
      phoneDisplay: "+48 730 064 044",
      email: "mailto:biuro@pralniagizycko.pl",
      emailDisplay: "biuro@pralniagizycko.pl",
      link: "pralnia.html"
    },
    {
      index: 4,
      title: "Profesjonalne usługi sprzątające",
      sub: "",
      desc: "Doświadczony zespół, profesjonalny sprzęt Kärcher i ekologiczne środki czystości.",
      img: "images/modern-office-2025-02-22-16-24-55-utc-2048x1365.jpg",
      phone: "tel:+48730067027",
      phoneDisplay: "+48 730 067 027",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "sprzatanie.html"
    },
    {
      index: 5,
      title: "Powierzchnie usługowo magazynowe",
      sub: "",
      desc: "Nowoczesne hale produkcyjno-magazynowe, boksy samoobsługowe self-storage i place składowe.",
      img: "images/hala_1.webp",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "magazyny.html"
    },
    {
      index: 6,
      title: "Lądowisko dla śmigłowców",
      sub: "",
      desc: "Certyfikowane lądowisko dla śmigłowców w Giżycku z pełnym oświetleniem nawigacyjnym.",
      img: "images/air-rescue-service-1536x1024.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@helipadmazury.pl",
      emailDisplay: "biuro@helipadmazury.pl",
      link: "helipad.html"
    },
    {
      index: 7,
      title: "Czarter Stillo30 VIP",
      sub: "",
      desc: "Luksusowy czarter nowoczesnych jednostek motorowych typu Houseboat bez patentu po Szlaku Wielkich Jezior Mazurskich.",
      img: "images/hero-yard-evening-v3.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "czarter.html"
    },
    {
      index: 8,
      title: "Zimowanie łodzi",
      sub: "",
      desc: "Całoroczne bezpieczne zimowanie łodzi w ogrzewanej hali lub na strzeżonym placu.",
      img: "images/DJI_0101-1536x864.jpg",
      phone: "tel:+48607241090",
      phoneDisplay: "+48 607 241 090",
      email: "mailto:biuro@radlight.pl",
      emailDisplay: "biuro@radlight.pl",
      link: "zimowanie-jachtow.html"
    }
  ];

  // Default servicesData reference
  let servicesData = desktopServicesData;

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

  // Position nodes radially on the orbit ring (perfectly aligned with SVG concentric tracks)
  function positionNodes() {
    const isMobile = window.innerWidth <= 768;
    const currentNodes = isMobile 
      ? document.querySelectorAll('.wheel-node')
      : document.querySelectorAll('.wheel-node:not(.wheel-node-mobile-only)');
    
    if (!wheelContainer || currentNodes.length === 0) return;
    const total = currentNodes.length;
    const containerW = wheelContainer.offsetWidth || (isMobile ? 350 : 760);
    // Exact mathematical alignment with SVG orbit rings (r=308 outer, r=262 inner, center = 285 in 760 viewBox)
    const radius = Math.round(containerW * (285 / 760));

    currentNodes.forEach((node, i) => {
      const angle = ((i * (360 / total)) - 90) * (Math.PI / 180);
      const x = Math.round(radius * Math.cos(angle));
      const y = Math.round(radius * Math.sin(angle));
      node.style.left = '50%';
      node.style.top = '50%';
      node.style.position = 'absolute';
      node.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // Update Center Hub with smooth animation & multi-language support
  function updateShowcase(index) {
    const isMobile = window.innerWidth <= 768;
    const sData = isMobile ? mobileServicesData : desktopServicesData;
    const data = sData[index] || sData[0];
    if (!data) return;

    let langData = null;
    if (typeof translations !== 'undefined' && translations[currentLang]) {
      if (isMobile && translations[currentLang].servicesWheelMobile) {
        langData = translations[currentLang].servicesWheelMobile[index];
      } else if (translations[currentLang].servicesWheel) {
        langData = translations[currentLang].servicesWheel[index];
      }
    }

    const displayTitle = langData ? langData.title : data.title;
    const displaySub = langData ? langData.sub : data.sub;

    const hubInner = document.getElementById('hub-inner-core');
    if (hubInner && isMobile) {
      hubInner.classList.remove('animate-in');
      void hubInner.offsetWidth;
      hubInner.classList.add('animate-in');
    }

    // Update Center Hub
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
      hubAvatarImg.src = isMobile 
        ? (index === 0 ? 'images/na-strone-Radlight.pl-Logo-pomarancz-czarny.png' : data.img)
        : (index === 0 ? 'images/radlight-r-symbol.png' : data.img);
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
      if (isMobile && index === 0) {
        hubCtaLink.style.display = 'none';
      } else {
        hubCtaLink.style.display = 'inline-flex';
      }
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

    // Highlight Active Node
    const currentNodes = isMobile 
      ? document.querySelectorAll('.wheel-node')
      : document.querySelectorAll('.wheel-node:not(.wheel-node-mobile-only)');

    currentNodes.forEach((n, idx) => {
      n.classList.toggle('active', idx === index);
      let nodeLang = null;
      if (typeof translations !== 'undefined' && translations[currentLang]) {
        if (isMobile && translations[currentLang].servicesWheelMobile) {
          nodeLang = translations[currentLang].servicesWheelMobile[idx];
        } else if (translations[currentLang].servicesWheel) {
          nodeLang = translations[currentLang].servicesWheel[idx];
        }
      }
      if (nodeLang) {
        if (nodeLang.tooltip) n.setAttribute('title', nodeLang.tooltip);
        if (nodeLang.title) n.setAttribute('aria-label', nodeLang.title);
      }
    });
  }

  function setActiveIndex(newIndex) {
    const isMobile = window.innerWidth <= 768;
    const total = isMobile ? 9 : 8;
    activeIndex = (newIndex + total) % total;

    if (!isMobile) {
      // Desktop: rotate orbit & counter-rotate icons
      const rotationAngle = -activeIndex * (360 / total);
      if (wheelOrbit) {
        wheelOrbit.style.transform = `rotate(${rotationAngle}deg)`;
      }

      const currentNodes = document.querySelectorAll('.wheel-node:not(.wheel-node-mobile-only)');
      currentNodes.forEach((n) => {
        const innerBox = n.querySelector('.node-icon-box');
        if (innerBox) {
          innerBox.style.setProperty('--counter-rotation', `${-rotationAngle}deg`);
        }
      });
    } else {
      // Mobile: fixed orbit
      if (wheelOrbit) {
        wheelOrbit.style.transform = 'none';
      }
    }

    updateShowcase(activeIndex);
  }

  function startAutoRotate() {
    stopAutoRotate();
    if (window.innerWidth > 768) {
      autoRotateTimer = setInterval(() => {
        setActiveIndex(activeIndex + 1);
      }, 6000);
    }
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  // Node Click Handlers
  nodes = document.querySelectorAll('.wheel-node');
  nodes.forEach((node) => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoRotate();

      const i = parseInt(node.getAttribute('data-index'), 10);
      const isMobile = window.innerWidth <= 768;

      if (activeIndex === i) {
        // Click on already active node -> navigate to subpage or scroll to target
        const data = isMobile ? mobileServicesData[i] : desktopServicesData[i];
        if (data && data.link) {
          if (data.link.startsWith('#')) {
            scrollToTargetCard(data.link);
          } else if (data.link.startsWith('http')) {
            window.open(data.link, '_blank');
          } else {
            window.location.href = data.link;
          }
        }
      } else {
        setActiveIndex(i);
        if (!isMobile) startAutoRotate();
      }
    });
  });

  // Center Hub Click Handler (navigates to service subpage on mobile & desktop)
  if (centerHub) {
    centerHub.addEventListener('click', (e) => {
      // If clicking phone or email direct action buttons, allow normal action
      if (e.target.closest('.hub-action-btn, #hub-phone-btn, #hub-mail-btn, #hub-contact-email')) {
        stopAutoRotate();
        return;
      }
      e.preventDefault();
      stopAutoRotate();

      const isMobile = window.innerWidth <= 768;
      const data = isMobile ? mobileServicesData[activeIndex] : desktopServicesData[activeIndex];
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

    const isMobile = window.innerWidth <= 768;

    // If inside services catalog, ensure all filter is active
    if (targetEl.classList.contains('service-card')) {
      const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allFilterBtn) allFilterBtn.click();
    }

    let offsetPosition;
    if (isMobile) {
      if (cleanId === 'uslugi') {
        // Scroll so that the "Zakres działalności" section starts directly at the top of the mobile screen
        const headerEl = targetEl.querySelector('.section-header') || targetEl;
        const elementPosition = headerEl.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.pageYOffset - 12;
      } else {
        const elementPosition = targetEl.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.pageYOffset - 10;
      }
    } else {
      const headerHeight = document.querySelector('.main-header')?.offsetHeight || 75;
      const extraMargin = 25;
      const headerOffset = headerHeight + extraMargin;
      const elementPosition = targetEl.getBoundingClientRect().top;
      offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    }

    window.scrollTo({
      top: Math.max(0, offsetPosition),
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

  // ==========================================================================
  // 10. RADLIGHT MASTER IMAGE LIGHTBOX & ZOOM ENGINE (PC & MOBILE)
  // ==========================================================================

  class RadlightLightbox {
    constructor() {
      this.isOpen = false;
      this.currentIndex = 0;
      this.images = [];
      this.scale = 1;
      this.minScale = 1;
      this.maxScale = 4.0;
      this.translateX = 0;
      this.translateY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.lastTranslateX = 0;
      this.lastTranslateY = 0;

      // Mobile Touch Gesture state
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchDistanceStart = 0;
      this.initialScaleOnPinch = 1;
      this.lastTapTime = 0;
      this.isPinching = false;

      this.initDom();
      this.collectImages();
      this.bindEvents();
    }

    initDom() {
      let lb = document.getElementById('rad-lightbox');
      if (!lb) {
        const lbHtml = `
          <div id="rad-lightbox" class="rad-lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Podgląd zdjęcia">
            <!-- Top Header Bar -->
            <div class="rad-lightbox-header">
              <div class="rad-lightbox-info">
                <span class="rad-lightbox-counter" id="rad-lightbox-counter">1 / 1</span>
                <span class="rad-lightbox-zoom-badge" id="rad-lightbox-zoom-badge">100%</span>
              </div>
              <div class="rad-lightbox-actions">
                <button type="button" class="rad-lightbox-btn" id="rad-lb-zoom-out" aria-label="Pomniejsz" title="Pomniejsz (-)">
                  <i class="fa-solid fa-magnifying-glass-minus"></i>
                </button>
                <button type="button" class="rad-lightbox-btn" id="rad-lb-zoom-reset" aria-label="Dopasuj rozmiar" title="Dopasuj (0)">
                  <i class="fa-solid fa-arrows-rotate"></i>
                </button>
                <button type="button" class="rad-lightbox-btn" id="rad-lb-zoom-in" aria-label="Powiększ" title="Powiększ (+)">
                  <i class="fa-solid fa-magnifying-glass-plus"></i>
                </button>
                <button type="button" class="rad-lightbox-btn rad-lightbox-btn-close" id="rad-lb-close" aria-label="Zamknij podgląd" title="Zamknij (Esc)">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <!-- Main Viewport / Stage -->
            <div class="rad-lightbox-viewport" id="rad-lightbox-viewport">
              <button type="button" class="rad-lightbox-nav rad-lightbox-prev" id="rad-lb-prev" aria-label="Poprzednie zdjęcie" title="Poprzednie (←)">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              
              <div class="rad-lightbox-stage" id="rad-lightbox-stage">
                <img src="" alt="" class="rad-lightbox-img" id="rad-lightbox-img" draggable="false">
                <div class="rad-lightbox-spinner" id="rad-lightbox-spinner">
                  <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
              </div>

              <button type="button" class="rad-lightbox-nav rad-lightbox-next" id="rad-lb-next" aria-label="Następne zdjęcie" title="Następne (→)">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <!-- Bottom Caption Bar -->
            <div class="rad-lightbox-footer">
              <div class="rad-lightbox-caption" id="rad-lightbox-caption"></div>
              <div class="rad-lightbox-hints">
                <span class="desktop-hint"><kbd>Esc</kbd> Zamknij &bull; <kbd>←</kbd><kbd>→</kbd> Zmień &bull; Scroll / 2x klik: Zoom &bull; Przeciągnij: Przesuń</span>
                <span class="mobile-hint">Dotknij 2x aby powiększyć &bull; Przesuń w dół aby zamknąć</span>
              </div>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lbHtml);
      }

      this.dom = {
        lightbox: document.getElementById('rad-lightbox'),
        viewport: document.getElementById('rad-lightbox-viewport'),
        stage: document.getElementById('rad-lightbox-stage'),
        img: document.getElementById('rad-lightbox-img'),
        spinner: document.getElementById('rad-lightbox-spinner'),
        counter: document.getElementById('rad-lightbox-counter'),
        zoomBadge: document.getElementById('rad-lightbox-zoom-badge'),
        caption: document.getElementById('rad-lightbox-caption'),
        btnClose: document.getElementById('rad-lb-close'),
        btnZoomIn: document.getElementById('rad-lb-zoom-in'),
        btnZoomOut: document.getElementById('rad-lb-zoom-out'),
        btnZoomReset: document.getElementById('rad-lb-zoom-reset'),
        btnPrev: document.getElementById('rad-lb-prev'),
        btnNext: document.getElementById('rad-lb-next'),
      };
    }

    collectImages() {
      const allImgs = Array.from(document.querySelectorAll('img'));
      this.images = [];

      allImgs.forEach(img => {
        // Strictly exclude lightbox's own image, UI logos, wheel nodes, center hub avatar, mobile dock R button, flags, and watermarks
        if (
          img.id === 'logo-img' ||
          img.id === 'hub-avatar-img' ||
          img.id === 'rad-lightbox-img' ||
          img.closest('.rad-lightbox') ||
          img.closest('#rad-lightbox') ||
          img.closest('.logo') ||
          img.closest('.nav-logo') ||
          img.closest('.brand-logo-main') ||
          img.closest('.mobile-nav-dock') ||
          img.closest('.dock-center-r-btn') ||
          img.closest('.dock-logo-disc') ||
          img.closest('.dock-item') ||
          img.closest('.footer-watermark') ||
          img.closest('.footer-logo') ||
          img.closest('.wheel-node') ||
          img.closest('.wheel-container') ||
          img.closest('.wheel-hero-section') ||
          img.closest('.hero-wheel-section') ||
          img.closest('.wheel-center-hub') ||
          img.closest('.hub-avatar') ||
          img.closest('.hub-avatar-circle') ||
          img.closest('.hub-inner-core') ||
          img.closest('.top-bar') ||
          img.closest('.lang-switcher') ||
          img.classList.contains('footer-watermark') ||
          img.classList.contains('flag-icon') ||
          img.classList.contains('hub-avatar-img') ||
          img.classList.contains('rad-lightbox-img') ||
          !img.getAttribute('src') ||
          img.getAttribute('src').trim() === '' ||
          img.hasAttribute('data-no-zoom')
        ) {
          return;
        }

        // Get descriptive caption
        let caption = img.getAttribute('data-caption') || img.getAttribute('alt') || img.getAttribute('title') || '';
        if (!caption || caption.trim().length === 0) {
          const card = img.closest('.service-card, .subpage-block, .subpage-feat-card, .article-card, .eu-card, .about-content, .subpage-hero-card');
          if (card) {
            const heading = card.querySelector('h1, h2, h3, h4, .service-title, .subpage-title, .block-sub');
            if (heading) caption = heading.textContent.trim();
          }
        }
        if (!caption) caption = 'Zdjęcie Radlight Giżycko';

        img.classList.add('rad-zoomable-img');
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('title', 'Kliknij, aby powiększyć');

        const index = this.images.length;
        this.images.push({
          src: img.getAttribute('src') || img.src,
          alt: img.getAttribute('alt') || '',
          caption: caption,
          element: img
        });

        // Click & keyboard handlers
        img.addEventListener('click', (e) => {
          e.preventDefault();
          this.open(index);
        });

        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.open(index);
          }
        });
      });
    }

    open(index) {
      if (index < 0 || index >= this.images.length) return;
      this.currentIndex = index;
      this.isOpen = true;
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;

      this.dom.lightbox.classList.add('active');
      this.dom.lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('rad-lightbox-open');

      this.loadImage(this.currentIndex);
      this.updateTransform();
      this.updateNavButtons();
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.dom.lightbox.classList.remove('active');
      this.dom.lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('rad-lightbox-open');

      setTimeout(() => {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
      }, 300);
    }

    loadImage(index) {
      const item = this.images[index];
      if (!item) return;

      this.dom.spinner.classList.add('active');
      this.dom.counter.textContent = `${index + 1} / ${this.images.length}`;
      this.dom.caption.textContent = item.caption;

      const tempImg = new Image();
      tempImg.src = item.src;
      tempImg.onload = () => {
        this.dom.img.src = item.src;
        this.dom.img.alt = item.alt;
        this.dom.spinner.classList.remove('active');
      };
      tempImg.onerror = () => {
        this.dom.img.src = item.src;
        this.dom.spinner.classList.remove('active');
      };

      // Reset zoom on slide transition
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.updateTransform();
      this.updateNavButtons();
    }

    next() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
      this.loadImage(this.currentIndex);
    }

    prev() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.images.length - 1;
      }
      this.loadImage(this.currentIndex);
    }

    updateNavButtons() {
      if (this.images.length <= 1) {
        this.dom.btnPrev.classList.add('hidden');
        this.dom.btnNext.classList.add('hidden');
      } else {
        this.dom.btnPrev.classList.remove('hidden');
        this.dom.btnNext.classList.remove('hidden');
      }
    }

    setZoom(newScale, originX = 0, originY = 0) {
      const prevScale = this.scale;
      this.scale = Math.min(Math.max(newScale, this.minScale), this.maxScale);

      if (this.scale === 1) {
        this.translateX = 0;
        this.translateY = 0;
        this.dom.stage.classList.remove('is-zoomed');
      } else {
        this.dom.stage.classList.add('is-zoomed');
        if (originX !== 0 || originY !== 0) {
          const factor = (this.scale - prevScale) / prevScale;
          this.translateX -= originX * factor * 0.5;
          this.translateY -= originY * factor * 0.5;
        }
      }

      this.clampBounds();
      this.updateTransform();
    }

    clampBounds() {
      if (this.scale <= 1) {
        this.translateX = 0;
        this.translateY = 0;
        return;
      }
      const rect = this.dom.img.getBoundingClientRect();
      const maxDragX = (rect.width * this.scale - window.innerWidth) / 2 + 100;
      const maxDragY = (rect.height * this.scale - window.innerHeight) / 2 + 100;
      if (maxDragX > 0) {
        this.translateX = Math.min(Math.max(this.translateX, -maxDragX), maxDragX);
      } else {
        this.translateX = 0;
      }
      if (maxDragY > 0) {
        this.translateY = Math.min(Math.max(this.translateY, -maxDragY), maxDragY);
      } else {
        this.translateY = 0;
      }
    }

    updateTransform() {
      this.dom.img.style.transform = `translate3d(${this.translateX}px, ${this.translateY}px, 0px) scale(${this.scale})`;
      this.dom.zoomBadge.textContent = `${Math.round(this.scale * 100)}%`;
    }

    bindEvents() {
      // Close button
      this.dom.btnClose.addEventListener('click', () => this.close());

      // Zoom In / Out / Reset buttons
      this.dom.btnZoomIn.addEventListener('click', () => this.setZoom(this.scale + 0.5));
      this.dom.btnZoomOut.addEventListener('click', () => this.setZoom(this.scale - 0.5));
      this.dom.btnZoomReset.addEventListener('click', () => this.setZoom(1));

      // Next / Prev buttons
      this.dom.btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
      this.dom.btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });

      // Backdrop click to close (clicking empty stage/viewport outside img)
      this.dom.viewport.addEventListener('click', (e) => {
        if (e.target === this.dom.viewport || e.target === this.dom.stage) {
          if (!this.isDragging && !this.isPinching) {
            this.close();
          }
        }
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        if (e.key === 'Escape') {
          this.close();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          this.next();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          this.prev();
        } else if (e.key === '+' || e.key === '=') {
          this.setZoom(this.scale + 0.35);
        } else if (e.key === '-' || e.key === '_') {
          this.setZoom(this.scale - 0.35);
        } else if (e.key === '0') {
          this.setZoom(1);
        }
      });

      // Mouse Wheel Zoom
      this.dom.viewport.addEventListener('wheel', (e) => {
        if (!this.isOpen) return;
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.25 : -0.25;
        this.setZoom(this.scale + delta, e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2);
      }, { passive: false });

      // Double click on image toggles zoom
      this.dom.img.addEventListener('dblclick', (e) => {
        e.preventDefault();
        if (this.scale > 1) {
          this.setZoom(1);
        } else {
          this.setZoom(2.2, e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2);
        }
      });

      // Mouse Drag / Pan when zoomed
      this.dom.img.addEventListener('mousedown', (e) => {
        if (!this.isOpen || this.scale <= 1) return;
        e.preventDefault();
        this.isDragging = true;
        this.dom.stage.classList.add('is-dragging');
        this.dragStartX = e.clientX - this.translateX;
        this.dragStartY = e.clientY - this.translateY;
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        e.preventDefault();
        this.translateX = e.clientX - this.dragStartX;
        this.translateY = e.clientY - this.dragStartY;
        this.clampBounds();
        this.updateTransform();
      });

      window.addEventListener('mouseup', () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.dom.stage.classList.remove('is-dragging');
        }
      });

      // Touch Events for Mobile (Swipe, Drag, Pinch, Double Tap)
      this.dom.viewport.addEventListener('touchstart', (e) => {
        if (!this.isOpen) return;
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          this.touchStartX = touch.clientX;
          this.touchStartY = touch.clientY;
          this.lastTranslateX = this.translateX;
          this.lastTranslateY = this.translateY;
          this.isDragging = this.scale > 1;

          // Double tap detection (< 300ms)
          const now = Date.now();
          if (now - this.lastTapTime < 300) {
            e.preventDefault();
            if (this.scale > 1) {
              this.setZoom(1);
            } else {
              this.setZoom(2.2, touch.clientX - window.innerWidth / 2, touch.clientY - window.innerHeight / 2);
            }
          }
          this.lastTapTime = now;
        } else if (e.touches.length === 2) {
          // Pinch start
          this.isPinching = true;
          this.dom.stage.classList.add('is-pinching');
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          this.touchDistanceStart = Math.hypot(dx, dy);
          this.initialScaleOnPinch = this.scale;
        }
      }, { passive: false });

      this.dom.viewport.addEventListener('touchmove', (e) => {
        if (!this.isOpen) return;
        e.preventDefault();

        if (this.isPinching && e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const currentDistance = Math.hypot(dx, dy);
          if (this.touchDistanceStart > 0) {
            const factor = currentDistance / this.touchDistanceStart;
            this.setZoom(this.initialScaleOnPinch * factor);
          }
        } else if (e.touches.length === 1) {
          const touch = e.touches[0];
          const diffX = touch.clientX - this.touchStartX;
          const diffY = touch.clientY - this.touchStartY;

          if (this.scale > 1) {
            // Pan zoomed image
            this.translateX = this.lastTranslateX + diffX;
            this.translateY = this.lastTranslateY + diffY;
            this.clampBounds();
            this.updateTransform();
          } else {
            // Pull down effect when swiping to dismiss
            if (Math.abs(diffY) > 20 && Math.abs(diffY) > Math.abs(diffX)) {
              this.dom.img.style.transform = `translate3d(0px, ${diffY * 0.65}px, 0px) scale(${1 - Math.min(Math.abs(diffY) / 1200, 0.2)})`;
            }
          }
        }
      }, { passive: false });

      this.dom.viewport.addEventListener('touchend', (e) => {
        if (!this.isOpen) return;
        if (this.isPinching) {
          this.isPinching = false;
          this.dom.stage.classList.remove('is-pinching');
          if (this.scale < 1) this.setZoom(1);
          return;
        }

        if (this.scale > 1) {
          this.isDragging = false;
        } else if (e.changedTouches.length === 1) {
          const touch = e.changedTouches[0];
          const diffX = touch.clientX - this.touchStartX;
          const diffY = touch.clientY - this.touchStartY;

          // 1. Swipe down or up to dismiss (delta > 70px)
          if (Math.abs(diffY) > 70 && Math.abs(diffY) > Math.abs(diffX) * 1.4) {
            this.close();
            return;
          }

          // 2. Horizontal swipe to navigate (delta > 45px)
          if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
            if (diffX < 0) {
              this.next();
            } else {
              this.prev();
            }
            return;
          }

          // Reset position if swipe wasn't far enough
          this.updateTransform();
        }
      });
    }
  }

  // Instantiate and expose globally
  const radlightLightbox = new RadlightLightbox();
  window.radlightLightbox = radlightLightbox;

});

