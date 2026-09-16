// Custom Select Dropdown
(function () {
  var select = document.getElementById('customSelect');
  if (!select) return;

  var trigger = select.querySelector('.custom-select__trigger');
  var valueEl = select.querySelector('.custom-select__value');
  var hidden = select.querySelector('input[type="hidden"]');
  var options = select.querySelectorAll('.custom-select__option');

  trigger.addEventListener('click', function () {
    select.classList.toggle('open');
  });

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      var val = opt.getAttribute('data-value');
      valueEl.textContent = val;
      hidden.value = val;
      options.forEach(function (o) { o.classList.remove('custom-select__option--active'); });
      opt.classList.add('custom-select__option--active');
      select.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!select.contains(e.target)) {
      select.classList.remove('open');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') select.classList.remove('open');
  });
})();

// Contact Form Validation
(function () {
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (!form) return;

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field) {
    var input = field.querySelector('.contact-form__input');
    if (!input || !input.hasAttribute('required')) return true;

    var value = input.value.trim();
    var valid = true;

    if (input.type === 'email') {
      valid = emailRegex.test(value);
    } else if (input.tagName === 'TEXTAREA') {
      valid = value.length >= 10;
    } else {
      valid = value.length > 0;
    }

    field.classList.toggle('contact-form__field--error', !valid);
    input.classList.toggle('contact-form__input--valid', valid && value.length > 0);
    return valid;
  }

  // Live validation on blur
  form.querySelectorAll('.contact-form__input').forEach(function (input) {
    input.addEventListener('blur', function () {
      validateField(input.closest('.contact-form__field'));
    });
    // Clear error on input
    input.addEventListener('input', function () {
      var field = input.closest('.contact-form__field');
      if (field.classList.contains('contact-form__field--error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = form.querySelectorAll('.contact-form__field');
    var allValid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) {
        allValid = false;
      }
    });

    if (!allValid) {
      // Focus first error field
      var firstError = form.querySelector('.contact-form__field--error .contact-form__input');
      if (firstError) firstError.focus();
      return;
    }

    // Success
    form.style.display = 'none';
    success.classList.add('visible');
  });
})();

// Article Grid Filter
(function () {
  var filterRow = document.getElementById('filterRow');
  var grid = document.getElementById('articleGrid');
  if (!filterRow || !grid) return;

  var chips = filterRow.querySelectorAll('.chip');
  var cards = grid.querySelectorAll('.card');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');

      // Update active chip & aria-pressed
      chips.forEach(function (c) {
        c.classList.remove('chip--active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('chip--active');
      chip.setAttribute('aria-pressed', 'true');

      // Filter cards
      var visibleIndex = 0;
      cards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        var show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('card--hidden');
          card.style.transitionDelay = (visibleIndex * 0.04) + 's';
          visibleIndex++;
        } else {
          card.classList.add('card--hidden');
          card.style.transitionDelay = '0s';
        }
      });

      // Announce result count to screen readers
      var liveRegion = document.getElementById('filterLive');
      if (liveRegion) {
        var label = filter === 'all' ? 'Vše' : chip.textContent;
        liveRegion.textContent = 'Zobrazeno ' + visibleIndex + ' článků pro kategorii „' + label + '"';
      }
    });
  });
})();

// Header scroll — transparent to solid on homepage
(function () {
  var header = document.getElementById('mainHeader');
  if (!header || !header.classList.contains('header--transparent')) return;

  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Scroll Progress Bar
(function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) {
      bar.style.transform = 'scaleX(' + (window.scrollY / h) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Text Clip-Mask Reveal — wrap .h1 content in reveal spans
(function () {
  document.querySelectorAll('.h1, .h2, .display').forEach(function (el) {
    if (el.closest('.hero')) return; // hero has its own animation
    var text = el.innerHTML;
    el.classList.add('text-reveal');
    el.innerHTML = '<span class="text-reveal__inner">' + text + '</span>';
  });

  // Add reveal to .narrow paragraphs (intro sections)
  document.querySelectorAll('.section .narrow > .lead, .section .narrow > .body-l').forEach(function (el, i) {
    if (el.closest('.article-body')) return; // article body has its own stagger
    el.classList.add('reveal');
    el.style.transitionDelay = (0.2 + i * 0.1) + 's';
  });
})();

// Image Curtain Reveal — add class to key images
(function () {
  document.querySelectorAll('.split__image, .hero-image__wrapper, .img-caption').forEach(function (el) {
    el.classList.add('img-reveal');
  });
})();

// Scroll Reveal — IntersectionObserver
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Reveal sections, headings, text blocks
  document.querySelectorAll(
    '.reveal, .card, .stat-card, .sponsor-logo, .split, .pillar, .pull-quote, .photo-grid__row, .document-list, .contact-form, .contact-info, .text-reveal, .img-reveal, .breadcrumb, .divider'
  ).forEach(function (el) {
    if (!el.classList.contains('card') && !el.classList.contains('text-reveal') && !el.classList.contains('img-reveal') && !el.classList.contains('breadcrumb') && !el.classList.contains('divider')) {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });

  // Ensure content after headings appears after the heading animates
  document.querySelectorAll('.text-reveal').forEach(function (heading) {
    var section = heading.closest('.section, .article-body, .container');
    if (!section) return;
    var siblings = section.querySelectorAll('.reveal, .img-reveal, .split');
    siblings.forEach(function (el) {
      var existing = parseFloat(el.style.transitionDelay) || 0;
      if (existing < 0.15) {
        el.style.transitionDelay = '0.15s';
      }
    });
  });

  // Article paragraph stagger reveals
  document.querySelectorAll('.article-body .narrow p, .article-body .narrow h3').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.08) + 's';
    observer.observe(el);
  });

  // Stagger cards within grids
  document.querySelectorAll('.grid, .photo-grid__row').forEach(function (grid) {
    var cards = grid.querySelectorAll('.card');
    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  // Stagger sponsor logos
  document.querySelectorAll('.flex').forEach(function (row) {
    var logos = row.querySelectorAll('.sponsor-logo');
    logos.forEach(function (logo, i) {
      logo.style.transitionDelay = (i * 0.06) + 's';
    });
  });
})();

// Counter Animation — animate stat card numbers on scroll
(function () {
  var observed = false;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !observed) {
        observed = true;
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-card__value').forEach(function (el) {
    var text = el.textContent.trim();
    var match = text.match(/^([\d\s]+)/);
    if (match) {
      var num = parseInt(match[1].replace(/\s/g, ''), 10);
      el.setAttribute('data-count', num);
      el.setAttribute('data-suffix', text.replace(match[1], ''));
      el.textContent = '0' + text.replace(match[1], '');
    }
    observer.observe(el);
  });

  function animateCounters() {
    document.querySelectorAll('.stat-card__value[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1800;
      var start = performance.now();

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var current = Math.round(easeOutCubic(progress) * target);
        el.textContent = current.toLocaleString('cs-CZ') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
})();

// Magnetic Button Effect
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.classList.add('btn--magnetic');

    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.setProperty('--mx', (x * 0.15) + 'px');
      btn.style.setProperty('--my', (y * 0.15) + 'px');
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
})();

// Parallax on hero orbs (mouse move)
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var orbs = hero.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  var speeds = [0.03, 0.02, 0.04];

  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    var x = (e.clientX - rect.left - rect.width / 2);
    var y = (e.clientY - rect.top - rect.height / 2);

    orbs.forEach(function (orb, i) {
      var s = speeds[i] || 0.02;
      orb.style.transform = 'translate(' + (x * s) + 'px, ' + (y * s) + 'px)';
    });
  });

  hero.addEventListener('mouseleave', function () {
    orbs.forEach(function (orb) {
      orb.style.transition = 'transform 0.8s ease-out';
      orb.style.transform = 'translate(0, 0)';
      setTimeout(function () { orb.style.transition = ''; }, 800);
    });
  });
})();

// Mobile Menu Toggle
(function () {
  var hamburger = document.querySelector('.header__hamburger');
  var menu = document.getElementById('mobileMenu');
  if (!hamburger || !menu) return;

  function toggle() {
    var isOpen = menu.classList.toggle('active');
    hamburger.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggle);

  // Close on link click
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('active');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      toggle();
    }
  });
})();

// Sponsors scroll JS removed — using native horizontal swipe on mobile
