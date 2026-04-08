/**
 * مكتب العربي وعبدالعظيم للمحاماة والاستشارات القانونية
 * script.js — Vanilla JavaScript
 *
 * Modules:
 *  1. Sticky navbar
 *  2. Mobile hamburger menu
 *  3. Active nav link on scroll
 *  4. Scroll-reveal (IntersectionObserver)
 *  5. Contact form validation
 *  6. Back-to-top button
 *  7. Footer year
 *  8. Smooth anchor scrolling
 *  9. WhatsApp button entrance animation
 */

'use strict';

/* ── Selectors ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ════════════════════════════════════════════
   1. STICKY NAVBAR
════════════════════════════════════════════ */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ════════════════════════════════════════════
   2. MOBILE HAMBURGER MENU
════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => isOpen ? close() : open());
  $$('a', mobileMenu).forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });
  document.addEventListener('click', e => {
    if (isOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) close();
  });
}

/* ════════════════════════════════════════════
   3. ACTIVE NAV LINK
════════════════════════════════════════════ */
function initActiveLinks() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');
  const offset   = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80', 10
  ) + 40;

  function update() {
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= window.scrollY + offset) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ════════════════════════════════════════════
   4. SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════════ */
function initScrollReveal() {
  const els = $$('.fade-in');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════
   5. CONTACT FORM VALIDATION
════════════════════════════════════════════ */
function initContactForm() {
  const form      = $('#contact-form');
  const submitBtn = $('#submit-btn');
  const successEl = $('#form-success');
  if (!form) return;

  const rules = {
    name:    { test: v => v.trim().length >= 3,                  msg: 'يرجى إدخال الاسم الكامل (٣ أحرف على الأقل)' },
    phone:   { test: v => /^[\+\d\s\-\(\)]{7,20}$/.test(v.trim()), msg: 'يرجى إدخال رقم هاتف صحيح' },
    message: { test: v => v.trim().length >= 15,                 msg: 'يرجى كتابة رسالتك (١٥ حرفًا على الأقل)' },
  };

  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;
    const valid = rule.test(field.value);
    field.classList.toggle('has-error', !valid);
    const errEl = $(`#${field.name}-error`);
    if (errEl) errEl.textContent = valid ? '' : rule.msg;
    return valid;
  }

  $$('[name]', form).forEach(f => {
    f.addEventListener('blur', () => validateField(f));
    f.addEventListener('input', () => { if (f.classList.contains('has-error')) validateField(f); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fields = $$('[name]', form);
    const allValid = fields.reduce((ok, f) => validateField(f) && ok, true);
    if (!allValid) {
      const first = $('.has-error', form);
      first && first.focus();
      return;
    }

    submitBtn.classList.add('is-loading');
    await new Promise(r => setTimeout(r, 1800)); // simulate request
    submitBtn.classList.remove('is-loading');
    submitBtn.style.display = 'none';
    if (successEl) { successEl.hidden = false; successEl.focus(); }
    setTimeout(() => { form.reset(); submitBtn.style.display = ''; if (successEl) successEl.hidden = true; }, 6000);
  });
}

/* ════════════════════════════════════════════
   6. BACK TO TOP
════════════════════════════════════════════ */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ════════════════════════════════════════════
   7. FOOTER YEAR
════════════════════════════════════════════ */
function initYear() {
  const el = $('#current-year');
  if (el) el.textContent = new Date().getFullYear();
  // Also update .footer-year spans (on lawyer pages)
  $$('.footer-year').forEach(e => { e.textContent = new Date().getFullYear(); });
}

/* ════════════════════════════════════════════
   8. SMOOTH ANCHOR SCROLL
════════════════════════════════════════════ */
function initSmoothScroll() {
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80', 10
  );

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════
   9. WHATSAPP BUTTON ENTRANCE
════════════════════════════════════════════ */
function initWhatsApp() {
  const btn = $('#whatsapp-btn');
  if (!btn) return;
  btn.style.transform = 'scale(0) translateY(20px)';
  btn.style.opacity = '0';
  setTimeout(() => {
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease';
    btn.style.transform = '';
    btn.style.opacity = '';
  }, 2000);
}

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveLinks();
  initScrollReveal();
  initContactForm();
  initBackToTop();
  initYear();
  initSmoothScroll();
  initWhatsApp();
});
