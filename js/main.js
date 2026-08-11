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
  const galleryImages = [
    'public/imgs/hero_garden.jpg',
    'public/imgs/hero_swimmingpool.jpg',
    'public/imgs/hero_waterfall.jpg',
    'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large'
  ];

  // Card color themes + heading/body text
  const cardThemes = [
    { cls: 'infinite-gallery__card--white', title: 'WANDER', sub: 'Outdoor Living' },
    { cls: 'infinite-gallery__card--dark', title: '$1M', sub: 'Villa Ambre' },
    { cls: 'infinite-gallery__card--brown', title: 'TERRA', sub: 'Garden Retreat' },
    { cls: 'infinite-gallery__card--beige', title: 'BRIGHT SMILES', sub: 'Poolside' },
    { cls: 'infinite-gallery__card--white', title: 'ATHERTON', sub: 'Pavilions' },
    { cls: 'infinite-gallery__card--dark', title: 'AZURE', sub: 'Reflections' },
    { cls: 'infinite-gallery__card--brown', title: 'STONE', sub: 'Craftsmanship' },
    { cls: 'infinite-gallery__card--beige', title: 'CASCADE', sub: 'Water Features' }
  ];

  const openInfiniteGallery = () => {
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

    // Preload images to get their natural aspect ratios
    const imageRatios = [];
    const preloadPromises = galleryImages.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageRatios.push({ src, ratio: img.naturalWidth / img.naturalHeight });
          resolve();
        };
        img.onerror = () => {
          imageRatios.push({ src, ratio: 1.5 }); // fallback 3:2
          resolve();
        };
        img.src = src;
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
        const idx = i % galleryImages.length;
        const theme = cardThemes[i % cardThemes.length];
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
        card.className = `infinite-gallery__card ${theme.cls}`;
        card.style.left = `${startX + col * (CARD_W + GAP)}px`;
        card.style.top = `${colHeights[col]}px`;
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;

        // Advance this column's height by card height + gap
        colHeights[col] += h + GAP;

        // Image fills the card; text overlay for some cards
        const img = document.createElement('img');
        img.src = galleryImages[idx];
        img.alt = theme.title;
        card.appendChild(img);

        // Add text overlay for every 3rd card
        if (i % 3 === 0) {
          const text = document.createElement('div');
          text.className = 'infinite-gallery__card-text';
          text.innerHTML = `<h4>${theme.title}</h4><p>${theme.sub}</p>`;
          card.appendChild(text);
        }

        canvas.appendChild(card);
      }
    });

    // --- Infinite drag pan with momentum (smooth rAF updates) ---
    let isDragging = false;
    let startXPos = 0;
    let startYPos = 0;
    let panX = 0;
    let panY = 0;
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
      canvas.style.transform = `translate(${panX}px, ${panY}px)`;
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

    // Touch events
    let touchId = null;
    gallery.addEventListener('touchstart', (e) => {
      if (e.target.closest('.gallery-overlay__close')) return;
      const t = e.touches[0];
      touchId = t.identifier;
      startDrag(t.clientX, t.clientY);
    }, { passive: true });

    gallery.addEventListener('touchmove', (e) => {
      const t = Array.from(e.touches).find((t) => t.identifier === touchId);
      if (t) moveDrag(t.clientX, t.clientY);
    }, { passive: true });

    gallery.addEventListener('touchend', () => {
      endDrag();
    }, { passive: true });

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

  // Wire up all "Explore all projects" links
  document.querySelectorAll('.editorial-spread__explore').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
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
        openInfiniteGallery();

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
