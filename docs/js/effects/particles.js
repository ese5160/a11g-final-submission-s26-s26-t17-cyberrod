/**
 * CyberRod IoT Network Visualization
 * Premium circuit-mesh particle system with organic flow,
 * depth layers, and real-time data pulse animations.
 */
export function initParticles() {
  const container = document.querySelector('.hero__particles');
  if (!container) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let W, H, animId, frame = 0;
  let nodes = [], dust = [], pulses = [], trails = [];
  let mouse = { x: null, y: null };
  const mouseSmooth = { x: null, y: null };
  const mouseVel = { x: 0, y: 0, prevX: null, prevY: null };

  // ── Color palette ──
  const C = {
    green:    { r: 109, g: 174, b: 69 },
    cyan:     { r: 56,  g: 189, b: 248 },
    blue:     { r: 99,  g: 102, b: 241 },
    white:    { r: 200, g: 220, b: 255 },
    mint:     { r: 74,  g: 222, b: 128 },
    amber:    { r: 251, g: 191, b: 36 },
  };

  // ── Pre-rendered sprite cache ──
  const sprites = new Map();

  function makeGlow(key, coreR, color, glowR, intensity = 1) {
    if (sprites.has(key)) return sprites.get(key);
    const cr = coreR * dpr, gr = glowR * dpr;
    const dim = Math.ceil(cr + gr * 2);
    const oc = document.createElement('canvas');
    oc.width = dim; oc.height = dim;
    const ox = oc.getContext('2d');
    const c = dim / 2;

    // Outer glow
    const glow = ox.createRadialGradient(c, c, 0, c, c, gr + cr / 2);
    glow.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${0.5 * intensity})`);
    glow.addColorStop(0.3, `rgba(${color.r},${color.g},${color.b},${0.15 * intensity})`);
    glow.addColorStop(0.7, `rgba(${color.r},${color.g},${color.b},${0.03 * intensity})`);
    glow.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
    ox.fillStyle = glow;
    ox.fillRect(0, 0, dim, dim);

    // Core with hot center
    const core = ox.createRadialGradient(c, c, 0, c, c, cr / 2);
    const bright = { r: Math.min(255, color.r + 140), g: Math.min(255, color.g + 140), b: Math.min(255, color.b + 140) };
    core.addColorStop(0, `rgba(${bright.r},${bright.g},${bright.b},0.95)`);
    core.addColorStop(0.4, `rgba(${color.r},${color.g},${color.b},0.6)`);
    core.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
    ox.beginPath();
    ox.arc(c, c, cr / 2, 0, Math.PI * 2);
    ox.fillStyle = core;
    ox.fill();

    const result = { canvas: oc, half: dim / 2 };
    sprites.set(key, result);
    return result;
  }

  function makeDust(key, r, color) {
    if (sprites.has(key)) return sprites.get(key);
    const s = r * dpr;
    const dim = Math.ceil(s * 4);
    const oc = document.createElement('canvas');
    oc.width = dim; oc.height = dim;
    const ox = oc.getContext('2d');
    const c = dim / 2;
    const g = ox.createRadialGradient(c, c, 0, c, c, s);
    g.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0.6)`);
    g.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},0.15)`);
    g.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
    ox.fillStyle = g;
    ox.fillRect(0, 0, dim, dim);
    const result = { canvas: oc, half: dim / 2 };
    sprites.set(key, result);
    return result;
  }

  // ── Resize ──
  function resize() {
    W = container.offsetWidth;
    H = container.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Flow field ── organic noise-driven angles
  function flowAngle(x, y, t) {
    const s = 0.0018;
    return (
      Math.sin(x * s + t * 0.00025) *
      Math.cos(y * s * 1.3 + t * 0.00035) *
      Math.PI * 1.2
    );
  }

  // ── Initialize ──
  function init() {
    resize();
    sprites.clear();

    // Node sprites — 3 types: sensor(green), processor(cyan), cloud(blue)
    makeGlow('sensor', 6, C.green, 30);
    makeGlow('proc', 5, C.cyan, 26);
    makeGlow('cloud', 4.5, C.blue, 22, 0.8);
    makeGlow('pulse-green', 2.5, C.mint, 14, 1.2);
    makeGlow('pulse-cyan', 2.5, C.cyan, 14, 1.2);
    makeGlow('pulse-blue', 2, C.blue, 12, 1);

    // Dust sprites
    makeDust('d1', 2, C.white);
    makeDust('d2', 1.5, C.cyan);
    makeDust('d3', 1, { r: 160, g: 180, b: 220 });

    // ── Create nodes ── stratified by depth layer
    const layerConfig = [
      { sprite: 'sensor', count: 12, speed: 0.1, size: 6, layer: 0 },
      { sprite: 'proc', count: 10, speed: 0.13, size: 5, layer: 1 },
      { sprite: 'cloud', count: 8, speed: 0.08, size: 4.5, layer: 2 },
    ];

    nodes = [];
    layerConfig.forEach(cfg => {
      for (let i = 0; i < cfg.count; i++) {
        nodes.push({
          x: 40 + Math.random() * (W - 80),
          y: 40 + Math.random() * (H - 80),
          vx: (Math.random() - 0.5) * cfg.speed,
          vy: (Math.random() - 0.5) * cfg.speed,
          sprite: cfg.sprite,
          layer: cfg.layer,
          phase: Math.random() * Math.PI * 2,
          brightness: 0,
          lastPulse: -6000 + Math.random() * 6000,
          baseSize: cfg.size,
        });
      }
    });

    // ── Dust / ambient particles ──
    dust = [];
    for (let i = 0; i < 80; i++) {
      dust.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        sprite: ['d1', 'd2', 'd3'][Math.floor(Math.random() * 3)],
        opacity: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        size: 0.5 + Math.random() * 1.5,
      });
    }

    pulses = [];
    trails = [];
  }

  // ── Connections ──
  const CONN_DIST = 240;
  const CONN_DIST_SQ = CONN_DIST * CONN_DIST;

  function getConnections() {
    const conns = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Prefer same-layer connections, but allow cross-layer
        const layerPenalty = Math.abs(nodes[i].layer - nodes[j].layer) * 40;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distSq = dx * dx + dy * dy;
        const threshold = CONN_DIST_SQ - layerPenalty * layerPenalty;
        if (distSq < threshold) {
          conns.push({ a: i, b: j, dist: Math.sqrt(distSq) });
        }
      }
    }
    return conns;
  }

  // ── Pulse spawning ──
  function spawnPulse(conn) {
    const a = nodes[conn.a], b = nodes[conn.b];
    const types = ['pulse-green', 'pulse-cyan', 'pulse-blue'];
    // Match pulse color to source node
    const sprite = a.sprite === 'sensor' ? types[0] : a.sprite === 'proc' ? types[1] : types[2];
    pulses.push({
      ax: a.x, ay: a.y, bx: b.x, by: b.y,
      progress: 0,
      speed: 0.006 + Math.random() * 0.008,
      sprite,
      trail: [],
    });
  }

  // ── Drawing ──

  function drawConnections(conns) {
    for (const c of conns) {
      const a = nodes[c.a], b = nodes[c.b];
      const alpha = (1 - c.dist / CONN_DIST);
      const layerAlpha = [0.12, 0.09, 0.06][(a.layer + b.layer) >> 1] || 0.08;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);

      // Slightly curved connections for organic feel
      const mx = (a.x + b.x) / 2 + Math.sin(frame * 0.003 + c.a) * 8;
      const my = (a.y + b.y) / 2 + Math.cos(frame * 0.003 + c.b) * 8;
      ctx.quadraticCurveTo(mx, my, b.x, b.y);

      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      const sa = alpha * layerAlpha;
      const colors = [
        [C.green, C.cyan],
        [C.cyan, C.blue],
        [C.blue, C.green],
      ];
      const pair = colors[(a.layer + b.layer) % 3];
      grad.addColorStop(0, `rgba(${pair[0].r},${pair[0].g},${pair[0].b},${sa})`);
      grad.addColorStop(1, `rgba(${pair[1].r},${pair[1].g},${pair[1].b},${sa * 0.6})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.6 + alpha * 0.4;
      ctx.stroke();
    }
  }

  function drawMouseField() {
    if (mouseSmooth.x === null) return;
    const range = 280;
    for (const n of nodes) {
      const dx = n.x - mouseSmooth.x, dy = n.y - mouseSmooth.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < range) {
        const alpha = (1 - d / range) * 0.18;
        ctx.beginPath();
        ctx.moveTo(mouseSmooth.x, mouseSmooth.y);
        const mx = (mouseSmooth.x + n.x) / 2;
        const my = (mouseSmooth.y + n.y) / 2;
        ctx.quadraticCurveTo(
          mx + Math.sin(frame * 0.005) * 4,
          my + Math.cos(frame * 0.005) * 4,
          n.x, n.y
        );
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }

  function drawPulses() {
    for (const p of pulses) {
      const x = p.ax + (p.bx - p.ax) * p.progress;
      const y = p.ay + (p.by - p.ay) * p.progress;

      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        const ta = p.progress * 0.3;
        ctx.strokeStyle = `rgba(74,222,128,${ta})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const sp = sprites.get(p.sprite);
      if (sp) {
        ctx.globalAlpha = 0.8 + Math.sin(frame * 0.05) * 0.2;
        ctx.drawImage(sp.canvas, x - sp.half, y - sp.half);
        ctx.globalAlpha = 1;
      }
    }
  }

  function drawNode(n) {
    const sp = sprites.get(n.sprite);
    if (!sp) return;
    const pulse = Math.sin(n.phase + frame * 0.012) * 0.12 + 0.88;
    ctx.globalAlpha = pulse + n.brightness * 0.4;
    ctx.drawImage(sp.canvas, n.x - sp.half, n.y - sp.half);
    ctx.globalAlpha = 1;
  }

  function drawDust(d) {
    const sp = sprites.get(d.sprite);
    if (!sp) return;
    const breathe = Math.sin(d.phase + frame * 0.008) * 0.2 + 0.8;
    ctx.globalAlpha = d.opacity * breathe;
    const scale = d.size;
    const w = sp.canvas.width / dpr;
    const h = sp.canvas.height / dpr;
    ctx.drawImage(sp.canvas, d.x - w * scale / 2, d.y - h * scale / 2, w * scale, h * scale);
    ctx.globalAlpha = 1;
  }

  function drawWaveOverlay() {
    // Subtle energy waves at bottom
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 3) {
        const y = H - 30 - layer * 12
          + Math.sin(x * 0.004 + frame * 0.004 + layer * 2) * 8
          + Math.sin(x * 0.007 + frame * 0.007 + layer * 0.5) * 4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const colors = [
        `rgba(109,174,69,${0.012 - layer * 0.003})`,
        `rgba(56,189,248,${0.008 - layer * 0.002})`,
        `rgba(99,102,241,${0.006 - layer * 0.002})`,
      ];
      ctx.fillStyle = colors[layer] || colors[2];
      ctx.fill();
    }
  }

  function drawScanLine() {
    // Horizontal scan line moving down — tech feel
    const period = 400;
    const scanY = (frame % period) / period * (H + 100) - 50;
    const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    grad.addColorStop(0, 'rgba(56,189,248,0)');
    grad.addColorStop(0.5, 'rgba(56,189,248,0.015)');
    grad.addColorStop(1, 'rgba(56,189,248,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 30, W, 60);
  }

  function drawVignette() {
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.8);
    grad.addColorStop(0, 'rgba(3,11,26,0)');
    grad.addColorStop(0.6, 'rgba(3,11,26,0.1)');
    grad.addColorStop(1, 'rgba(3,11,26,0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Update loop ──
  function update() {
    frame++;

    // Smooth mouse
    if (mouse.x !== null) {
      if (mouseSmooth.x === null) {
        mouseSmooth.x = mouse.x;
        mouseSmooth.y = mouse.y;
      } else {
        mouseSmooth.x += (mouse.x - mouseSmooth.x) * 0.08;
        mouseSmooth.y += (mouse.y - mouseSmooth.y) * 0.08;
      }
      if (mouseVel.prevX !== null) {
        mouseVel.x = mouse.x - mouseVel.prevX;
        mouseVel.y = mouse.y - mouseVel.prevY;
      }
      mouseVel.prevX = mouse.x;
      mouseVel.prevY = mouse.y;
    }

    // Move nodes
    for (const n of nodes) {
      const angle = flowAngle(n.x, n.y, frame);
      n.vx += Math.cos(angle) * 0.004;
      n.vy += Math.sin(angle) * 0.004;

      // Damping
      n.vx *= 0.985;
      n.vy *= 0.985;

      // Mouse interaction — attraction + repulsion zone
      n.brightness *= 0.93;
      if (mouseSmooth.x !== null) {
        const dx = n.x - mouseSmooth.x;
        const dy = n.y - mouseSmooth.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 280 && d > 0) {
          n.brightness = Math.max(n.brightness, 1 - d / 280);
          // Repulsion at close range, gentle attraction at medium
          const force = d < 100 ? 0.025 : -0.005;
          n.vx += (dx / d) * force;
          n.vy += (dy / d) * force;
        }
      }

      n.x += n.vx;
      n.y += n.vy;

      // Soft wrap at edges
      const margin = 30;
      if (n.x < -margin) n.x = W + margin;
      if (n.x > W + margin) n.x = -margin;
      if (n.y < -margin) n.y = H + margin;
      if (n.y > H + margin) n.y = -margin;
    }

    // Move dust
    for (const d of dust) {
      const angle = flowAngle(d.x + 150, d.y + 150, frame * 0.7);
      d.vx += Math.cos(angle) * 0.002;
      d.vy += Math.sin(angle) * 0.002;
      d.vx *= 0.99;
      d.vy *= 0.99;
      d.x += d.vx;
      d.y += d.vy;

      if (mouseSmooth.x !== null) {
        const dx = d.x - mouseSmooth.x;
        const dy = d.y - mouseSmooth.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          d.vx += (dx / dist) * 0.04;
          d.vy += (dy / dist) * 0.04;
        }
      }

      const pad = 15;
      if (d.x < -pad) d.x = W + pad;
      if (d.x > W + pad) d.x = -pad;
      if (d.y < -pad) d.y = H + pad;
      if (d.y > H + pad) d.y = -pad;
    }

    // Pulse logic
    const conns = getConnections();
    // Spawn pulses more frequently for visual richness
    if (frame % 40 === 0 && conns.length > 0) {
      const c = conns[Math.floor(Math.random() * conns.length)];
      spawnPulse(c);
    }

    // Update pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.progress += p.speed;

      // Store trail points
      const px = p.ax + (p.bx - p.ax) * p.progress;
      const py = p.ay + (p.by - p.ay) * p.progress;
      p.trail.push({ x: px, y: py });
      if (p.trail.length > 8) p.trail.shift();

      if (p.progress >= 1 || pulses.length > 25) {
        pulses.splice(i, 1);
      }
    }
  }

  // ── Render ──
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const conns = getConnections();

    // Additive blending for glow layers
    ctx.globalCompositeOperation = 'screen';

    drawWaveOverlay();
    drawScanLine();
    drawConnections(conns);
    drawMouseField();
    dust.forEach(drawDust);

    // Draw nodes sorted by layer for depth
    const sorted = [...nodes].sort((a, b) => a.layer - b.layer);
    sorted.forEach(drawNode);
    drawPulses();

    ctx.globalCompositeOperation = 'source-over';
    drawVignette();

    update();
    animId = requestAnimationFrame(draw);
  }

  // ── Events ──
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  container.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else if (!prefersReduced) draw();
  });

  window.addEventListener('resize', () => {
    resize();
    for (const n of nodes) {
      if (n.x > W) n.x = W - 30;
      if (n.y > H) n.y = H - 30;
    }
    for (const d of dust) {
      if (d.x > W) d.x = W - 15;
      if (d.y > H) d.y = H - 15;
    }
  });

  init();

  if (prefersReduced) {
    const conns = getConnections();
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';
    drawConnections(conns);
    dust.forEach(d => {
      const sp = sprites.get(d.sprite);
      if (sp) ctx.drawImage(sp.canvas, d.x - sp.half, d.y - sp.half);
    });
    nodes.forEach(n => {
      const sp = sprites.get(n.sprite);
      if (sp) ctx.drawImage(sp.canvas, n.x - sp.half, n.y - sp.half);
    });
    ctx.globalCompositeOperation = 'source-over';
    drawVignette();
  } else {
    draw();
  }
}
