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

  let sections = [];
  let currentSection = 0;
  let isTransitioning = false;

  const collectSections = () => {
    const main = document.querySelector('main');
    if (!main) return;
    sections = Array.from(main.children);

    // Include the mega footer as a transition section
    const footer = document.querySelector('.mega-footer');
    if (footer) sections.push(footer);

    currentSection = 0;
  };

  const lockScroll = () => {
    document.body.classList.add('is-locked');
  };

  const unlockScroll = () => {
    document.body.classList.remove('is-locked');
  };

  const scrollToSection = (index) => {
    if (index < 0 || index >= sections.length) return;
    const target = sections[index];
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'auto' });
  };

  const playTransition = (direction) => {
    if (isTransitioning) return;
    const next = currentSection + direction;
    if (next < 0 || next >= sections.length) return;
    if (sections.length < 2) return;

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
      scrollToSection(next);
      currentSection = next;

      // Phase 2: curtain slides away revealing the target section
      reveal.style.transform = 'translateY(100%)';

      setTimeout(() => {
        // Reset curtain for the next trigger
        reveal.style.transition = 'none';
        reveal.style.transform = 'translateY(-100%)';
        unlockScroll();
        isTransitioning = false;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  };

  // True when the scroll position is at the top edge of the current section
  const isNearCurrentTop = () => {
    const sec = sections[currentSection];
    if (!sec) return false;
    const secTop = sec.getBoundingClientRect().top + window.scrollY;
    return Math.abs(window.scrollY - secTop) < 60;
  };

  // Wheel scroll acts as a trigger in both directions
  const onWheel = (e) => {
    if (isTransitioning) return;
    if (Math.abs(e.deltaY) < 10) return;
    if (!isNearCurrentTop()) return; // normal scrolling within a section

    if (e.deltaY > 0 && currentSection < sections.length - 1) {
      e.preventDefault();
      playTransition(1); // scroll down → next section
    } else if (e.deltaY < 0 && currentSection > 0) {
      e.preventDefault();
      playTransition(-1); // scroll up → previous section
    }
  };

  // Touch scroll acts as a trigger in both directions
  let touchStartY = 0;
  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (isTransitioning) return;
    if (!isNearCurrentTop()) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    if (Math.abs(delta) < 30) return;

    if (delta > 0 && currentSection < sections.length - 1) {
      playTransition(1); // swipe up → next section
    } else if (delta < 0 && currentSection > 0) {
      playTransition(-1); // swipe down → previous section
    }
  };

  // Keyboard scroll acts as a trigger in both directions
  const onKeyDown = (e) => {
    if (isTransitioning) return;
    if (!isNearCurrentTop()) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentSection < sections.length - 1) playTransition(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentSection > 0) playTransition(-1);
    }
  };

  // Track which section the scroll position is in (supports reload mid-page)
  const onScrollTrack = () => {
    const scrollY = window.scrollY;
    let best = 0;
    sections.forEach((sec, i) => {
      const secTop = sec.getBoundingClientRect().top + scrollY;
      if (secTop <= scrollY + window.innerHeight * 0.4) best = i;
    });
    currentSection = best;
  };

  // Initialize
  collectSections();
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('scroll', onScrollTrack, { passive: true });
  window.addEventListener('resize', () => {
    collectSections();
    onScrollTrack();
  });

  /* --------------------------------------------
     Mega Footer — injected globally on every page.
     Full-width background image with overlaid
     navigation, brand statement, CTA buttons and
     copyright bar.
     -------------------------------------------- */
  const injectMegaFooter = () => {
    if (document.querySelector('.mega-footer')) return;

    // Remove any existing old-style footer so this is the only one
    document.querySelectorAll('.site-footer').forEach((oldFooter) => {
      oldFooter.remove();
    });

    const footer = document.createElement('footer');
    footer.className = 'mega-footer';

    footer.innerHTML = `
      <div class="mega-footer__bg-body">
        <video autoplay muted loop playsinline poster="public/imgs/hero_garden.jpg">
          <source src="https://res.cloudinary.com/dqlr9mio4/video/upload/v1786209466/From_Klickpin.com-_2603712281740834-pin-id-2603712281740834_nwrga9.mp4" type="video/mp4">
        </video>
      </div>
      <div class="mega-footer__overlay-body"></div>
      <div class="mega-footer__box">
        <div class="mega-footer__inner">
          <div class="mega-footer__bg">
            <video autoplay muted loop playsinline poster="public/imgs/hero_garden.jpg">
              <source src="https://res.cloudinary.com/dqlr9mio4/video/upload/v1786209466/From_Klickpin.com-_2603712281740834-pin-id-2603712281740834_nwrga9.mp4" type="video/mp4">
            </video>
          </div>
          <div class="mega-footer__overlay"></div>

          <!-- Top row — logo + contact info -->
          <div class="mega-footer__top">
            <a href="index.html" class="mega-footer__logo">Mantouvert</a>
            <div class="mega-footer__contact">
              <a href="mailto:hello@mantouvert.com">hello@mantouvert.com</a>
              <a href="tel:+212000000000">+212 000 000 000</a>
            </div>
          </div>

          <!-- Center — brand statement -->
          <div class="mega-footer__center">
            <h2 class="mega-footer__title">
              Mantouvert<sup>®</sup>
            </h2>
            <p class="mega-footer__subtitle">
              Design, build, repair and maintain complete outdoor environments — from luxury pools and cascading water features to gardens, villas and outdoor living spaces.
            </p>
            <div class="mega-footer__socials">
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="Pinterest">Pinterest</a>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom bar — copyright -->
      <div class="mega-footer__bottom">
        <p>© 2025 Mantouvert. All rights reserved.</p>
        <p>Pool Construction · Garden Design · Landscaping · Villas</p>
      </div>
    `;

    document.body.appendChild(footer);
  };

  injectMegaFooter();
  collectSections();
})();
