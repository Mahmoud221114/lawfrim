/**
 * مكتب العربي وعبدالعظيم للمحاماة والاستشارات القانونية
 * script.js — Vanilla JavaScript
 *
 * Features:
 *  1. Sticky navbar with scroll effect
 *  2. Mobile hamburger menu
 *  3. Active nav link highlighting on scroll
 *  4. Scroll-reveal animations (IntersectionObserver)
 *  5. Contact form validation & submission simulation
 *  6. Back-to-top button
 *  7. Footer current year
 *  8. Smooth scroll for anchor links
 *  9. WhatsApp button (HTML handles href)
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   UTILITY: Query selector helpers
══════════════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════════════
   1. STICKY NAVBAR
══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  // Initial state — transparent on top of hero
  let lastScrollY = window.scrollY;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class for glass effect
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Hide/show navbar on scroll direction (optional UX enhancement)
    // Uncomment if desired:
    // navbar.style.transform = (scrollY > lastScrollY && scrollY > 200)
    //   ? 'translateY(-100%)'
    //   : 'translateY(0)';

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run on load
}

/* ══════════════════════════════════════════════════════════
   2. MOBILE HAMBURGER MENU
══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileLinks = $$('.mobile-link', mobileMenu);

  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Toggle on hamburger click
  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close on any mobile link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile CTA
  const mobileCta = $('.mobile-cta', mobileMenu);
  if (mobileCta) mobileCta.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (isOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ══════════════════════════════════════════════════════════
   3. ACTIVE NAV LINK BASED ON SCROLL POSITION
══════════════════════════════════════════════════════════ */
function initActiveNavLinks() {
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link');
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80',
    10
  );

  function updateActiveLink() {
    const scrollY = window.scrollY + navHeight + 40;

    let currentSectionId = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentSectionId}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ══════════════════════════════════════════════════════════
   4. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  // If IntersectionObserver not supported, show all elements
  if (!('IntersectionObserver' in window)) {
    $$('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing (animate once)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,          // Trigger when 12% visible
      rootMargin: '0px 0px -48px 0px' // Slight upward offset from bottom
    }
  );

  $$('.fade-in').forEach(el => {
    revealObserver.observe(el);
  });
}

/* ══════════════════════════════════════════════════════════
   5. CONTACT FORM VALIDATION & SUBMISSION
══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form       = $('#contact-form');
  const submitBtn  = $('#submit-btn');
  const successMsg = $('#form-success');

  if (!form) return;

  /* ── Validation Rules ── */
  const rules = {
    name: {
      validate: val => val.trim().length >= 3,
      message:  'يرجى إدخال الاسم الكامل (٣ أحرف على الأقل)',
    },
    phone: {
      validate: val => /^[\+\d\s\-\(\)]{7,20}$/.test(val.trim()),
      message:  'يرجى إدخال رقم هاتف صحيح',
    },
    message: {
      validate: val => val.trim().length >= 15,
      message:  'يرجى كتابة رسالتك (١٥ حرفًا على الأقل)',
    },
  };

  /**
   * Validate a single field.
   * @param {HTMLInputElement|HTMLTextAreaElement} field
   * @returns {boolean}
   */
  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;

    const isValid = rule.validate(field.value);
    const errorEl = $(`#${field.name}-error`);

    field.classList.toggle('has-error', !isValid);

    if (errorEl) {
      errorEl.textContent = isValid ? '' : rule.message;
    }

    return isValid;
  }

  /**
   * Validate all required fields.
   * @returns {boolean}
   */
  function validateAll() {
    const fields = $$('[name]', form);
    return fields.reduce((allValid, field) => {
      return validateField(field) && allValid;
    }, true);
  }

  // Real-time validation on blur
  $$('[name]', form).forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      // Clear error as user types
      if (field.classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      // Shake the first invalid field
      const firstError = $('.has-error', form);
      if (firstError) {
        firstError.style.animation = 'none';
        void firstError.offsetWidth; // reflow
        firstError.style.animation = 'inputShake 0.4s ease';
        firstError.focus();
      }
      return;
    }

    // Show loading state
    submitBtn.classList.add('is-loading');

    // Simulate async form submission (replace with real API call)
    await simulateSubmit();

    // Hide form fields, show success
    submitBtn.classList.remove('is-loading');
    submitBtn.style.display = 'none';
    if (successMsg) {
      successMsg.hidden = false;
      successMsg.focus();
    }

    // Reset form after 6 seconds
    setTimeout(() => {
      form.reset();
      submitBtn.style.display = '';
      if (successMsg) successMsg.hidden = true;
    }, 6000);
  });

  // CSS keyframes for shake animation (injected dynamically)
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes inputShake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);
}

/**
 * Simulates a server request with a 1.8s delay.
 * Replace this with a real fetch() call to your backend.
 *
 * @returns {Promise<void>}
 */
function simulateSubmit() {
  return new Promise(resolve => setTimeout(resolve, 1800));
}

/* ══════════════════════════════════════════════════════════
   6. BACK TO TOP BUTTON
══════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  // Smooth scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════
   7. FOOTER YEAR
══════════════════════════════════════════════════════════ */
function initFooterYear() {
  const yearEl = $('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ══════════════════════════════════════════════════════════
   8. SMOOTH SCROLL FOR ANCHOR LINKS
══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80',
    10
  );

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top
                + window.scrollY
                - navHeight
                - 8; // small extra offset

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   9. WHATSAPP BUTTON INTERACTION
      (The href with pre-filled message is in HTML)
      This adds a small entrance animation on load.
══════════════════════════════════════════════════════════ */
function initWhatsAppButton() {
  const btn = $('#whatsapp-btn');
  if (!btn) return;

  // Entrance animation after 2 seconds
  btn.style.transform = 'scale(0) translateY(20px)';
  btn.style.opacity   = '0';

  setTimeout(() => {
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease';
    btn.style.transform  = '';
    btn.style.opacity    = '';
  }, 2000);
}

/* ══════════════════════════════════════════════════════════
   10. SERVICE CARDS: Stagger animation on first reveal
══════════════════════════════════════════════════════════ */
function initServiceCardStagger() {
  const cards = $$('.service-card');

  // Already handled by --delay CSS variable in HTML inline styles
  // This adds a class once the section is in view so CSS transitions fire
  const section = $('#services');
  if (!section) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(card => card.classList.add('visible'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(section);
}

/* ══════════════════════════════════════════════════════════
   11. STATS COUNTER ANIMATION
══════════════════════════════════════════════════════════ */
function initStatsCounter() {
  // Since numbers use Arabic-Indic numerals (٠١٢٣…) from the HTML,
  // we animate opacity on the stats container instead of counting
  const statsEl = $('.hero-stats');
  if (!statsEl) return;

  // The stats are already part of the hero's CSS animations (animate-hero-6)
  // No additional JS needed — pure CSS handles this
}

/* ══════════════════════════════════════════════════════════
   12. PILLAR CARDS: mouse enter/leave glow effect
══════════════════════════════════════════════════════════ */
function initPillarGlow() {
  $$('.pillar-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });
}

/* ══════════════════════════════════════════════════════════
   INITIALIZE ALL MODULES
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveNavLinks();
  initScrollReveal();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initSmoothScroll();
  initWhatsAppButton();
  initServiceCardStagger();
  initStatsCounter();
  initPillarGlow();

  console.log('✅ مكتب العربي وعبدالعظيم — تم تحميل الموقع بنجاح');
});

/* ══════════════════════════════════════════════════════════
   PERFORMANCE: Lazy-load images if any are added later
══════════════════════════════════════════════════════════ */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported — no action needed
} else {
  // Fallback for old browsers: force-load all images
  $$('img[loading="lazy"]').forEach(img => {
    if (img.dataset.src) img.src = img.dataset.src;
  });
}
