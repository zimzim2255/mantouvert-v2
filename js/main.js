/* ============================================================
   MANTOUVERT — MAIN SCRIPT
   Source of truth: rools.md (Version 1.0)
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------
     Header — transparent initially, turns
     matte black on scroll.
     -------------------------------------------- */
  const header = document.querySelector('[data-header]');

  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------
     Hamburger menu toggle — opens/closes the
     full-screen overlay menu.
     -------------------------------------------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    const closeMenu = () => {
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-label', 'Close menu');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when a nav link is clicked
    menu.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------
     Smooth reveal on scroll (placeholder)
     Allowed: fade, slide, parallax, image reveal,
     text reveal, smooth scale. 400–700ms.
     -------------------------------------------- */
  // TODO: implement IntersectionObserver-based reveal animations
})();