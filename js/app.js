/**
 * app.js
 * ─────────────────────────────────────────────────────────────
 * Core application logic:
 *
 *   1. Scroll-reveal  – fades sections / cards in as they enter
 *                       the viewport (IntersectionObserver)
 *   2. Birthday countdown – live clock counting since her birthday
 *   3. Letter date    – writes today's formatted date in the letter
 *   4. Flip-card keyboard – Space/Enter toggles the .flipped class
 *   5. Cursor star trail  – golden sparkles that follow the pointer
 *                           (desktop only, respects reduced-motion)
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════
     1. SCROLL REVEAL
     Add the class "reveal" to any element in the HTML and it
     will fade + slide in when it enters the viewport.
     ════════════════════════════════════════════════════════ */

  /**
   * Elements we want to reveal on scroll.
   * We auto-tag: .section-header, .gallery-item, .flip-card,
   *              .letter-card, .video-wrapper, .counter-box,
   *              .footer-inner
   */
  const REVEAL_SELECTORS = [
    '.section-header',
    '.gallery-item',
    '.flip-card',
    '.letter-card',
    '.letter-envelope',
    '.video-wrapper',
    '.counter-box',
    '.footer-inner',
  ];

  function initScrollReveal () {
    const targets = document.querySelectorAll(REVEAL_SELECTORS.join(','));

    targets.forEach((el, i) => {
      el.classList.add('reveal');

      // Stagger delay for grouped siblings (gallery, cards, counters)
      const parent = el.parentElement;
      const siblings = parent ? parent.querySelectorAll(el.tagName + '.reveal') : [];
      const sibIndex = Array.from(siblings).indexOf(el);
      if (sibIndex > 0) {
        el.style.transitionDelay = `${sibIndex * 0.1}s`;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // reveal only once
          }
        });
      },
      { threshold: 0.12 },
    );

    targets.forEach(el => observer.observe(el));
  }


  /* ════════════════════════════════════════════════════════
     2. BIRTHDAY COUNTDOWN
     ────────────────────────────────────────────────────────
     ╔══════════════════════════════════════════════════════╗
     ║  PLACEHOLDER: SET SANDRA'S BIRTHDAY BELOW          ║
     ║                                                      ║
     ║  Change BIRTHDAY_MONTH and BIRTHDAY_DAY to Sandra's ║
     ║  actual birth month (1–12) and day.                 ║
     ║  The year is set automatically to the most recent   ║
     ║  occurrence of that date.                           ║
     ╚══════════════════════════════════════════════════════╝
  */
  const BIRTHDAY_MONTH = 3;   // ← Change to Sandra's birth month (1 = Jan)
  const BIRTHDAY_DAY   = 17;  // ← Change to Sandra's birth day

  const elDays  = document.getElementById('cnt-days');
  const elHours = document.getElementById('cnt-hours');
  const elMins  = document.getElementById('cnt-mins');
  const elSecs  = document.getElementById('cnt-secs');

  /** Pad a number to 2 digits */
  const pad = n => String(n).padStart(2, '0');

  /** Briefly scale a counter number to signal it updated */
  function bump (el) {
    el.classList.remove('bump');
    void el.offsetWidth; // reflow trick
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
  }

  function updateCountdown () {
    const now     = new Date();
    const year    = now.getFullYear();

    // Find the most recent past birthday
    let bday = new Date(year, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0, 0);
    if (bday > now) {
      // Birthday hasn't happened yet this year → use last year's
      bday = new Date(year - 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0, 0);
    }

    const diffMs   = now - bday;
    const totalSec = Math.floor(diffMs / 1000);
    const days     = Math.floor(totalSec / 86400);
    const hours    = Math.floor((totalSec % 86400) / 3600);
    const mins     = Math.floor((totalSec % 3600) / 60);
    const secs     = totalSec % 60;

    // Only bump the element if the value changed
    if (elDays.textContent  !== String(days))   { elDays.textContent  = days;    bump(elDays);  }
    if (elHours.textContent !== pad(hours))      { elHours.textContent = pad(hours); bump(elHours); }
    if (elMins.textContent  !== pad(mins))       { elMins.textContent  = pad(mins);  bump(elMins);  }
    if (elSecs.textContent  !== pad(secs))       { elSecs.textContent  = pad(secs);  bump(elSecs);  }
  }

  function initCountdown () {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }


  /* ════════════════════════════════════════════════════════
     3. LETTER DATE
     Writes today's date in a human-readable format inside
     the .letter-date element.
     ════════════════════════════════════════════════════════ */
  function initLetterDate () {
    const el = document.querySelector('.letter-date');
    if (!el) return;

    const now = new Date();
    el.textContent = now.toLocaleDateString('en-GB', {
      day:   'numeric',
      month: 'long',
      year:  'numeric',
    });
  }


  /* ════════════════════════════════════════════════════════
     4. FLIP CARD KEYBOARD TOGGLE
     Allows keyboard users to flip cards with Enter / Space,
     matching the CSS :focus-based flip behaviour.
     ════════════════════════════════════════════════════════ */
  function initFlipCards () {
    const cards = document.querySelectorAll('.flip-card');

    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });

      // Remove .flipped when focus leaves the card
      card.addEventListener('blur', () => {
        card.classList.remove('flipped');
      });
    });
  }


  /* ════════════════════════════════════════════════════════
     5. CURSOR STAR TRAIL
     Creates small golden sparkles that follow the mouse on
     desktop. Skipped if the user prefers reduced motion.
     ════════════════════════════════════════════════════════ */
  function initCursorTrail () {
    // Skip on touch-primary devices or if reduced motion requested
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const TRAIL_COLORS = ['#f0c040', '#ff6fa8', '#b66dff', '#3df0c2', '#fff'];
    let   lastX = -999, lastY = -999;

    document.addEventListener('mousemove', (e) => {
      // Throttle: only spawn a star if the mouse moved enough
      if (Math.abs(e.clientX - lastX) < 8 && Math.abs(e.clientY - lastY) < 8) return;
      lastX = e.clientX;
      lastY = e.clientY;

      const star = document.createElement('span');
      star.className = 'star-trail';
      star.style.left  = e.clientX + 'px';
      star.style.top   = e.clientY + 'px';
      star.style.background = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
      star.style.width  = star.style.height = (Math.random() * 8 + 4) + 'px';
      document.body.appendChild(star);

      // Remove after animation completes
      star.addEventListener('animationend', () => star.remove(), { once: true });
    });
  }


  /* ════════════════════════════════════════════════════════
     INIT — run everything once DOM is ready
     ════════════════════════════════════════════════════════ */
  function init () {
    initScrollReveal();
    initCountdown();
    initLetterDate();
    initFlipCards();
    initCursorTrail();
  }

  // app.js is loaded with `defer`, so DOM is already parsed
  init();

})();
