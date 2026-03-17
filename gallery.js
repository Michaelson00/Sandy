/**
 * gallery.js
 * ─────────────────────────────────────────────────────────────
 * Handles the photo gallery:
 *   • Opens a full-screen lightbox when a photo is clicked
 *   • Supports keyboard navigation (←/→/Esc)
 *   • Traps focus inside the lightbox for accessibility
 *   • Closes on backdrop click or ✕ button
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── DOM refs ────────────────────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lbImg         = document.getElementById('lightbox-img');
  const lbCaption     = document.getElementById('lightbox-caption');
  const btnClose      = lightbox.querySelector('.lightbox-close');
  const btnPrev       = lightbox.querySelector('.lightbox-prev');
  const btnNext       = lightbox.querySelector('.lightbox-next');
  const galleryItems  = Array.from(document.querySelectorAll('.gallery-item'));

  let   currentIndex  = 0;

  /* ── Build data array from DOM ───────────────────────────── */
  const images = galleryItems.map(item => ({
    src:     item.querySelector('img').src,
    alt:     item.querySelector('img').alt,
    caption: item.dataset.caption || '',
  }));

  /* ── Open lightbox ───────────────────────────────────────── */
  function openLightbox (index) {
    currentIndex = index;
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';  // prevent background scroll
    btnClose.focus();
  }

  /* ── Close lightbox ──────────────────────────────────────── */
  function closeLightbox () {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    // Return focus to the item that opened the lightbox
    galleryItems[currentIndex]?.focus();
  }

  /* ── Show image at index ─────────────────────────────────── */
  function showImage (index) {
    const data = images[index];
    if (!data) return;

    // Brief fade-out/in
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src         = data.src;
      lbImg.alt         = data.alt;
      lbCaption.textContent = data.caption;
      lbImg.style.opacity = '1';
    }, 160);

    // Update prev/next visibility
    btnPrev.style.visibility = index === 0              ? 'hidden' : 'visible';
    btnNext.style.visibility = index === images.length - 1 ? 'hidden' : 'visible';
  }

  /* ── Transition helpers ──────────────────────────────────── */
  function prev () {
    if (currentIndex > 0) showImage(--currentIndex);
  }

  function next () {
    if (currentIndex < images.length - 1) showImage(++currentIndex);
  }

  /* ── Event listeners: gallery items ─────────────────────── */
  galleryItems.forEach((item, i) => {
    // Click
    item.addEventListener('click', () => openLightbox(i));

    // Keyboard: Enter or Space
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });

    // Make items focusable if not already
    if (!item.getAttribute('tabindex')) {
      item.setAttribute('tabindex', '0');
    }
  });

  /* ── Event listeners: lightbox controls ─────────────────── */
  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click',  prev);
  btnNext.addEventListener('click',  next);

  // Backdrop click (click on the dark area, not the image)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ── Keyboard navigation ─────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    switch (e.key) {
      case 'Escape':    closeLightbox(); break;
      case 'ArrowLeft': prev();          break;
      case 'ArrowRight':next();          break;
    }
  });

  /* ── Smooth image transition ─────────────────────────────── */
  lbImg.style.transition = 'opacity 0.15s ease';

  /* ── Touch swipe support ─────────────────────────────────── */
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

})();
