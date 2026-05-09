/**
 * Custom cursor with magnetic effect.
 * Performance: caches element rects, uses dirty flag, no per-frame layout reads.
 */
export function initCustomCursor() {
  if ('ontouchstart' in window || window.innerWidth < 768) return;

  const outer = document.createElement('div');
  outer.setAttribute('aria-hidden', 'true');
  outer.style.cssText = `
    position:fixed;top:0;left:0;width:40px;height:40px;border-radius:50%;
    border:1.5px solid rgba(109,174,69,0.4);pointer-events:none;z-index:99999;
    mix-blend-mode:difference;will-change:transform;opacity:0;
    transition:width .3s,height .3s,border-color .3s,background .3s,opacity .3s;
  `;

  const inner = document.createElement('div');
  inner.setAttribute('aria-hidden', 'true');
  inner.style.cssText = `
    position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;
    background:rgba(109,174,69,0.8);pointer-events:none;z-index:99999;
    mix-blend-mode:difference;will-change:transform;opacity:0;
    transition:width .25s,height .25s,opacity .3s;
  `;

  document.body.appendChild(outer);
  document.body.appendChild(inner);

  // Hide native cursor via CSS class (avoids inline * selector perf hit)
  document.documentElement.classList.add('custom-cursor-active');

  const state = {
    mx: 0, my: 0,
    ox: 0, oy: 0,
    ix: 0, iy: 0,
    visible: false,
    hovering: false,
    dirty: false,
  };

  // Cache magnetic elements and their rects
  let magneticEls = [];
  let cachedRects = [];

  function cacheMagnetics() {
    magneticEls = Array.from(document.querySelectorAll('.btn, .nav__link'));
    cachedRects = magneticEls.map(el => el.getBoundingClientRect());
  }

  cacheMagnetics();

  // Recalculate rects on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(cacheMagnetics, 200);
  }, { passive: true });

  function lerp(cur, target, f) {
    return cur + (target - cur) * f;
  }

  document.addEventListener('mousemove', (e) => {
    state.mx = e.clientX;
    state.my = e.clientY;
    state.dirty = true;
    if (!state.visible) {
      state.visible = true;
      outer.style.opacity = '1';
      inner.style.opacity = '1';
    }
  }, { passive: true });

  const hoverSelectors = 'a, button, .card, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      state.hovering = true;
      outer.style.width = '60px';
      outer.style.height = '60px';
      outer.style.borderColor = 'rgba(109,174,69,0.25)';
      outer.style.background = 'rgba(109,174,69,0.08)';
      inner.style.width = '6px';
      inner.style.height = '6px';
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      state.hovering = false;
      outer.style.width = '40px';
      outer.style.height = '40px';
      outer.style.borderColor = 'rgba(109,174,69,0.4)';
      outer.style.background = 'transparent';
      inner.style.width = '8px';
      inner.style.height = '8px';
    }
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    state.visible = false;
    outer.style.opacity = '0';
    inner.style.opacity = '0';
  });

  document.documentElement.addEventListener('mouseenter', () => {
    state.visible = true;
    outer.style.opacity = '1';
    inner.style.opacity = '1';
  });

  let prevMagnetIdx = -1;

  function animate() {
    // Only run when mouse has moved
    if (!state.dirty) {
      requestAnimationFrame(animate);
      return;
    }
    state.dirty = false;

    state.ox = lerp(state.ox, state.mx, 0.12);
    state.oy = lerp(state.oy, state.my, 0.12);
    state.ix = lerp(state.ix, state.mx, 0.2);
    state.iy = lerp(state.iy, state.my, 0.2);

    const ow = parseFloat(outer.style.width) || 40;
    const iw = parseFloat(inner.style.width) || 8;
    outer.style.transform = `translate3d(${state.ox - ow / 2}px,${state.oy - ow / 2}px,0)`;
    inner.style.transform = `translate3d(${state.ix - iw / 2}px,${state.iy - iw / 2}px,0)`;

    // Magnetic check using cached rects (no layout thrash)
    let magnetIdx = -1;
    for (let i = 0; i < cachedRects.length; i++) {
      const r = cachedRects[i];
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = state.mx - cx;
      const dy = state.my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        magnetIdx = i;
        const el = magneticEls[i];
        el.style.transform = `translate(${dx * 0.25}px,${dy * 0.25}px)`;
        break;
      }
    }

    if (magnetIdx === -1 && prevMagnetIdx !== -1 && magneticEls[prevMagnetIdx]) {
      magneticEls[prevMagnetIdx].style.transform = 'translate(0,0)';
    }
    prevMagnetIdx = magnetIdx;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
