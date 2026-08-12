/* ============================================================
   MANTOUVERT — SPLASH SCREEN (PRELOADER)
   Orange bg + black "Mantouvert" letters appear one-by-one,
   then the bg flips to black and the letters turn orange,
   then the whole splash slides up to reveal the page.
   ============================================================ */
(function () {
  'use strict';

  const WORD = 'Mantouvert';
  const LETTER_MS = 160;      // delay between each letter appearing (slower)
  const DARK_DELAY_MS = 800;  // pause after last letter before bg flips
  const DARK_HOLD_MS = 1200;  // how long the black+orange logo shows
  const EXIT_MS = 900;        // matches slide-up transition duration

  function buildSplash() {
    if (document.querySelector('.splash')) return;

    const splash = document.createElement('div');
    splash.className = 'splash';

    const word = document.createElement('div');
    word.className = 'splash__word';

    // Splitting the word into individual letter spans
    WORD.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'splash__letter';
      span.textContent = ch;
      word.appendChild(span);
    });

    splash.appendChild(word);
    document.body.appendChild(splash);

    // Lock scrolling while the splash is showing
    document.body.classList.add('is-splashed');
    return splash;
  }

  function runSplash() {
    const splash = buildSplash();
    if (!splash) return;

    const letters = splash.querySelectorAll('.splash__letter');

    // Phase 1 — letters appear one by one
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('is-visible');
      }, index * LETTER_MS);
    });

    const totalLetters = letters.length;

    // Phase 2 — after the last letter, flip bg to black (letters go orange)
    setTimeout(() => {
      splash.classList.add('is-dark');
    }, totalLetters * LETTER_MS + DARK_DELAY_MS);

    // Phase 3 — hold, then slide the whole splash up
    setTimeout(() => {
      splash.classList.add('is-exiting');
      document.body.classList.remove('is-splashed');
    }, totalLetters * LETTER_MS + DARK_DELAY_MS + DARK_HOLD_MS);

    // Phase 4 — remove it from the DOM after the transition completes
    setTimeout(() => {
      splash.remove();
    }, totalLetters * LETTER_MS + DARK_DELAY_MS + DARK_HOLD_MS + EXIT_MS);
  }

  // Wait for the page to be ready, then run
  document.addEventListener('DOMContentLoaded', runSplash);
})();