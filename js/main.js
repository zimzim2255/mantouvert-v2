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
     Scroll Reveal Transition — global curtain
     that blocks scrolling from the hero to the
     next section. When the user tries to scroll
     past the hero, it acts as a trigger:
       1. Page locks (scroll blocked)
       2. Curtain slides down covering viewport
       3. Curtain slides away revealing next section
       4. Page unlocks, user lands in next section
       (normal scrolling resumes afterwards)
     Works on every page automatically.
     -------------------------------------------- */
  const reveal = document.createElement('div');
  reveal.className = 'scroll-reveal';
  document.body.appendChild(reveal);

  const TRANSITION_MS = 700; // matches --duration-slow

  let hero = null;
  let nextSection = null;
  let isTransitioning = false;

  const collectSections = () => {
    const main = document.querySelector('main');
    if (!main) return;
    hero = main.children[0] || null;
    nextSection = main.children[1] || null;
  };

  const lockScroll = () => {
    document.body.classList.add('is-locked');
  };

  const unlockScroll = () => {
    document.body.classList.remove('is-locked');
  };

  const scrollToNextSection = () => {
    if (!nextSection) return;
    const top = nextSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'auto' });
  };

  const playTransition = () => {
    if (isTransitioning || !hero || !nextSection) return;
    isTransitioning = true;
    lockScroll();

    // Phase 1: curtain slides down to cover the viewport
    reveal.style.transition = 'none';
    reveal.style.transform = 'translateY(-100%)';
    // Force reflow so the transition applies
    void reveal.offsetHeight;
    reveal.style.transition = `transform ${TRANSITION_MS}ms var(--ease)`;
    reveal.style.transform = 'translateY(0%)';

    // After covering, jump to next section and slide curtain away
    setTimeout(() => {
      scrollToNextSection();

      // Phase 2: curtain slides away revealing the next section
      reveal.style.transform = 'translateY(100%)';

      setTimeout(() => {
        // Reset curtain for next trigger
        reveal.style.transition = 'none';
        reveal.style.transform = 'translateY(-100%)';
        unlockScroll();
        isTransitioning = false;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  };

  // Only trigger while the hero fills the viewport (top of page)
  const isAtHero = () => window.scrollY < window.innerHeight * 0.7;

  // Wheel scroll acts as a trigger past the hero
  const onWheel = (e) => {
    if (isTransitioning) return;
    if (!isAtHero()) return; // normal scrolling after hero
    if (e.deltaY <= 10) return;

    // Block the native scroll and trigger the transition
    e.preventDefault();
    playTransition();
  };

  // Touch scroll acts as a trigger past the hero
  let touchStartY = 0;
  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (isTransitioning) return;
    if (!isAtHero()) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    if (delta < 30) return; // swipe up only

    playTransition();
  };

  // Keyboard scroll acts as a trigger past the hero
  const onKeyDown = (e) => {
    if (isTransitioning) return;
    if (!isAtHero()) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      playTransition();
    }
  };

  // Initialize
  collectSections();
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKeyDown);

  // Re-collect sections on resize (in case layout changes)
  window.addEventListener('resize', collectSections);
})();
