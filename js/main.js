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

    // Detect whether the header sits over a light or dark background.
    // Sample the element directly below the header center and toggle
    // the `is-on-light` class so the icon/logo adapt their colors.
    const updateHeaderContrast = () => {
      if (!header) return;
      const rect = header.getBoundingClientRect();
      const x = window.innerWidth / 2;
      const y = rect.bottom + 4; // just below the header
      const el = document.elementFromPoint(x, y);
      if (!el) return;

      // Walk up to find a meaningful background color
      let node = el;
      let bg = null;
      while (node && node !== document.body) {
        const color = window.getComputedStyle(node).backgroundColor;
        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          bg = color;
          break;
        }
        node = node.parentElement;
      }

      if (!bg) return;

      // Parse the RGB values
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return;
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);

      // Compute luminance — if bright, use dark icon/logo
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      header.classList.toggle('is-on-light', luminance > 0.5);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', updateHeaderContrast, { passive: true });
    window.addEventListener('resize', updateHeaderContrast);
    onScroll();
    updateHeaderContrast();
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

  const revealOrange = document.createElement('div');
  revealOrange.className = 'scroll-reveal scroll-reveal--orange';
  document.body.appendChild(revealOrange);

  const TRANSITION_MS = 700; // matches --duration-slow
  const HALF_TRANSITION_MS = 350; // each layer takes half the duration

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

  // Returns the scroll position a section should land on so it fills the
  // viewport: centered for sections shorter than the viewport, top-aligned
  // for sections taller than the viewport (explored with native scrolling).
  const getSectionSnapTop = (index) => {
    const sec = sections[index];
    if (!sec) return 0;
    const rect = sec.getBoundingClientRect();
    const secTop = rect.top + window.scrollY;
    const secHeight = rect.height;
    const vh = window.innerHeight;
    let snap;
    if (secHeight <= vh) {
      snap = Math.max(0, secTop - (vh - secHeight) / 2);
    } else {
      snap = secTop;
    }
    // Clamp to the page's actual scrollable range
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
    return Math.max(0, Math.min(snap, maxScroll));
  };

  // True when the section is taller than the viewport, so it needs
  // native scrolling to be explored instead of the curtain transition.
  const sectionNeedsScroll = (sec) => {
    if (!sec) return false;
    return sec.getBoundingClientRect().height > window.innerHeight;
  };

  const scrollToSection = (index) => {
    if (index < 0 || index >= sections.length) return;
    const top = getSectionSnapTop(index);
    try {
      window.scrollTo({ top, behavior: 'instant' });
    } catch (err) {
      // Fallback for browsers without 'instant' behavior support
      window.scrollTo(0, top);
    }
  };

  const playTransition = (direction) => {
    if (isTransitioning) return;
    const next = currentSection + direction;
    if (next < 0 || next >= sections.length) return;
    if (sections.length < 2) return;

    isTransitioning = true;
    lockScroll();

    // Reset both curtains to hidden
    reveal.style.transition = 'none';
    reveal.style.transform = 'translateY(-100%)';
    revealOrange.style.transition = 'none';
    revealOrange.style.transform = 'translateY(-100%)';
    // Force reflow so the transitions apply
    void reveal.offsetHeight;

    // Phase 1a: black curtain falls down first (350ms)
    reveal.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
    reveal.style.transform = 'translateY(0%)';

    // Phase 1b: orange curtain falls on top of the black one (350ms later)
    setTimeout(() => {
      revealOrange.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
      revealOrange.style.transform = 'translateY(0%)';
    }, HALF_TRANSITION_MS);

    // After both curtains cover the viewport, jump to target section
    setTimeout(() => {
      scrollToSection(next);
      currentSection = next;

      // Phase 2a: orange curtain lifts away first (350ms)
      revealOrange.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
      revealOrange.style.transform = 'translateY(-100%)';

      // Phase 2b: black curtain lifts away revealing the target (350ms later)
      setTimeout(() => {
        reveal.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
        reveal.style.transform = 'translateY(-100%)';

        setTimeout(() => {
          // Reset both curtains for the next trigger
          reveal.style.transition = 'none';
          revealOrange.style.transition = 'none';
          unlockScroll();
          isTransitioning = false;
        }, HALF_TRANSITION_MS);
      }, HALF_TRANSITION_MS);
    }, TRANSITION_MS);
  };

  // True when the scroll position is at the snap position of the current section
  const isNearCurrentTop = () => {
    if (!sections[currentSection]) return false;
    const snapTop = getSectionSnapTop(currentSection);
    return Math.abs(window.scrollY - snapTop) < 60;
  };

  // Wheel scroll acts as a trigger in both directions
  const onWheel = (e) => {
    if (isTransitioning) return;
    if (Math.abs(e.deltaY) < 10) return;

    const current = sections[currentSection];

    // Tall sections need native scrolling to be explored — only an upward
    // scroll at their top returns to the previous section.
    if (current && sectionNeedsScroll(current) && e.deltaY > 0 && isNearCurrentTop()) {
      return;
    }

    if (!isNearCurrentTop()) return; // normal scrolling within a section

    if (e.deltaY > 0 && currentSection < sections.length - 1) {
      e.preventDefault();
      playTransition(1); // scroll down → next section
    } else if (e.deltaY < 0 && currentSection > 0) {
      e.preventDefault();
      playTransition(-1); // scroll up → previous section
    }
  };

  // Touch scroll acts as a trigger in both directions.
  // We intercept touchmove to prevent native scrolling at section
  // boundaries, so the curtain transition fires reliably on mobile.
  let touchStartY = 0;
  let touchStartX = 0;
  let touchActive = false;
  let touchTriggered = false;

  const onTouchStart = (e) => {
    if (isTransitioning) return;
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchActive = true;
    touchTriggered = false;
  };

  const onTouchMove = (e) => {
    if (!touchActive || isTransitioning || touchTriggered) return;

    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const deltaY = touchStartY - touchY;
    const deltaX = touchStartX - touchX;

    // Only handle vertical swipes (ignore horizontal panning)
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;
    if (Math.abs(deltaY) < 20) return;

    const current = sections[currentSection];

    // Tall sections need native scrolling to be explored — let the
    // browser handle them naturally.
    if (current && sectionNeedsScroll(current)) {
      // Only intercept when at the very top of a tall section and
      // swiping up (to go to previous section), or at the very bottom
      // and swiping down (to go to next section).
      const rect = current.getBoundingClientRect();
      const atTop = rect.top >= -10;
      const atBottom = rect.bottom <= window.innerHeight + 10;

      if (deltaY > 0 && atTop && currentSection < sections.length - 1) {
        // At top of tall section, swiping up → go to next section
        e.preventDefault();
        touchTriggered = true;
        playTransition(1);
        return;
      }
      if (deltaY < 0 && atBottom && currentSection > 0) {
        // At bottom of tall section, swiping down → go to previous section
        e.preventDefault();
        touchTriggered = true;
        playTransition(-1);
        return;
      }
      return; // let native scrolling handle it
    }

    // Short sections — intercept swipe at the snap position
    if (!isNearCurrentTop()) return;

    if (deltaY > 0 && currentSection < sections.length - 1) {
      e.preventDefault();
      touchTriggered = true;
      playTransition(1); // swipe up → next section
    } else if (deltaY < 0 && currentSection > 0) {
      e.preventDefault();
      touchTriggered = true;
      playTransition(-1); // swipe down → previous section
    }
  };

  const onTouchEnd = () => {
    touchActive = false;
    touchTriggered = false;
  };

  // Keyboard scroll acts as a trigger in both directions
  const onKeyDown = (e) => {
    if (isTransitioning) return;
    if (!isNearCurrentTop()) return;

    const current = sections[currentSection];
    const isDownKey = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ';

    // Tall sections need native scrolling to be explored — let the browser
    // scroll them instead of jumping to the next section.
    if (current && sectionNeedsScroll(current) && isDownKey) return;

    if (isDownKey) {
      e.preventDefault();
      if (currentSection < sections.length - 1) playTransition(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentSection > 0) playTransition(-1);
    }
  };

  // Track which section the scroll position is in (supports reload mid-page).
  // Short sections are owned by the nearest snap position; tall sections are
  // owned when their range contains the viewport center.
  const onScrollTrack = () => {
    const scrollY = window.scrollY;
    let best = 0;
    let bestDist = Infinity;

    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const secTop = rect.top + scrollY;

      if (rect.height <= window.innerHeight) {
        const dist = Math.abs(scrollY - getSectionSnapTop(i));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      } else {
        const secBottom = secTop + rect.height;
        const viewCenter = scrollY + window.innerHeight / 2;
        if (viewCenter >= secTop && viewCenter <= secBottom) {
          best = i;
          bestDist = 0;
        } else {
          const dist = Math.abs(scrollY - secTop);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        }
      }
    });

    currentSection = best;
  };

  // Initialize
  collectSections();
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
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
          <source src="https://res.cloudinary.com/dqlr9mio4/video/upload/v1786397926/From_Klickpin.com-_Explore_Must-save_road_trip_essentials_for_your_next_Pinterest_save_with_thoughtful_touches_that_make_everything_feel_complete-_wn4yvr.mp4" type="video/mp4">
        </video>
      </div>
      <div class="mega-footer__overlay-body"></div>
      <div class="mega-footer__box">
        <div class="mega-footer__inner">
          <div class="mega-footer__bg">
            <video autoplay muted loop playsinline poster="public/imgs/hero_garden.jpg">
              <source src="https://res.cloudinary.com/dqlr9mio4/video/upload/v1786397926/From_Klickpin.com-_Explore_Must-save_road_trip_essentials_for_your_next_Pinterest_save_with_thoughtful_touches_that_make_everything_feel_complete-_wn4yvr.mp4" type="video/mp4">
            </video>
          </div>
          <div class="mega-footer__overlay"></div>

          <!-- Top row — logo -->
          <div class="mega-footer__top">
            <a href="index.html" class="mega-footer__logo">Mantouvert</a>
          </div>

          <!-- Contact — desktop top-right, mobile bottom-right on the title line -->
          <div class="mega-footer__contact">
            <a href="mailto:hello@mantouvert.com">hello@mantouvert.com</a>
            <a href="tel:+212000000000">+212 000 000 000</a>
          </div>

          <!-- Center — brand statement -->
          <div class="mega-footer__center">
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

          <!-- Title — bottom-left of the card -->
          <h2 class="mega-footer__title">
            Mantouvert<sup>®</sup>
          </h2>

        </div>
      </div>

      <!-- Bottom bar — copyright -->
      <div class="mega-footer__bottom">
        <p>© 2025 Mantouvert. All rights reserved.</p>
        <p>Pool Construction · Garden Design · Landscaping · Villas</p>
      </div>
    `;

    // Brown spacer band between the last section and the footer
    const spacer = document.createElement('div');
    spacer.className = 'mega-footer__spacer';

    document.body.appendChild(spacer);
    document.body.appendChild(footer);
  };

  injectMegaFooter();
  collectSections();
  onScrollTrack();

  /* --------------------------------------------
     Infinite Drag Gallery — flat "museum in space"
     A huge canvas of masonry cards the user can
     grab and pan in any direction. Drag with
     momentum/inertia, like moving a map.
     -------------------------------------------- */
  /* --------------------------------------------
     Gallery Collections — Pools, Gardens, ...
     Each image gets a title + short description.
     -------------------------------------------- */

  // Pools collection
  const poolImages = [
    { src: 'https://i.pinimg.com/736x/30/25/81/3025814fa9ff32f420b109d538bca80a.jpg', title: 'Azure Horizon', desc: 'Infinity pool merging with the sky' },
    { src: 'https://i.pinimg.com/736x/e1/af/f5/e1aff5a4f4b72a15be57f42aa6df80f7.jpg', title: 'Crystal Reflections', desc: 'Still water catching the light' },
    { src: 'https://i.pinimg.com/736x/b3/7e/5e/b37e5e8dec803717d07de5dec0143399.jpg', title: 'Emerald Oasis', desc: 'Lush poolside retreat' },
    { src: 'https://i.pinimg.com/736x/5f/0f/87/5f0f877fd4f9358786296b75bb558996.jpg', title: 'Serene Waters', desc: 'Calm pool in golden light' },
    { src: 'https://i.pinimg.com/736x/33/db/d2/33dbd2cf7e32701ce020110c4b249c2a.jpg', title: 'Villa Azure', desc: 'Private pool escape' },
    { src: 'https://i.pinimg.com/736x/dd/69/b8/dd69b87cf4527fb242ccbb0ced643515.jpg', title: 'Midnight Dip', desc: 'Pool under twilight glow' },
    { src: 'https://i.pinimg.com/736x/69/1c/11/691c11e58fc3c0a715292e1d0b6991ba.jpg', title: 'Paradise Edge', desc: 'Seamless vanishing edge' },
    { src: 'https://i.pinimg.com/736x/2c/5a/37/2c5a3701bab075b7574b3d1eab83a738.jpg', title: 'Tropical Calm', desc: 'Pool framed by palms' },
    { src: 'https://i.pinimg.com/736x/00/ef/bf/00efbf5300c5280b40e58f64d13119d0.jpg', title: 'Liquid Light', desc: 'Sun-dappled water' },
    { src: 'https://i.pinimg.com/736x/01/5b/50/015b507e7c0322705465ff3c96d9a011.jpg', title: 'Grand Cascade', desc: 'Pool with waterfall feature' },
    { src: 'https://i.pinimg.com/736x/f5/a4/65/f5a465a49225637b0d28cea98f97b74d.jpg', title: 'Poolside Luxury', desc: 'Resort-style water' },
    { src: 'https://i.pinimg.com/736x/85/95/22/859522b283fdad20b67b7fbe2aecf0dd.jpg', title: 'Morning Stillness', desc: 'Quiet pool at dawn' },
    { src: 'https://i.pinimg.com/736x/9f/f5/5b/9ff55b997d6a796d9e16e67ba9aadc92.jpg', title: 'Blue Lagoon', desc: 'Deep turquoise water' },
    { src: 'https://i.pinimg.com/736x/e5/b9/2d/e5b92da9afd7a15a6a775322070078bb.jpg', title: 'Summer Retreat', desc: 'Pool in bright daylight' },
    { src: 'https://i.pinimg.com/736x/65/e0/3d/65e03dfbc01e452c7248027237d1124d.jpg', title: 'Private Sanctuary', desc: 'Secluded swimming pool' },
    { src: 'https://i.pinimg.com/736x/95/90/78/959078063be22afa241123643ae8ec11.jpg', title: 'Desert Oasis', desc: 'Pool in warm tones' },
    { src: 'https://i.pinimg.com/736x/a1/12/8e/a1128e8c9c41d46071ee9b9bdcd0b212.jpg', title: 'Glassy Surface', desc: 'Mirror-like pool water' },
    { src: 'https://i.pinimg.com/736x/d2/1e/9b/d21e9ba2856d3e5752e0714e83458e7c.jpg', title: 'Evening Glow', desc: 'Pool at sunset' },
    { src: 'https://i.pinimg.com/736x/4a/c8/f3/4ac8f34725c4a4bf02d7929e118dfa78.jpg', title: 'Stone & Water', desc: 'Pool with natural stone' },
    { src: 'https://i.pinimg.com/736x/3e/d4/8d/3ed48da28904163f72869a568292b090.jpg', title: 'Endless Blue', desc: 'Long infinity pool' },
    { src: 'https://i.pinimg.com/736x/63/db/91/63db918177bf4e43e3fce74fb214184a.jpg', title: 'Hidden Gem', desc: 'Intimate garden pool' },
    { src: 'https://i.pinimg.com/736x/b9/8f/6e/b98f6e27997ceb0eba16fb006e849a44.jpg', title: 'Coastal Breeze', desc: 'Pool with ocean vibes' },
    { src: 'https://i.pinimg.com/736x/c5/fd/d0/c5fdd0834eb2a4e9b069b48d170660e8.jpg', title: 'The Centerpiece', desc: 'Signature pool design' }
  ];

  // Gardens collection
  const gardenImages = [
    { src: 'https://i.pinimg.com/736x/8f/70/09/8f7009bb7ea778076ada66ab0d244c3f.jpg', title: 'Botanical Haven', desc: 'Lush layered garden beds' },
    { src: 'https://i.pinimg.com/1200x/1c/92/64/1c9264e1e16f142015412a8730ed179c.jpg', title: 'Green Cathedral', desc: 'Tall trees framing the path' },
    { src: 'https://i.pinimg.com/736x/d6/cb/77/d6cb775392d22ec8a8384c79c54140bc.jpg', title: 'Stone & Bloom', desc: 'Formal garden with stonework' },
    { src: 'https://i.pinimg.com/736x/93/10/bd/9310bd9a8148d3ed5937c2e6ccf78067.jpg', title: 'Moonlit Garden', desc: 'Evening light among the plants' },
    { src: 'https://i.pinimg.com/736x/c7/aa/82/c7aa82f6e8171f0387a9b0f4783ef1f8.jpg', title: 'Fern Walk', desc: 'Shaded path through greenery' },
    { src: 'https://i.pinimg.com/736x/03/64/19/036419694f7cde0b63caf5b6d75d2dfa.jpg', title: 'Secret Courtyard', desc: 'Intimate planted garden' },
    { src: 'https://i.pinimg.com/736x/a1/32/41/a132419d6feab9d556c98eb4518fe200.jpg', title: 'Terraced Flora', desc: 'Elevated garden beds' },
    { src: 'https://i.pinimg.com/736x/9b/11/57/9b1157feb67ab8500928f36943935b7c.jpg', title: 'Jungle Retreat', desc: 'Dense tropical planting' },
    { src: 'https://i.pinimg.com/736x/4f/c2/2e/4fc22e38b9d71c932e54d29ce507dec2.jpg', title: 'Golden Hour', desc: 'Warm sunlight on foliage' },
    { src: 'https://i.pinimg.com/736x/8b/5a/8f/8b5a8fa5aaab7b82c5667a8dd7ac3287.jpg', title: 'Modern Oasis', desc: 'Contemporary garden design' },
    { src: 'https://i.pinimg.com/736x/82/61/c0/8261c0186271eacb74bf6881bef1e291.jpg', title: 'Tree Canopy', desc: 'Verdant overhead cover' },
    { src: 'https://i.pinimg.com/736x/63/99/be/6399be5e3d431d61544c9891589b7cbb.jpg', title: 'Water Garden', desc: 'Reflective pool among plants' },
    { src: 'https://i.pinimg.com/736x/9f/a2/68/9fa26817df16fe9554cb334a06dd9d4b.jpg', title: 'Olive Grove', desc: 'Mediterranean planting style' },
    { src: 'https://i.pinimg.com/736x/2e/9f/a3/2e9fa3327090726120da61804974455f.jpg', title: 'Secluded Path', desc: 'Winding garden walkway' },
    { src: 'https://i.pinimg.com/736x/80/cf/a6/80cfa6ee635c0c1711ab8bf443171148.jpg', title: 'Evergreen Frame', desc: 'Structured evergreen borders' },
    { src: 'https://i.pinimg.com/736x/c9/3c/c9/c93cc91d3c8631685a5d30c48e78a1d6.jpg', title: 'Garden Room', desc: 'Outdoor living with planting' },
    { src: 'https://i.pinimg.com/736x/c8/c4/78/c8c478dbc4c7fe37e80d334f5a3f24f9.jpg', title: 'Sunlit Meadow', desc: 'Open planting in daylight' },
    { src: 'https://i.pinimg.com/736x/a7/66/0a/a7660af82cc15a3ba757c93b9b99abce.jpg', title: 'Archway Garden', desc: 'Climbing plants over stone' },
    { src: 'https://i.pinimg.com/736x/e0/e0/a5/e0e0a5036a1299f4a5a5ca6bb7a58bbd.jpg', title: 'Misty Morning', desc: 'Soft light on the garden' }
  ];

  // Combined gallery — pools first, then gardens
  const galleryImages = [
    ...poolImages.map((item) => ({ ...item, collection: 'Pools' })),
    ...gardenImages.map((item) => ({ ...item, collection: 'Gardens' }))
  ];

  const openInfiniteGallery = (initialCollection) => {
    // Remove any existing overlay
    const existing = document.querySelector('.gallery-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';

    overlay.innerHTML = `
      <button class="gallery-overlay__close" aria-label="Close gallery">Close</button>
      <div class="infinite-gallery">
        <div class="infinite-gallery__title">Explore the Collection</div>
        <div class="infinite-gallery__canvas"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const gallery = overlay.querySelector('.infinite-gallery');
    const canvas = overlay.querySelector('.infinite-gallery__canvas');

    // Track which collection is currently displayed (default: Pools).
    // If the requested collection has no images yet, fall back to all images.
    let activeCollection = initialCollection || 'Pools';
    let filteredImages = galleryImages.filter((item) => item.collection === activeCollection);
    if (filteredImages.length === 0) {
      filteredImages = galleryImages;
    }

    // Preload the filtered collection images to get their natural aspect ratios
    const imageRatios = [];
    const preloadPromises = filteredImages.map((item) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageRatios.push({ src: item.src, ratio: img.naturalWidth / img.naturalHeight });
          resolve();
        };
        img.onerror = () => {
          imageRatios.push({ src: item.src, ratio: 1.5 }); // fallback 3:2
          resolve();
        };
        img.src = item.src;
      });
    });

    Promise.all(preloadPromises).then(() => {
      // Build a large masonry grid of cards
      // Card dimensions match each image's natural aspect ratio
      const CARD_W = 320;
      const GAP = 56;
      const COL_COUNT = 12;
      const startX = -(COL_COUNT * (CARD_W + GAP)) / 2;

      // Track the next Y position for each column
      const colHeights = new Array(COL_COUNT).fill(0);

      for (let i = 0; i < COL_COUNT * 8; i++) {
        const idx = i % filteredImages.length;
        const item = filteredImages[idx];
        const ratio = imageRatios[idx] ? imageRatios[idx].ratio : 1.5;

        // Pick the shortest column to place the next card
        let col = 0;
        for (let c = 1; c < COL_COUNT; c++) {
          if (colHeights[c] < colHeights[col]) col = c;
        }

        // Card width fixed, height derived from image aspect ratio
        const w = CARD_W;
        const h = Math.round(CARD_W / ratio);

        const card = document.createElement('div');
        card.className = 'infinite-gallery__card';
        card.style.left = `${startX + col * (CARD_W + GAP)}px`;
        card.style.top = `${colHeights[col]}px`;
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;

        // Advance this column's height by card height + gap
        colHeights[col] += h + GAP;

        // Image fills the card
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title;
        card.appendChild(img);

        // Banner overlay — collection tag + title + short description
        const banner = document.createElement('div');
        banner.className = 'infinite-gallery__banner';
        banner.innerHTML = `
          <span class="infinite-gallery__collection">${item.collection}</span>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        `;
        card.appendChild(banner);

        // Clicking a photo zooms to it
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;
          // Zoom to ~1.5x and center the clicked card
          const targetScale = 1.5;
          panX = cardCenterX - ((cardCenterX - panX) / scale) * targetScale;
          panY = cardCenterY - ((cardCenterY - panY) / scale) * targetScale;
          scale = targetScale;
          applyPan();
        });

        canvas.appendChild(card);
      }

      // Canvas content metrics — used for centering and the full-overview zoom
      const totalWidth = (COL_COUNT - 1) * (CARD_W + GAP) + CARD_W;
      const totalHeight = Math.max(...colHeights);
      contentCenterX = startX + totalWidth / 2;
      contentCenterY = totalHeight / 2;
      fitScale = Math.max(
        MIN_SCALE,
        Math.min(window.innerWidth / totalWidth, window.innerHeight / totalHeight)
      );

      // Small devices — open slightly zoomed out (~62%) so the photos
      // appear smaller but are still readable. The user pinches to zoom.
      if (window.innerWidth <= 768) {
        scale = 0.62;
        panX = window.innerWidth / 2 - contentCenterX * scale;
        panY = window.innerHeight / 2 - contentCenterY * scale;
        applyPan();
      }
    });

    // --- Infinite drag pan with momentum (smooth rAF updates) ---
    const MIN_SCALE = 0.08;
    const MAX_SCALE = 4;

    let isDragging = false;
    let startXPos = 0;
    let startYPos = 0;
    let panX = 0;
    let panY = 0;
    let scale = 1;
    let contentCenterX = 0;
    let contentCenterY = 0;
    let fitScale = 1;
    let startPanX = 0;
    let startPanY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastMoveX = 0;
    let lastMoveY = 0;
    let lastMoveTime = 0;
    let inertiaRAF = null;
    let dragRAF = null;
    let mouseX = 0;
    let mouseY = 0;

    const applyPan = () => {
      canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    };

    const stopInertia = () => {
      if (inertiaRAF) {
        cancelAnimationFrame(inertiaRAF);
        inertiaRAF = null;
      }
      if (dragRAF) {
        cancelAnimationFrame(dragRAF);
        dragRAF = null;
      }
    };

    // Zoom while keeping the point (cx, cy) on screen stationary.
    // Defaults to the viewport center when no point is given.
    const zoomAt = (factor, cx = window.innerWidth / 2, cy = window.innerHeight / 2) => {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor));
      if (newScale === scale) return;
      panX = cx - ((cx - panX) / scale) * newScale;
      panY = cy - ((cy - panY) / scale) * newScale;
      scale = newScale;
      applyPan();
    };

    // Small devices — reset to the slightly zoomed-out overview.
    // Larger screens — reset to the default 1:1 view.
    const resetZoom = () => {
      if (window.innerWidth <= 768) {
        scale = 0.62;
        panX = window.innerWidth / 2 - contentCenterX * scale;
        panY = window.innerHeight / 2 - contentCenterY * scale;
      } else {
        scale = 1;
        panX = 0;
        panY = 0;
      }
      applyPan();
    };

    // Smooth drag loop — reads latest mouse pos each rAF
    const dragLoop = () => {
      if (!isDragging) return;
      panX = startPanX + (mouseX - startXPos);
      panY = startPanY + (mouseY - startYPos);
      applyPan();
      dragRAF = requestAnimationFrame(dragLoop);
    };

    const startDrag = (x, y) => {
      stopInertia();
      isDragging = true;
      startXPos = x;
      startYPos = y;
      startPanX = panX;
      startPanY = panY;
      mouseX = x;
      mouseY = y;
      velocityX = 0;
      velocityY = 0;
      lastMoveX = x;
      lastMoveY = y;
      lastMoveTime = performance.now();
      gallery.classList.add('is-dragging');
      dragRAF = requestAnimationFrame(dragLoop);
    };

    const moveDrag = (x, y) => {
      if (!isDragging) return;

      // Momentum velocity from last few frames (scaled down for gentle glide)
      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTime);
      velocityX = ((x - lastMoveX) / dt) * 1000 * 1.17;
      velocityY = ((y - lastMoveY) / dt) * 1000 * 1.17;
      lastMoveX = x;
      lastMoveY = y;
      lastMoveTime = now;

      // Store latest position; dragLoop applies it smoothly
      mouseX = x;
      mouseY = y;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      gallery.classList.remove('is-dragging');

      if (dragRAF) {
        cancelAnimationFrame(dragRAF);
        dragRAF = null;
      }

      // Start inertia with captured velocity (strong friction for slow, smooth glide)
      let vx = Math.max(-20, Math.min(20, velocityX));
      let vy = Math.max(-20, Math.min(20, velocityY));

      const step = () => {
        vx *= 0.90;
        vy *= 0.90;
        if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
          inertiaRAF = null;
          return;
        }
        panX += vx;
        panY += vy;
        applyPan();
        inertiaRAF = requestAnimationFrame(step);
      };
      inertiaRAF = requestAnimationFrame(step);
    };

    // Mouse events
    gallery.addEventListener('mousedown', (e) => {
      if (e.target.closest('.gallery-overlay__close')) return;
      startDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      moveDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      endDrag();
    });

    // Touch events — single finger drags, two fingers pinch-to-zoom,
    // double-tap zooms in, double-tap at max zoom resets the view.
    // Every handler also stops propagation so the page-level scroll
    // transition handlers never fire while the gallery is open.
    let touchId = null;
    let activeTouches = new Map();
    let pinchStartDistance = 0;
    let pinchStartMidX = 0;
    let pinchStartMidY = 0;
    let pinchStartPanX = 0;
    let pinchStartPanY = 0;
    let pinchStartScale = 1;
    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    gallery.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      if (e.target.closest('.gallery-overlay__close')) return;
      for (const t of e.changedTouches) {
        activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
      }
      if (activeTouches.size === 2) {
        // Enter pinch mode — cancel any single-finger drag / inertia
        stopInertia();
        isDragging = false;
        gallery.classList.remove('is-dragging');
        if (dragRAF) {
          cancelAnimationFrame(dragRAF);
          dragRAF = null;
        }
        const [a, b] = [...activeTouches.values()];
        pinchStartDistance = Math.hypot(a.x - b.x, a.y - b.y);
        pinchStartMidX = (a.x + b.x) / 2;
        pinchStartMidY = (a.y + b.y) / 2;
        pinchStartPanX = panX;
        pinchStartPanY = panY;
        pinchStartScale = scale;
      } else if (activeTouches.size === 1) {
        const t = e.changedTouches[0];
        touchId = t.identifier;
        startDrag(t.clientX, t.clientY);
      }
    }, { passive: true });

    gallery.addEventListener('touchmove', (e) => {
      e.stopPropagation();
      for (const t of e.changedTouches) {
        if (activeTouches.has(t.identifier)) {
          activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
        }
      }

      if (activeTouches.size === 2) {
        e.preventDefault();
        const [a, b] = [...activeTouches.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        if (pinchStartDistance > 0 && dist > 0) {
          const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStartScale * (dist / pinchStartDistance)));
          // Keep the world point under the initial midpoint under the current midpoint
          panX = midX - ((pinchStartMidX - pinchStartPanX) / pinchStartScale) * newScale;
          panY = midY - ((pinchStartMidY - pinchStartPanY) / pinchStartScale) * newScale;
          scale = newScale;
          applyPan();
        }
      } else if (activeTouches.size === 1) {
        const t = e.changedTouches[0];
        if (t.identifier === touchId) moveDrag(t.clientX, t.clientY);
      }
    }, { passive: false });

    const onTouchEnd = (e) => {
      e.stopPropagation();
      for (const t of e.changedTouches) {
        activeTouches.delete(t.identifier);
      }

      // Double-tap detection (single finger)
      if (activeTouches.size === 0 && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        const now = performance.now();
        if (
          now - lastTapAt < 300 &&
          Math.abs(t.clientX - lastTapX) < 30 &&
          Math.abs(t.clientY - lastTapY) < 30
        ) {
          if (scale < MAX_SCALE) {
            zoomAt(2, t.clientX, t.clientY);
          } else {
            resetZoom();
          }
          lastTapAt = 0;
        } else {
          lastTapAt = now;
        }
        lastTapX = t.clientX;
        lastTapY = t.clientY;
      }

      if (activeTouches.size === 1) {
        // One finger still down after a pinch — resume dragging with it
        const [id, point] = [...activeTouches.entries()][0];
        touchId = id;
        startDrag(point.x, point.y);
      } else if (activeTouches.size === 0) {
        endDrag();
      }
    };

    gallery.addEventListener('touchend', onTouchEnd, { passive: true });
    gallery.addEventListener('touchcancel', onTouchEnd, { passive: true });

    // Mouse wheel zoom (also stops the page-level scroll transition handlers)
    overlay.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomAt(factor, e.clientX, e.clientY);
    }, { passive: false });

    // Trigger the expanding animation
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
    });

    // Close button
    overlay.querySelector('.gallery-overlay__close').addEventListener('click', () => {
      overlay.classList.remove('is-open');
      setTimeout(() => overlay.remove(), 700);
    });

    // Close on Escape
    const onKey = (e) => {
      if (e.key === 'Escape') {
        overlay.classList.remove('is-open');
        setTimeout(() => overlay.remove(), 700);
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);
  };

  // Wire up all "Explore all projects" links.
  // Each editorial spread opens its own collection:
  //   gallery-atherton (green) → Gardens
  //   gallery-azure    (blue)  → Pools
  //   gallery-terra    (brown) → Fountains
  const collectionByGallery = {
    'gallery-atherton': 'Gardens',
    'gallery-azure': 'Pools',
    'gallery-terra': 'Fountains'
  };

  document.querySelectorAll('.editorial-spread__explore').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const galleryId = link.dataset.gallery;
      const collection = collectionByGallery[galleryId] || 'Pools';
      // Play the dual curtain reveal transition when opening the gallery
      reveal.style.transition = 'none';
      reveal.style.transform = 'translateY(-100%)';
      revealOrange.style.transition = 'none';
      revealOrange.style.transform = 'translateY(-100%)';
      void reveal.offsetHeight;

      // Black curtain falls first
      reveal.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
      reveal.style.transform = 'translateY(0%)';

      // Orange curtain falls on top
      setTimeout(() => {
        revealOrange.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
        revealOrange.style.transform = 'translateY(0%)';
      }, HALF_TRANSITION_MS);

      setTimeout(() => {
        openInfiniteGallery(collection);

        // Orange curtain lifts first
        revealOrange.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
        revealOrange.style.transform = 'translateY(-100%)';

        // Black curtain lifts away
        setTimeout(() => {
          reveal.style.transition = `transform ${HALF_TRANSITION_MS}ms var(--ease)`;
          reveal.style.transform = 'translateY(-100%)';

          setTimeout(() => {
            reveal.style.transition = 'none';
            revealOrange.style.transition = 'none';
          }, HALF_TRANSITION_MS);
        }, HALF_TRANSITION_MS);
      }, TRANSITION_MS);
    });
  });
})();
