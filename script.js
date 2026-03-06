// Abitalia Landing — interactions (elegant light)
(() => {
  // Topbar shadow on scroll
  const topbar = document.querySelector('.topbar');
  const onScroll = () => {
    if (!topbar) return;
    topbar.classList.toggle('topbar--scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Theme mode (dark/light)
  const rootBody = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const savedTheme = localStorage.getItem('abitalia-theme');
  if (savedTheme) rootBody.setAttribute('data-theme', savedTheme);

  const syncThemeIcon = () => {
    const isDark = rootBody.getAttribute('data-theme') === 'dark';
    const icon = isDark ? '☀️' : '🌙';
    if (themeToggle) themeToggle.textContent = icon;
    if (themeToggleMobile) themeToggleMobile.textContent = `${icon} Cambiar tema`;
  };
  const toggleTheme = () => {
    const next = rootBody.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    rootBody.setAttribute('data-theme', next);
    localStorage.setItem('abitalia-theme', next);
    syncThemeIcon();
  };
  themeToggle?.addEventListener('click', toggleTheme);
  themeToggleMobile?.addEventListener('click', toggleTheme);
  if (!rootBody.getAttribute('data-theme')) rootBody.setAttribute('data-theme', 'light');
  syncThemeIcon();

  // Loader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    window.setTimeout(() => preloader.remove(), 500);
  });

  // Scroll to top
  const scrollTopBtn = document.getElementById('scrollTop');
  const syncScrollTop = () => {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('is-visible', window.scrollY > 260);
  };
  window.addEventListener('scroll', syncScrollTop, { passive: true });
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  syncScrollTop();


  // Mobile nav (dropdown) — only on mobile
  const burger = document.querySelector('.burger');
  const mobile = document.querySelector('.mobile');

  const setBurgerX = (isOpen) => {
    const spans = burger ? burger.querySelectorAll('span') : [];
    if (!spans.length) return;
    spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  };

  if (burger && mobile) {
    const close = () => {
      burger.setAttribute('aria-expanded', 'false');
      mobile.hidden = true;
      setBurgerX(false);
    };

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      mobile.hidden = expanded;
      setBurgerX(!expanded);
    });

    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    document.addEventListener('click', (e) => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      if (!open) return;
      if (!mobile.contains(e.target) && !burger.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // Reveal on scroll
  const els = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));

  // Accordion
  const acc = document.querySelector('[data-accordion]');
  if (acc) {
    const items = Array.from(acc.querySelectorAll('.acc-item'));
    items.forEach((btn) => {
      const panel = btn.nextElementSibling;
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        items.forEach(b => {
          b.setAttribute('aria-expanded','false');
          const p = b.nextElementSibling;
          if (p) p.style.display = 'none';
          const ic = b.querySelector('.acc-icon');
          if (ic) ic.textContent = '+';
        });
        btn.setAttribute('aria-expanded', String(!isOpen));
        if (panel) panel.style.display = isOpen ? 'none' : 'block';
        const icon = btn.querySelector('.acc-icon');
        if (icon) icon.textContent = isOpen ? '+' : '–';
      });
    });
  }



  // Ensure autoplay videos keep playing on mobile browsers
  const videos = Array.from(document.querySelectorAll('video[autoplay]'));
  const safePlay = (video) => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
  };
  videos.forEach((video) => {
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    safePlay(video);
    video.addEventListener('canplay', () => safePlay(video), { once: true });
  });

  // Subtle background movement for a more dynamic feel
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const onMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
    if (orb2) orb2.style.transform = `translate(${-x}px, ${-y}px)`;
  };
  window.addEventListener('pointermove', onMove, { passive: true });


  // Gallery slider
  const slider = document.querySelector('[data-gallery-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.gallery-slide'));
    const dotsWrap = slider.querySelector('[data-gallery-dots]');
    const prev = slider.querySelector('[data-gallery-prev]');
    const next = slider.querySelector('[data-gallery-next]');
    let idx = 0;
    let timer;

    const render = (nextIndex) => {
      idx = (nextIndex + slides.length) % slides.length;
      slides.forEach((el, i) => el.classList.toggle('is-active', i === idx));
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.gallery-dot').forEach((dot, i) => {
          dot.classList.toggle('is-active', i === idx);
          dot.setAttribute('aria-current', i === idx ? 'true' : 'false');
        });
      }
    };

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'gallery-dot';
        dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        dot.addEventListener('click', () => {
          render(i);
          resetAuto();
        });
        dotsWrap.appendChild(dot);
      });
    }

    const resetAuto = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => render(idx + 1), 5000);
    };

    prev?.addEventListener('click', () => { render(idx - 1); resetAuto(); });
    next?.addEventListener('click', () => { render(idx + 1); resetAuto(); });

    slider.addEventListener('pointerenter', () => window.clearInterval(timer));
    slider.addEventListener('pointerleave', resetAuto);

    render(0);
    resetAuto();
  }


  // Industries manual slider (no autoplay)
  const industriesSlider = document.querySelector('[data-industries-slider]');
  if (industriesSlider) {
    const track = industriesSlider.querySelector('[data-industries-track]');
    const prevBtn = industriesSlider.querySelector('[data-industry-prev]');
    const nextBtn = industriesSlider.querySelector('[data-industry-next]');
    const slideBy = () => Math.max(260, Math.round((track?.clientWidth || 320) * 0.62));

    prevBtn?.addEventListener('click', () => {
      track?.scrollBy({ left: -slideBy(), behavior: 'smooth' });
    });
    nextBtn?.addEventListener('click', () => {
      track?.scrollBy({ left: slideBy(), behavior: 'smooth' });
    });
  }

  // Testimonials carousel (3 cards + auto scroll)
  const testimonials = document.querySelector('[data-testimonials-slider]');
  if (testimonials) {
    const cards = Array.from(testimonials.querySelectorAll('.quote'));
    let start = 0;
    let timer;

    const visibleCount = () => (window.innerWidth <= 980 ? 1 : 3);

    const render = () => {
      const count = visibleCount();
      cards.forEach((card, i) => {
        const visible = ((i - start + cards.length) % cards.length) < count;
        card.classList.toggle('is-visible', visible);
      });
    };

    const next = () => {
      start = (start + 1) % cards.length;
      render();
    };

    const resetAuto = () => {
      window.clearInterval(timer);
      timer = window.setInterval(next, 4200);
    };

    window.addEventListener('resize', render);
    testimonials.addEventListener('pointerenter', () => window.clearInterval(timer));
    testimonials.addEventListener('pointerleave', resetAuto);

    render();
    resetAuto();
  }


  // Scroll-driven section animations/parallax
  const sections = Array.from(document.querySelectorAll('.section'));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-in-view');
    });
  }, { threshold: 0.2 });
  sections.forEach((section) => sectionObserver.observe(section));

  const vectorSections = Array.from(document.querySelectorAll('.section--vector'));
  const onPageScroll = () => {
    vectorSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(-1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      section.style.setProperty('--vector-shift', `${(ratio * 16).toFixed(2)}px`);
    });
  };
  window.addEventListener('scroll', onPageScroll, { passive: true });
  onPageScroll();

  // Form (frontend success message only)
  const form = document.getElementById('leadForm');
  const success = document.getElementById('success');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (success) success.hidden = false;
      form.querySelectorAll('input,textarea,button').forEach(el => el.disabled = true);
    });
  }
})();
