/**
 * CyberRod IoT Sensor Network Visualization
 * Multi-theme configurable particle engine.
 * Themes: home | default | architecture | hardware | software | demo | team
 * Quality tiers: desktop-hi | desktop | mobile
 */

// ── Color constants ──────────────────────────────────────────────
const C = {
  green: { r: 109, g: 174, b: 69 },
  cyan:  { r: 56,  g: 189, b: 248 },
  blue:  { r: 99,  g: 102, b: 241 },
  white: { r: 220, g: 235, b: 255 },
  red:   { r: 220, g: 50,  b: 50 },
  gray:  { r: 160, g: 175, b: 195 },
};

// ── Theme configs ────────────────────────────────────────────────
const THEMES = {
  home: {
    nodeCounts: [22, 12, 6],
    signal: {
      amplitude: 6,
      layers: [
        { freq: 0.02,  amp: 1.0 },
        { freq: 0.034, amp: 0.7 },
        { freq: 0.046, amp: 0.5 },
      ],
    },
    pcbJogChance: 0.25,
    vignetteStrength: 0.35,
    dataLabels: {
      enabled: true,
      items: [
        'T: 24.3°C', 'D: 127mm', 'H: 68%',
        'V: 3.31V', 'P: 1013hPa', 'R: 47kΩ',
        'L: 82dB', 'S: 2.4GHz',
      ],
    },
    gridColor: 'rgba(56,189,248,0.08)',
    gridViaColor: 'rgba(56,189,248,0.15)',
    connAlpha: 0.45,
    connWidth: 0.7,
    nodeColors: { sensor: C.green, processor: C.cyan, cloud: C.blue },
    ripple: false,
  },
  default: {
    nodeCounts: [17, 9, 4],
    signal: {
      amplitude: 3,
      layers: [{ freq: 0.02, amp: 1.0 }],
    },
    pcbJogChance: 0.15,
    vignetteStrength: 0.25,
    dataLabels: { enabled: false, items: [] },
    gridColor: 'rgba(56,189,248,0.08)',
    gridViaColor: 'rgba(56,189,248,0.15)',
    connAlpha: 0.45,
    connWidth: 0.7,
    nodeColors: { sensor: C.green, processor: C.cyan, cloud: C.blue },
    ripple: false,
  },
  architecture: {
    nodeCounts: [8, 4, 0],
    signal: { amplitude: 0, layers: [] },
    pcbJogChance: 0,
    vignetteStrength: 0.15,
    dataLabels: { enabled: false, items: [] },
    gridColor: 'rgba(160,175,195,0.12)',
    gridViaColor: 'rgba(160,175,195,0.18)',
    connAlpha: 0.3,
    connWidth: 0.5,
    nodeColors: { sensor: C.blue, processor: C.gray, cloud: C.blue },
    ripple: false,
    speedScale: 0.4,
  },
  hardware: {
    nodeCounts: [8, 4, 0],
    signal: {
      amplitude: 4,
      layers: [{ freq: 0.015, amp: 1.0 }, { freq: 0.03, amp: 0.5 }],
    },
    pcbJogChance: 0.2,
    vignetteStrength: 0.2,
    dataLabels: {
      enabled: true,
      items: ['3.3V', 'GND', 'SDA', 'SCL', 'TX', 'RX', 'GPIO2', 'PWM'],
    },
    gridColor: 'rgba(0,220,180,0.05)',
    gridViaColor: 'rgba(0,220,180,0.1)',
    connAlpha: 0.3,
    connWidth: 0.5,
    nodeColors: { sensor: C.green, processor: C.cyan, cloud: C.green },
    ripple: false,
    speedScale: 0.5,
    signalColor: 'rgba(109,174,69,0.15)',
  },
  software: {
    nodeCounts: [10, 5, 0],
    signal: {
      amplitude: 5,
      layers: [{ freq: 0.018, amp: 1.0 }, { freq: 0.04, amp: 0.6 }],
    },
    pcbJogChance: 0.1,
    vignetteStrength: 0.2,
    dataLabels: {
      enabled: true,
      items: ['Task 1', 'Task 2', 'MQTT', 'OTA', 'Queue', 'ISR', 'ADC', 'SPI'],
    },
    gridColor: 'rgba(56,189,248,0.04)',
    gridViaColor: 'rgba(56,189,248,0.08)',
    connAlpha: 0.35,
    connWidth: 0.5,
    nodeColors: { sensor: C.cyan, processor: C.blue, cloud: C.cyan },
    ripple: false,
    speedScale: 0.6,
    signalColor: 'rgba(56,189,248,0.12)',
  },
  demo: {
    nodeCounts: [5, 3, 0],
    signal: { amplitude: 0, layers: [] },
    pcbJogChance: 0,
    vignetteStrength: 0.25,
    dataLabels: { enabled: false, items: [] },
    gridColor: 'rgba(220,50,50,0.03)',
    gridViaColor: 'rgba(220,50,50,0.06)',
    connAlpha: 0.25,
    connWidth: 0.4,
    nodeColors: { sensor: C.red, processor: C.red, cloud: C.red },
    ripple: true,
    speedScale: 0.6,
  },
  team: {
    nodeCounts: [4, 2, 0],
    signal: { amplitude: 0, layers: [] },
    pcbJogChance: 0,
    vignetteStrength: 0.1,
    dataLabels: { enabled: false, items: [] },
    gridColor: 'rgba(1,31,91,0.06)',
    gridViaColor: 'rgba(1,31,91,0.1)',
    connAlpha: 0.15,
    connWidth: 0.3,
    nodeColors: { sensor: C.blue, processor: C.blue, cloud: C.blue },
    ripple: false,
    speedScale: 0.25,
    nodeAlpha: 0.2,
  },
};

// ── Quality presets ──────────────────────────────────────────────
const QUALITY = {
  'desktop-hi': { level: 0.7, nodeScale: 0.7, signal: true,  vignette: true  },
  desktop:      { level: 1.0, nodeScale: 1.0, signal: true,  vignette: true  },
  mobile:       { level: 0.4, nodeScale: 0.5, signal: false, vignette: false },
};

function detectQuality() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) return 'mobile';
  const dpr = window.devicePixelRatio || 1;
  return dpr > 2 ? 'desktop-hi' : 'desktop';
}

// ── Module state ─────────────────────────────────────────────────
let _canvas, _ctx, _container;
let _W, _H, _animId, _frame = 0;
let _nodes = [], _pulses = [], _cachedConns = [];
let _mouse = { x: null, y: null };
let _mouseSmooth = { x: null, y: null };
let _avgFrameTime = 16.67, _qualityLevel = 1.0, _lastFrameTime = performance.now();
let _pcbCanvas = null, _pcbOffsetX = 0, _pcbOffsetY = 0;
let _sprites = new Map();
let _prefersReduced = false;
let _dpr = 1;
let _theme = null;
let _selector = '.hero__particles';
let _qualityKey = 'desktop';
let _quality = QUALITY.desktop;
let _themeConfig = THEMES.default;
let _dataLabels = [];      // floating label positions
let _dataLabelPhase = 0;
let _ripples = [];          // demo theme ripple rings
let _boundMouseMove, _boundMouseLeave, _boundVisibility, _boundResize;
const PI2 = Math.PI * 2;

// ── Sprite helpers ───────────────────────────────────────────────
function makeSquareSprite(key, coreSize, color, glowSize, intensity) {
  if (_sprites.has(key)) return _sprites.get(key);
  const cs = coreSize * _dpr, gs = glowSize * _dpr;
  const dim = Math.ceil(cs + gs * 2);
  const oc = document.createElement('canvas');
  oc.width = dim; oc.height = dim;
  const ox = oc.getContext('2d');
  const c = dim / 2;
  ox.fillStyle = `rgba(${color.r},${color.g},${color.b},${0.15 * intensity})`;
  ox.fillRect(c - gs, c - gs, gs * 2, gs * 2);
  ox.fillStyle = `rgba(${color.r},${color.g},${color.b},${0.25 * intensity})`;
  const mid = gs * 0.5;
  ox.fillRect(c - mid, c - mid, mid * 2, mid * 2);
  const bright = { r: Math.min(255, color.r + 100), g: Math.min(255, color.g + 100), b: Math.min(255, color.b + 100) };
  ox.fillStyle = `rgba(${bright.r},${bright.g},${bright.b},${0.9 * intensity})`;
  const coreHalf = cs / 2;
  ox.fillRect(c - coreHalf, c - coreHalf, cs, cs);
  const result = { canvas: oc, half: dim / 2 };
  _sprites.set(key, result);
  return result;
}

function makePulseSprite(key, radius, color) {
  if (_sprites.has(key)) return _sprites.get(key);
  const r = radius * _dpr, dim = Math.ceil(r * 6);
  const oc = document.createElement('canvas');
  oc.width = dim; oc.height = dim;
  const ox = oc.getContext('2d');
  const c = dim / 2;
  const g = ox.createRadialGradient(c, c, 0, c, c, r * 2.5);
  g.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0.9)`);
  g.addColorStop(0.3, `rgba(${color.r},${color.g},${color.b},0.3)`);
  g.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
  ox.fillStyle = g;
  ox.fillRect(0, 0, dim, dim);
  ox.beginPath();
  ox.arc(c, c, r * 0.6, 0, PI2);
  ox.fillStyle = 'rgba(255,255,255,0.85)';
  ox.fill();
  const result = { canvas: oc, half: dim / 2 };
  _sprites.set(key, result);
  return result;
}

// ── Utility ──────────────────────────────────────────────────────
function fractalHash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  h = (h ^ (h >> 16)) | 0;
  return (h & 0x7fffffff) / 0x7fffffff;
}

function resize() {
  _W = _container.offsetWidth; _H = _container.offsetHeight;
  _canvas.width = _W * _dpr; _canvas.height = _H * _dpr;
  _ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);
  _pcbCanvas = null;
}

function makeNode(id, type, dirs) {
  return {
    x: 40 + Math.random() * Math.max(1, _W - 80),
    y: 40 + Math.random() * Math.max(1, _H - 80),
    vx: 0, vy: 0, type, id,
    dir: dirs[Math.floor(Math.random() * dirs.length)],
    dirCountdown: 200 + Math.random() * 200,
    fadeIn: 30, brightness: 0,
    phase: Math.random() * PI2,
  };
}

// ── Theme & node setup ───────────────────────────────────────────
function setupTheme(theme) {
  _theme = theme;
  _themeConfig = THEMES[theme] || THEMES.default;
  _qualityKey = detectQuality();
  _quality = QUALITY[_qualityKey];
  _qualityLevel = _quality.level;
}

function createNodes() {
  _sprites.clear();
  const nc = _themeConfig.nodeColors;
  makeSquareSprite('sensor', 3, nc.sensor || C.green, 12, 0.7);
  makeSquareSprite('processor', 4, nc.processor || C.cyan, 14, 0.7);
  makeSquareSprite('cloud', 5, nc.cloud || C.blue, 16, 0.6);
  makePulseSprite('pulse-green', 1.5, C.white);
  makePulseSprite('pulse-cyan', 1.5, C.cyan);

  const base = _themeConfig.nodeCounts;
  const scale = _quality.nodeScale;
  const sC = Math.max(2, Math.round(base[0] * scale));
  const pC = Math.max(1, Math.round(base[1] * scale));
  const cC = Math.max(1, Math.round(base[2] * scale));
  const dirs = [0, 45, 90, 135, 180, 225, 270, 315].map(d => d * Math.PI / 180);

  _nodes = [];
  for (let i = 0; i < sC; i++) _nodes.push(makeNode(i, 'sensor', dirs));
  for (let i = 0; i < pC; i++) _nodes.push(makeNode(sC + i, 'processor', dirs));
  for (let i = 0; i < cC; i++) _nodes.push(makeNode(sC + pC + i, 'cloud', dirs));
  _pulses = []; _cachedConns = [];

  // Floating data labels (HOME theme)
  _dataLabels = [];
  if (_themeConfig.dataLabels.enabled) {
    const items = _themeConfig.dataLabels.items;
    const count = Math.min(items.length, Math.max(3, Math.floor(_nodes.length * 0.3)));
    for (let i = 0; i < count; i++) {
      const n = _nodes[Math.floor(Math.random() * _nodes.length)];
      _dataLabels.push({
        text: items[i % items.length],
        anchorNode: _nodes.indexOf(n),
        offsetX: (Math.random() - 0.5) * 40,
        offsetY: -20 - Math.random() * 30,
        phase: Math.random() * PI2,
      });
    }
  }
}

// ── Draw layers ──────────────────────────────────────────────────

// L1: PCB Grid
function drawPCBGrid() {
  if (!_pcbCanvas) _pcbCanvas = document.createElement('canvas');
  _pcbCanvas.width = _W * _dpr; _pcbCanvas.height = _H * _dpr;
  const px = _pcbCanvas.getContext('2d');
  px.setTransform(_dpr, 0, 0, _dpr, 0, 0);
  const gs = 80;
  _pcbOffsetX = (_pcbOffsetX + 0.5) % gs;
  _pcbOffsetY = (_pcbOffsetY + 0.5) % gs;
  const ox = _pcbOffsetX, oy = _pcbOffsetY;
  px.lineWidth = 0.5;
  px.strokeStyle = _themeConfig.gridColor || 'rgba(56,189,248,0.08)';
  const jogChance = _themeConfig.pcbJogChance;
  const jogHigh = 1 - jogChance * 0.5;
  const jogLow = 1 - jogChance;

  // Horizontal lines with jogs
  for (let y = oy; y < _H; y += gs) {
    let x = ox;
    px.beginPath(); px.moveTo(x, y);
    while (x < _W) {
      const jog = fractalHash(Math.round(x), Math.round(y));
      if (jog > jogHigh) {
        const dir = jog > (jogHigh + jogChance * 0.25) ? 1 : -1, amt = 40 * dir;
        px.lineTo(x + gs * 0.3, y); px.lineTo(x + gs * 0.3, y + amt);
        px.lineTo(x + gs * 0.7, y + amt); px.lineTo(x + gs * 0.7, y);
        px.lineTo(x + gs, y);
      } else { px.lineTo(x + gs, y); }
      x += gs;
    }
    px.stroke();
  }
  // Vertical lines with jogs
  for (let x = ox; x < _W; x += gs) {
    let y = oy;
    px.beginPath(); px.moveTo(x, y);
    while (y < _H) {
      const jog = fractalHash(Math.round(x), Math.round(y));
      if (jog > jogHigh) {
        const dir = jog > (jogHigh + jogChance * 0.25) ? 1 : -1, amt = 40 * dir;
        px.lineTo(x, y + gs * 0.3); px.lineTo(x + amt, y + gs * 0.3);
        px.lineTo(x + amt, y + gs * 0.7); px.lineTo(x, y + gs * 0.7);
        px.lineTo(x, y + gs);
      } else { px.lineTo(x, y + gs); }
      y += gs;
    }
    px.stroke();
  }
  // Via pads
  px.fillStyle = _themeConfig.gridViaColor || 'rgba(56,189,248,0.15)';
  for (let gx = ox; gx < _W; gx += gs) {
    for (let gy = oy; gy < _H; gy += gs) {
      if (fractalHash(Math.round(gx / gs), Math.round(gy / gs)) < 0.30)
        px.fillRect(gx - 1.5, gy - 1.5, 3, 3);
    }
  }
}

// L2: Connections
const CONN_DIST = 280, CONN_DIST_SQ = CONN_DIST * CONN_DIST;

function getConnections() {
  const conns = [];
  for (let i = 0; i < _nodes.length; i++) {
    for (let j = i + 1; j < _nodes.length; j++) {
      const dx = _nodes[i].x - _nodes[j].x, dy = _nodes[i].y - _nodes[j].y;
      const distSq = dx * dx + dy * dy;
      if (distSq < CONN_DIST_SQ) conns.push({ a: i, b: j, dist: Math.sqrt(distSq) });
    }
  }
  return conns;
}

function drawOrthLine(cx, ax, ay, bx, by) {
  const dx = Math.abs(bx - ax), dy = Math.abs(by - ay);
  if (dx > dy * 2 || dy > dx * 2) { cx.moveTo(ax, ay); cx.lineTo(bx, by); }
  else { cx.moveTo(ax, ay); cx.lineTo(bx, ay); cx.lineTo(bx, by); }
}

function nodeColor(t) {
  const nc = _themeConfig.nodeColors || { sensor: C.green, processor: C.cyan, cloud: C.blue };
  return nc[t] || nc.sensor;
}

function drawConnections(conns) {
  const tAlpha = _themeConfig.connAlpha || 0.45;
  const tWidth = _themeConfig.connWidth || 0.7;
  for (const c of conns) {
    const a = _nodes[c.a], b = _nodes[c.b];
    const alpha = (1 - c.dist / CONN_DIST) * tAlpha;
    _ctx.beginPath();
    drawOrthLine(_ctx, a.x, a.y, b.x, b.y);
    const cA = nodeColor(a.type), cB = nodeColor(b.type);
    const grad = _ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, `rgba(${cA.r},${cA.g},${cA.b},${alpha})`);
    grad.addColorStop(1, `rgba(${cB.r},${cB.g},${cB.b},${alpha * 0.85})`);
    _ctx.strokeStyle = grad;
    _ctx.lineWidth = tWidth + (1 - c.dist / CONN_DIST) * 0.3;
    _ctx.stroke();
  }
}

// L3: Mouse field
function drawMouseField() {
  if (_mouseSmooth.x === null) return;
  for (let i = 0; i < _nodes.length; i++) {
    const n = _nodes[i];
    const dx = n.x - _mouseSmooth.x, dy = n.y - _mouseSmooth.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 200 && d > 0) {
      _ctx.beginPath();
      _ctx.moveTo(_mouseSmooth.x, _mouseSmooth.y);
      _ctx.lineTo(n.x, n.y);
      _ctx.strokeStyle = `rgba(56,189,248,${(1 - d / 200) * 0.08})`;
      _ctx.lineWidth = 0.4;
      _ctx.stroke();
    }
  }
}

// L4: Pulses
function spawnPulse(conn) {
  _pulses.push({
    nodeA: conn.a, nodeB: conn.b, progress: 0,
    speed: 0.008 + Math.random() * 0.007,
    sprite: Math.random() > 0.5 ? 'pulse-green' : 'pulse-cyan',
    trail: [],
  });
}

function drawPulses() {
  for (const p of _pulses) {
    const a = _nodes[p.nodeA], b = _nodes[p.nodeB];
    const px = a.x + (b.x - a.x) * p.progress;
    const py = a.y + (b.y - a.y) * p.progress;
    if (p.trail.length > 1) {
      _ctx.beginPath();
      _ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (let t = 1; t < p.trail.length; t++) _ctx.lineTo(p.trail[t].x, p.trail[t].y);
      _ctx.lineTo(px, py);
      _ctx.strokeStyle = `rgba(220,235,255,${0.25 * (1 - p.progress * 0.5)})`;
      _ctx.lineWidth = 1;
      _ctx.stroke();
    }
    const sp = _sprites.get(p.sprite);
    if (sp) { _ctx.globalAlpha = 0.9; _ctx.drawImage(sp.canvas, px - sp.half, py - sp.half); _ctx.globalAlpha = 1; }
  }
}

// L5: Nodes
function drawNode(n) {
  const sp = _sprites.get(n.type);
  if (!sp) return;
  const pulse = Math.sin(n.phase + _frame * 0.012) * 0.1 + 0.9;
  const fadeAlpha = n.fadeIn > 0 ? 1 - n.fadeIn / 30 : 1;
  const baseAlpha = _themeConfig.nodeAlpha || 1;
  _ctx.globalAlpha = (pulse * fadeAlpha + n.brightness * 0.4) * baseAlpha;
  _ctx.drawImage(sp.canvas, n.x - sp.half, n.y - sp.half);
  _ctx.globalAlpha = 1;
}

// L6: Oscilloscope signal line (configurable multi-layer)
function drawSignalLine() {
  if (!_quality.signal) return;
  const cfg = _themeConfig.signal;
  const baseY = _H * 0.82;
  _ctx.beginPath();
  for (let x = 0; x <= _W; x += 2) {
    let y = baseY;
    for (const layer of cfg.layers) {
      y += Math.sin(x * layer.freq + _frame * 0.003) * cfg.amplitude * layer.amp;
    }
    if (_frame % 300 < 20) {
      const gc = _W * 0.3 + fractalHash(_frame % 300, Math.floor(x / 100)) * _W * 0.4;
      if (Math.abs(x - gc) < 50) y += (Math.random() - 0.5) * 16;
    }
    if (x === 0) _ctx.moveTo(x, y); else _ctx.lineTo(x, y);
  }
  _ctx.strokeStyle = _themeConfig.signalColor || 'rgba(109,174,69,0.12)';
  _ctx.lineWidth = 0.8;
  _ctx.stroke();
}

// L7: Floating data labels (HOME theme)
function drawDataLabels() {
  if (!_themeConfig.dataLabels.enabled) return;
  _dataLabelPhase += 0.008;
  for (const label of _dataLabels) {
    const n = _nodes[label.anchorNode];
    if (!n) continue;
    const floatY = Math.sin(_dataLabelPhase + label.phase) * 4;
    const lx = n.x + label.offsetX;
    const ly = n.y + label.offsetY + floatY;
    _ctx.font = '10px "JetBrains Mono", monospace';
    _ctx.fillStyle = 'rgba(109,174,69,0.45)';
    _ctx.textAlign = 'center';
    _ctx.fillText(label.text, lx, ly);
  }
}

// L8: Demo ripples
function drawRipples() {
  if (!_themeConfig.ripple) return;
  const rc = _themeConfig.nodeColors.sensor || C.red;
  for (let i = _ripples.length - 1; i >= 0; i--) {
    const rp = _ripples[i];
    rp.radius += 0.8;
    rp.alpha *= 0.985;
    if (rp.radius > rp.maxRadius || rp.alpha < 0.01) { _ripples.splice(i, 1); continue; }
    _ctx.beginPath();
    _ctx.arc(rp.x, rp.y, rp.radius, 0, PI2);
    _ctx.strokeStyle = `rgba(${rc.r},${rc.g},${rc.b},${rp.alpha})`;
    _ctx.lineWidth = 1.5;
    _ctx.stroke();
  }
}

// L9: Vignette
function drawVignette() {
  if (!_quality.vignette) return;
  const diag = Math.sqrt(_W * _W + _H * _H);
  const grad = _ctx.createRadialGradient(_W / 2, _H / 2, diag * 0.2, _W / 2, _H / 2, diag * 0.6);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${_themeConfig.vignetteStrength})`);
  _ctx.fillStyle = grad;
  _ctx.fillRect(0, 0, _W, _H);
}

// ── Physics update ───────────────────────────────────────────────
function update(ts) {
  _frame++;
  const ss = _themeConfig.speedScale || 1.0;
  if (_mouse.x !== null) {
    if (_mouseSmooth.x === null) { _mouseSmooth.x = _mouse.x; _mouseSmooth.y = _mouse.y; }
    else { _mouseSmooth.x += (_mouse.x - _mouseSmooth.x) * 0.08; _mouseSmooth.y += (_mouse.y - _mouseSmooth.y) * 0.08; }
  }
  for (let i = 0; i < _nodes.length; i++) {
    const n = _nodes[i];
    if (n.fadeIn > 0) n.fadeIn -= ts;
    n.dirCountdown -= ts;
    if (n.dirCountdown <= 0) {
      const ca = Math.atan2(n.vy, n.vx);
      n.dir = Math.round(ca / (Math.PI / 4)) * (Math.PI / 4);
      n.dir += (Math.floor(Math.random() * 3) - 1) * (Math.PI / 4);
      n.dir = ((n.dir % PI2) + PI2) % PI2;
      n.dirCountdown = 200 + Math.random() * 200;
    }
    n.vx += Math.cos(n.dir) * 0.004 * ts * ss;
    n.vy += Math.sin(n.dir) * 0.004 * ts * ss;
    n.vx += (Math.random() - 0.5) * 0.002 * ts * ss;
    n.vy += (Math.random() - 0.5) * 0.002 * ts * ss;
    const damp = Math.pow(0.978, ts);
    n.vx *= damp; n.vy *= damp;
    // Symmetric neighbor repulsion
    for (let j = i + 1; j < _nodes.length; j++) {
      const m = _nodes[j];
      const dx = n.x - m.x, dy = n.y - m.y, dSq = dx * dx + dy * dy;
      if (dSq < 9025 && dSq > 1) {
        const d = Math.sqrt(dSq);
        const f = 0.012 / (dSq * 0.005 + 1);
        const bonus = (n.type === m.type) ? 1.5 : 0.8;
        const fx = (dx / d) * f * bonus * ts, fy = (dy / d) * f * bonus * ts;
        n.vx += fx; n.vy += fy; m.vx -= fx; m.vy -= fy;
      }
    }
    // Mouse: brightness + repulsion
    n.brightness *= 0.93;
    if (_mouseSmooth.x !== null) {
      const dx = n.x - _mouseSmooth.x, dy = n.y - _mouseSmooth.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 200 && d > 0) {
        n.brightness = Math.max(n.brightness, 1 - d / 200);
        if (d < 80) { n.vx += (dx / d) * 0.015 * ts; n.vy += (dy / d) * 0.015 * ts; }
      }
    }
    // Centering force
    const dcx = _W / 2 - n.x, dcy = _H / 2 - n.y;
    const dfc = Math.sqrt(dcx * dcx + dcy * dcy);
    const maxR = Math.min(_W, _H) * 0.44;
    if (dfc > maxR) {
      const ex = (dfc - maxR) / maxR;
      n.vx += (dcx / dfc) * ex * 0.008 * ts;
      n.vy += (dcy / dfc) * ex * 0.008 * ts;
    }
    // Staggered jitter
    if (_frame % 60 === n.id % 7) {
      n.vx += (Math.random() - 0.5) * 0.04 * ts;
      n.vy += (Math.random() - 0.5) * 0.04 * ts;
    }
    // Velocity cap
    const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
    const maxSpd = 0.6 * ts;
    if (spd > maxSpd) { n.vx = (n.vx / spd) * maxSpd; n.vy = (n.vy / spd) * maxSpd; }
    n.x += n.vx; n.y += n.vy;
    // Boundary bounce
    const mg = 30;
    if (n.x < mg) { n.x = mg; n.vx = Math.abs(n.vx) * 0.5; }
    if (n.x > _W - mg) { n.x = _W - mg; n.vx = -Math.abs(n.vx) * 0.5; }
    if (n.y < mg) { n.y = mg; n.vy = Math.abs(n.vy) * 0.5; }
    if (n.y > _H - mg) { n.y = _H - mg; n.vy = -Math.abs(n.vy) * 0.5; }
  }
  // Density dispersion
  if (_frame % 30 === 0) {
    for (let i = 0; i < _nodes.length; i++) {
      const n = _nodes[i];
      let cnt = 0, pX = 0, pY = 0;
      for (let j = 0; j < _nodes.length; j++) {
        if (i === j) continue;
        const dx = n.x - _nodes[j].x, dy = n.y - _nodes[j].y;
        if (dx * dx + dy * dy < 22500) {
          cnt++;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0) { pX += dx / d; pY += dy / d; }
        }
      }
      if (cnt > 6) {
        const mag = Math.sqrt(pX * pX + pY * pY);
        if (mag > 0) { const ex = (cnt - 6) / 6; n.vx += (pX / mag) * ex * 0.015; n.vy += (pY / mag) * ex * 0.015; }
      }
    }
  }
  if (_frame % 8 === 0) _cachedConns = getConnections();
  if (_frame % 55 === 0 && _cachedConns.length > 0)
    spawnPulse(_cachedConns[Math.floor(Math.random() * _cachedConns.length)]);
  // Demo theme: spawn ripples from random nodes
  if (_themeConfig.ripple && _frame % 90 === 0 && _nodes.length > 0) {
    const src = _nodes[Math.floor(Math.random() * _nodes.length)];
    _ripples.push({ x: src.x, y: src.y, radius: 0, maxRadius: 120 + Math.random() * 80, alpha: 0.5 });
  }
  for (let i = _pulses.length - 1; i >= 0; i--) {
    const p = _pulses[i];
    p.progress += p.speed * ts;
    const px = _nodes[p.nodeA].x + (_nodes[p.nodeB].x - _nodes[p.nodeA].x) * p.progress;
    const py = _nodes[p.nodeA].y + (_nodes[p.nodeB].y - _nodes[p.nodeA].y) * p.progress;
    p.trail.push({ x: px, y: py });
    if (p.trail.length > 5) p.trail.shift();
    if (p.progress >= 1) _pulses.splice(i, 1);
  }
}

// ── Main draw loop (layered) ─────────────────────────────────────
function draw() {
  const now = performance.now();
  const dt = Math.min(now - _lastFrameTime, 50);
  _lastFrameTime = now;
  const ts = dt / 16.667;
  _avgFrameTime = _avgFrameTime * 0.92 + dt * 0.08;
  if (_avgFrameTime > 33) _qualityLevel = Math.max(0.4, _qualityLevel - 0.04);
  else if (_avgFrameTime < 20 && _qualityLevel < 1.0) _qualityLevel = Math.min(1.0, _qualityLevel + 0.02);

  _ctx.clearRect(0, 0, _W, _H);
  _ctx.globalCompositeOperation = 'source-over';

  // L1: PCB grid
  if (_qualityLevel > 0.4) {
    if (_frame % 200 === 0 || !_pcbCanvas) drawPCBGrid();
    if (_pcbCanvas) _ctx.drawImage(_pcbCanvas, 0, 0, _pcbCanvas.width, _pcbCanvas.height, 0, 0, _W, _H);
  }

  // L2: Connections
  const conns = _qualityLevel > 0.4 ? _cachedConns : _cachedConns.filter((_, i) => i % 2 === 0);
  drawConnections(conns);
  drawMouseField();
  drawPulses();

  // L5: Nodes sorted by depth
  const sz = { sensor: 0, processor: 1, cloud: 2 };
  [..._nodes].sort((a, b) => sz[a.type] - sz[b.type]).forEach(drawNode);

  // L6-L9: Signal, data labels, ripples, vignette
  drawSignalLine();
  drawDataLabels();
  drawRipples();
  drawVignette();

  update(ts);
  _animId = requestAnimationFrame(draw);
}

// ── Lifecycle API ────────────────────────────────────────────────
export function initParticles(theme = 'default', selector = '.hero__particles') {
  _selector = selector;
  _container = document.querySelector(selector);
  if (!_container) return;
  _prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  _dpr = Math.min(window.devicePixelRatio || 1, 2);

  _canvas = document.createElement('canvas');
  _canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  _container.appendChild(_canvas);
  _ctx = _canvas.getContext('2d', { alpha: true });

  setupTheme(theme);
  resize();

  // Bind event handlers (store refs for cleanup)
  _boundMouseMove = (e) => {
    const r = _container.getBoundingClientRect();
    _mouse.x = e.clientX - r.left; _mouse.y = e.clientY - r.top;
  };
  _boundMouseLeave = () => { _mouse.x = null; _mouse.y = null; };
  _boundVisibility = () => {
    if (document.hidden) cancelAnimationFrame(_animId);
    else if (!_prefersReduced) { _lastFrameTime = performance.now(); draw(); }
  };
  _boundResize = () => {
    resize();
    for (const n of _nodes) { if (n.x > _W - 30) n.x = _W - 30; if (n.y > _H - 30) n.y = _H - 30; }
  };

  _container.addEventListener('mousemove', _boundMouseMove, { passive: true });
  _container.addEventListener('mouseleave', _boundMouseLeave, { passive: true });
  document.addEventListener('visibilitychange', _boundVisibility);
  window.addEventListener('resize', _boundResize);

  createNodes();

  if (_prefersReduced) {
    const conns = getConnections();
    _ctx.clearRect(0, 0, _W, _H);
    _ctx.globalCompositeOperation = 'source-over';
    drawPCBGrid();
    if (_pcbCanvas) _ctx.drawImage(_pcbCanvas, 0, 0, _pcbCanvas.width, _pcbCanvas.height, 0, 0, _W, _H);
    drawConnections(conns);
    _nodes.forEach(drawNode);
    drawVignette();
  } else {
    _lastFrameTime = performance.now();
    draw();
  }
}

export function destroyParticles() {
  if (_animId) cancelAnimationFrame(_animId);
  _animId = null;
  if (_boundMouseMove && _container) {
    _container.removeEventListener('mousemove', _boundMouseMove);
    _container.removeEventListener('mouseleave', _boundMouseLeave);
  }
  if (_boundVisibility) document.removeEventListener('visibilitychange', _boundVisibility);
  if (_boundResize) window.removeEventListener('resize', _boundResize);
  if (_canvas && _canvas.parentNode) _canvas.parentNode.removeChild(_canvas);
  _nodes = []; _pulses = []; _cachedConns = []; _dataLabels = []; _ripples = [];
  _sprites.clear();
  _pcbCanvas = null;
  _canvas = _ctx = _container = null;
  _boundMouseMove = _boundMouseLeave = _boundVisibility = _boundResize = null;
}

export function setTheme(theme) {
  destroyParticles();
  initParticles(theme, _selector);
}
