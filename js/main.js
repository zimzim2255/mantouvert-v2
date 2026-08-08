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

  const playTransition = (direction) => {
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

    // After covering, jump to target section and slide curtain away
    setTimeout(() => {
      if (direction > 0) {
        scrollToNextSection();
      } else {
        scrollToTop();
      }

      // Phase 2: curtain slides away revealing the target section
      reveal.style.transform = 'translateY(100%)';

      setTimeout(() => {
        // Reset curtain for next trigger
        reveal.style.transition = 'none';
        reveal.style.transform = 'translateY(-100%)';
        reveal.style.pointerEvents = 'none';
        unlockScroll();
        isTransitioning = false;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Only trigger while the hero fills the viewport (top of page)
  const isAtHero = () => window.scrollY < window.innerHeight * 0.7;

  // Wheel scroll acts as a trigger in both directions
  const onWheel = (e) => {
    if (isTransitioning) return;
    if (!isAtHero()) return; // normal scrolling after hero
    if (Math.abs(e.deltaY) <= 10) return;

    // Block the native scroll and trigger the transition
    e.preventDefault();

    if (e.deltaY > 0) {
      playTransition(1); // scroll down → next section
    } else {
      playTransition(-1); // scroll up → back to top / hero
    }
  };

  // Touch scroll acts as a trigger in both directions
  let touchStartY = 0;
  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (isTransitioning) return;
    if (!isAtHero()) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    if (Math.abs(delta) < 30) return;

    if (delta > 0) {
      playTransition(1); // swipe up → next section
    } else {
      playTransition(-1); // swipe down → back to top / hero
    }
  };

  // Keyboard scroll acts as a trigger in both directions
  const onKeyDown = (e) => {
    if (isTransitioning) return;
    if (!isAtHero()) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      playTransition(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      playTransition(-1);
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
