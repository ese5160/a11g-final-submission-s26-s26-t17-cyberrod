/**
 * IoT Sensor Probe Cursor — themed cursor matching the particle system's
 * visual language: green = sensor node, sky blue = signal/connection.
 *
 * Elements: core dot, sonar ring, trail (3 dots), click ripple.
 * Features: luminance-based color adaptation, elastic easing, theme API.
 * Performance: dirty flag, cached rects, passive listeners, throttled sampling.
 */
export function initCustomCursor() {
  if ('ontouchstart' in window || window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── Color palette ──────────────────────────────────────────────
  const GREEN  = '109,174,69';
  const SKY    = '100,200,255';
  const MINT   = '74,222,128';
  const PURPLE = '168,85,247';
  const SLATE  = '226,232,240';

  const THEMES = {
    green:  { core: GREEN,  ring: GREEN,  trail: MINT },
    sky:    { core: SKY,    ring: SKY,    trail: SKY },
    purple: { core: PURPLE, ring: PURPLE, trail: PURPLE },
    slate:  { core: SLATE,  ring: SLATE,  trail: MINT },
  };

  const PAGE_DEFAULTS = {
    home:         'green',
    architecture: 'green',
    demo:         'sky',
    software:     'sky',
    team:         'slate',
    hardware:     'green',
  };

  // ── State ──────────────────────────────────────────────────────
  let currentThemeKey = 'auto';
  let activeColors = { core: GREEN, ring: GREEN, trail: MINT };
  let lastLuminanceTime = 0;
  const LUMINANCE_INTERVAL = 200;

  // ── Helpers ────────────────────────────────────────────────────
  function el(css, parent = document.body) {
    const d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = css;
    parent.appendChild(d);
    return d;
  }

  function lerp(cur, target, f) {
    return cur + (target - cur) * f;
  }

  function parseRGB(str) {
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }

  function relativeLuminance(r, g, b) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  // ── Luminance sampling ─────────────────────────────────────────
  function sampleLuminance(x, y) {
    const elUnder = document.elementFromPoint(x, y);
    if (!elUnder) return;
    const cs = getComputedStyle(elUnder);
    const rgb = parseRGB(cs.backgroundColor);
    if (!rgb) return;
    const L = relativeLuminance(rgb[0], rgb[1], rgb[2]);
    const newKey = L > 0.5 ? 'green' : 'sky';
    if (newKey !== currentThemeKey) {
      currentThemeKey = newKey;
      applyTheme(THEMES[newKey]);
    }
  }

  // ── Theme application ─────────────────────────────────────────
  function applyTheme(theme) {
    activeColors = theme;
    if (state.hovering) return; // don't override hover colors
    setCoreColor(theme.core);
    setRingColor(theme.ring);
    setTrailColor(theme.trail);
  }

  function setCoreColor(color) {
    core.style.background = `rgba(${color},0.9)`;
    core.style.boxShadow = `0 0 12px rgba(${color},0.5),0 0 28px rgba(${color},0.2)`;
  }

  function setRingColor(color) {
    ring.style.borderColor = `rgba(${color},0.35)`;
  }

  function setTrailColor(color) {
    trails.forEach((t, i) => {
      t.style.background = `rgba(${color},${TRAIL_OPAC[i]})`;
    });
  }

  // ── Public theme API ──────────────────────────────────────────
  function updateCursorTheme(themeKey) {
    if (themeKey === 'auto') {
      currentThemeKey = 'auto';
      lastLuminanceTime = 0; // force re-sample on next move
      const page = document.documentElement.dataset.page;
      const fallback = PAGE_DEFAULTS[page] || 'green';
      applyTheme(THEMES[fallback]);
      return;
    }
    const theme = THEMES[themeKey];
    if (!theme) return;
    currentThemeKey = themeKey;
    applyTheme(theme);
  }

  window.__updateCursorTheme = updateCursorTheme;

  // ── DOM elements ───────────────────────────────────────────────

  // Core: glowing sensor dot (12px)
  const core = el(`
    position:fixed;top:0;left:0;width:12px;height:12px;border-radius:50%;
    background:rgba(${GREEN},0.9);pointer-events:none;z-index:99999;
    box-shadow:0 0 12px rgba(${GREEN},0.5),0 0 28px rgba(${GREEN},0.2);
    will-change:transform;opacity:0;
    transition:width .25s,height .25s,background .25s,box-shadow .25s,opacity .3s;
  `);

  // Sonar ring: continuous pulse (48px, elastic easing)
  const ring = el(`
    position:fixed;top:0;left:0;width:48px;height:48px;border-radius:50%;
    border:1.5px solid rgba(${GREEN},0.35);pointer-events:none;z-index:99998;
    will-change:transform,opacity;opacity:0;
    transition:width .35s cubic-bezier(0.34,1.56,0.64,1),
               height .35s cubic-bezier(0.34,1.56,0.64,1),
               border-color .3s,opacity .3s;
    animation:probePulse 2.4s ease-in-out infinite;
  `);

  // Trail: 3 data-stream dots with staggered opacity
  const TRAIL_LERPS  = [0.10, 0.06, 0.035];
  const TRAIL_OPAC   = [0.45, 0.22, 0.10];
  const TRAIL_SIZE   = [6, 5, 3];
  const trails = TRAIL_LERPS.map((_, i) => el(`
    position:fixed;top:0;left:0;width:${TRAIL_SIZE[i]}px;height:${TRAIL_SIZE[i]}px;
    border-radius:50%;background:rgba(${MINT},${TRAIL_OPAC[i]});
    pointer-events:none;z-index:99997;will-change:transform;opacity:0;
    transition:opacity .4s;
  `));

  // Hide native cursor
  document.documentElement.classList.add('custom-cursor-active');

  // ── Cursor tracking state ──────────────────────────────────────
  const state = {
    mx: 0, my: 0,
    cx: 0, cy: 0,
    rx: 0, ry: 0,
    tx: [], ty: [],
    visible: false,
    hovering: false,
    dirty: false,
  };
  state.tx = TRAIL_LERPS.map(() => 0);
  state.ty = TRAIL_LERPS.map(() => 0);

  // ── Magnetic elements cache ────────────────────────────────────
  let magEls = [];
  let magRects = [];

  function cacheMagnetics() {
    magEls = Array.from(document.querySelectorAll('.btn, .nav__link'));
    magRects = magEls.map(e => e.getBoundingClientRect());
  }
  cacheMagnetics();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(cacheMagnetics, 200);
  }, { passive: true });

  // ── Animation loop ─────────────────────────────────────────────
  let animating = false;

  document.addEventListener('mousemove', (e) => {
    state.mx = e.clientX;
    state.my = e.clientY;
    state.dirty = true;

    // Luminance sampling (throttled)
    const now = performance.now();
    if (currentThemeKey === 'auto' && now - lastLuminanceTime > LUMINANCE_INTERVAL) {
      lastLuminanceTime = now;
      sampleLuminance(e.clientX, e.clientY);
    }

    if (!animating) {
      animating = true;
      requestAnimationFrame(animate);
    }
    if (!state.visible) {
      state.visible = true;
      core.style.opacity = '1';
      ring.style.opacity = '1';
      trails.forEach(t => t.style.opacity = '1');
    }
  }, { passive: true });

  // ── Hover detection (expanded selector) ────────────────────────
  const hoverSel = '.btn, .card, .nav__link, .card__icon, a, button, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) {
      state.hovering = true;
      ring.style.width = '64px';
      ring.style.height = '64px';
      ring.style.borderColor = `rgba(${SKY},0.3)`;
      core.style.width = '14px';
      core.style.height = '14px';
      core.style.background = `rgba(${SKY},0.85)`;
      core.style.boxShadow = `0 0 14px rgba(${SKY},0.5),0 0 30px rgba(${SKY},0.2)`;
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSel)) {
      state.hovering = false;
      ring.style.width = '48px';
      ring.style.height = '48px';
      setRingColor(activeColors.ring);
      core.style.width = '12px';
      core.style.height = '12px';
      setCoreColor(activeColors.core);
    }
  }, { passive: true });

  // ── Click ripple (Web Animations API) ──────────────────────────
  document.addEventListener('click', (e) => {
    const burst = el(`
      position:fixed;top:${e.clientY}px;left:${e.clientX}px;
      width:1px;height:1px;border-radius:50%;
      border:1.5px solid rgba(${GREEN},0.6);
      pointer-events:none;z-index:99996;
      transform:translate(-50%,-50%);opacity:0.6;
    `);
    burst.animate([
      { transform: 'translate(-50%,-50%) scale(0)', opacity: 0.6 },
      { transform: 'translate(-50%,-50%) scale(50)', opacity: 0 },
    ], { duration: 500, easing: 'ease-out', fill: 'forwards' })
      .onfinish = () => burst.remove();
  }, { passive: true });

  // ── Mouse leave / enter ────────────────────────────────────────
  document.documentElement.addEventListener('mouseleave', () => {
    state.visible = false;
    core.style.opacity = '0';
    ring.style.opacity = '0';
    trails.forEach(t => t.style.opacity = '0');
  });

  document.documentElement.addEventListener('mouseenter', () => {
    state.visible = true;
    core.style.opacity = '1';
    ring.style.opacity = '1';
    trails.forEach(t => t.style.opacity = '1');
  });

  // ── Main animation frame ───────────────────────────────────────
  let prevMagIdx = -1;

  function animate() {
    if (!state.dirty) {
      animating = false;
      return;
    }
    state.dirty = false;

    state.cx = lerp(state.cx, state.mx, 0.25);
    state.cy = lerp(state.cy, state.my, 0.25);
    state.rx = lerp(state.rx, state.mx, 0.12);
    state.ry = lerp(state.ry, state.my, 0.12);

    for (let i = 0; i < TRAIL_LERPS.length; i++) {
      const prev = i === 0 ? state.mx : state.tx[i - 1];
      const prevY = i === 0 ? state.my : state.ty[i - 1];
      state.tx[i] = lerp(state.tx[i], prev, TRAIL_LERPS[i]);
      state.ty[i] = lerp(state.ty[i], prevY, TRAIL_LERPS[i]);
    }

    const cw = parseFloat(core.style.width) || 12;
    core.style.transform = `translate3d(${state.cx - cw / 2}px,${state.cy - cw / 2}px,0)`;
    ring.style.left = `${state.rx}px`;
    ring.style.top = `${state.ry}px`;

    for (let i = 0; i < trails.length; i++) {
      const s = TRAIL_SIZE[i];
      trails[i].style.transform = `translate3d(${state.tx[i] - s / 2}px,${state.ty[i] - s / 2}px,0)`;
    }

    // Magnetic pull on interactive elements
    let magIdx = -1;
    for (let i = 0; i < magRects.length; i++) {
      const r = magRects[i];
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = state.mx - cx;
      const dy = state.my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        magIdx = i;
        magEls[i].style.transform = `translate(${dx * 0.25}px,${dy * 0.25}px)`;
        break;
      }
    }
    if (magIdx === -1 && prevMagIdx !== -1 && magEls[prevMagIdx]) {
      magEls[prevMagIdx].style.transform = 'translate(0,0)';
    }
    prevMagIdx = magIdx;

    if (state.dirty) {
      requestAnimationFrame(animate);
    } else {
      const coreDelta = Math.abs(state.cx - state.mx) + Math.abs(state.cy - state.my);
      const ringDelta = Math.abs(state.rx - state.mx) + Math.abs(state.ry - state.my);
      if (coreDelta > 0.5 || ringDelta > 0.5) {
        state.dirty = true;
        requestAnimationFrame(animate);
      } else {
        animating = false;
      }
    }
  }

  requestAnimationFrame(animate);
}
