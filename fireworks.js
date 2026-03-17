/**
 * fireworks.js
 * ─────────────────────────────────────────────────────────────
 * Self-contained fireworks engine rendered on <canvas>.
 * Runs only in the hero section. Pauses automatically when the
 * canvas scrolls out of view to save CPU/battery.
 *
 * No external dependencies.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────── */
  const CFG = {
    launchInterval:   1400,   // ms between auto-launches
    maxFireworks:     8,       // max simultaneous rockets
    particleCount:    90,      // sparks per explosion
    gravity:          0.08,
    friction:         0.97,
    colors: [
      '#f0c040', '#ffe07a',   // golds
      '#ff6fa8', '#ff9fcb',   // roses
      '#b66dff', '#d4a0ff',   // violets
      '#3df0c2', '#a0ffe8',   // teals
      '#ffffff',               // white
    ],
  };

  /* ── State ───────────────────────────────────────────────── */
  const canvas  = document.getElementById('fireworks-canvas');
  const ctx     = canvas.getContext('2d');
  let   W, H;
  let   fireworks  = [];
  let   particles  = [];
  let   animId     = null;
  let   launchTimer = null;
  let   isVisible  = true;

  /* ── Resize ──────────────────────────────────────────────── */
  function resize () {
    const hero = canvas.parentElement;
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  /* ── Helpers ─────────────────────────────────────────────── */
  function rand (min, max) { return Math.random() * (max - min) + min; }
  function pick (arr)       { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Rocket class ────────────────────────────────────────── */
  class Rocket {
    constructor (x) {
      this.x    = x ?? rand(W * 0.15, W * 0.85);
      this.y    = H;
      this.vy   = rand(-14, -10);  // upward velocity
      this.vx   = rand(-1.2, 1.2);
      this.color = pick(CFG.colors);
      this.trail = [];
      this.targetY = rand(H * 0.1, H * 0.45);
      this.exploded = false;
    }

    update () {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 14) this.trail.shift();

      this.x  += this.vx;
      this.y  += this.vy;
      this.vy += CFG.gravity * 0.5;

      if (this.y <= this.targetY) {
        this.explode();
        return true; // signal removal
      }
      return false;
    }

    explode () {
      for (let i = 0; i < CFG.particleCount; i++) {
        const angle = (Math.PI * 2 / CFG.particleCount) * i;
        const speed = rand(2.5, 9);
        particles.push(new Spark(
          this.x, this.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          this.color,
        ));
      }
      // A few random starburst sparks for texture
      for (let i = 0; i < 18; i++) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(1, 4);
        particles.push(new Spark(
          this.x, this.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          '#ffffff',
          true,  // sparkle flag
        ));
      }
    }

    draw () {
      // Trail
      this.trail.forEach((pt, i) => {
        const alpha = (i / this.trail.length) * 0.6;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Head
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  /* ── Spark (explosion particle) class ───────────────────── */
  class Spark {
    constructor (x, y, vx, vy, color, sparkle = false) {
      this.x       = x;
      this.y       = y;
      this.vx      = vx;
      this.vy      = vy;
      this.color   = color;
      this.sparkle = sparkle;
      this.alpha   = 1;
      this.radius  = sparkle ? rand(1.5, 3) : rand(2, 5);
      this.decay   = rand(0.012, 0.022);
    }

    update () {
      this.x     += this.vx;
      this.y     += this.vy;
      this.vy    += CFG.gravity;
      this.vx    *= CFG.friction;
      this.vy    *= CFG.friction;
      this.alpha -= this.decay;
      return this.alpha <= 0;  // true = remove
    }

    draw () {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();

      if (this.sparkle) {
        // Draw a small 4-point star
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      } else {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      }

      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = this.sparkle ? 8 : 14;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ── Launch a rocket ─────────────────────────────────────── */
  function launch (x) {
    if (fireworks.length < CFG.maxFireworks) {
      fireworks.push(new Rocket(x));
    }
  }

  /* ── Auto-launch loop ────────────────────────────────────── */
  function startLaunching () {
    launch();
    launchTimer = setInterval(() => {
      if (isVisible) launch();
    }, CFG.launchInterval);
  }

  /* ── Click / tap to launch at pointer ───────────────────── */
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    launch(e.clientX - rect.left);
  });

  /* ── Animation loop ──────────────────────────────────────── */
  function loop () {
    if (!isVisible) {
      animId = requestAnimationFrame(loop);
      return;
    }

    // Fade-trail effect (dark transparent rect instead of clearRect)
    ctx.fillStyle = 'rgba(13, 7, 32, 0.22)';
    ctx.fillRect(0, 0, W, H);

    // Update & draw rockets
    fireworks = fireworks.filter(fw => {
      const done = fw.update();
      if (!done) fw.draw();
      return !done;
    });

    // Update & draw particles
    particles = particles.filter(sp => {
      const done = sp.update();
      if (!done) sp.draw();
      return !done;
    });

    animId = requestAnimationFrame(loop);
  }

  /* ── Intersection Observer (pause when off-screen) ──────── */
  const observer = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0].isIntersecting;
    },
    { threshold: 0.1 },
  );
  observer.observe(canvas);

  /* ── Init ────────────────────────────────────────────────── */
  startLaunching();
  loop();

  // Kick off 3 quick bursts on page load
  setTimeout(() => launch(), 400);
  setTimeout(() => launch(), 900);
  setTimeout(() => launch(), 1500);

})();
