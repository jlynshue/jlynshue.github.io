const TAU = Math.PI * 2;

const TONES = {
  signal: { bg: "#0B0E14", mid: "#13205A", acc: "#2549F5", acc2: "#6E8BFF" },
  heat: { bg: "#0B0E14", mid: "#3A1606", acc: "#E8602A", acc2: "#FFA060" },
  mono: { bg: "#0C0E12", mid: "#2A2F38", acc: "#9AA1AC", acc2: "#F4F1EA" },
  aurora: { bg: "#0B0E14", mid: "#142253", acc: "#2549F5", acc2: "#E8602A" },
};

function hexA(hexStr: string, a: number) {
  const r = parseInt(hexStr.slice(1, 3), 16);
  const g = parseInt(hexStr.slice(3, 5), 16);
  const b = parseInt(hexStr.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

function vn(x: number, y: number) {
  const xi = Math.floor(x),
    yi = Math.floor(y),
    xf = x - xi,
    yf = y - yi;
  const h = (a: number, b: number) => {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const u = xf * xf * (3 - 2 * xf),
    v = yf * yf * (3 - 2 * yf);
  const a = h(xi, yi),
    b = h(xi + 1, yi),
    c = h(xi, yi + 1),
    d = h(xi + 1, yi + 1);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
}

interface WallpaperState {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  dpr: number;
  W: number;
  H: number;
  raf: number;
  running: boolean;
  t0: number;
  parts: Particle[];
  mouse: { x: number; y: number; vx: number; vy: number; active: boolean; speed: number };
  params: { drift: number; force: number; glow: number };
  tone: keyof typeof TONES;
}

const state: WallpaperState = {
  canvas: null,
  ctx: null,
  dpr: 1,
  W: 0,
  H: 0,
  raf: 0,
  running: false,
  t0: 0,
  parts: [],
  mouse: { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false, speed: 0 },
  params: { drift: 1.25, force: 2.1, glow: 1.25 },
  tone: "mono",
};

function resize() {
  if (!state.canvas) return;
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round(window.innerWidth * state.dpr);
  const h = Math.round(window.innerHeight * state.dpr);
  state.W = w;
  state.H = h;
  state.canvas.width = w;
  state.canvas.height = h;
  state.canvas.style.width = window.innerWidth + "px";
  state.canvas.style.height = window.innerHeight + "px";
  rebuild();
}

function rebuild() {
  const w = state.W,
    h = state.H;
  const cssA = window.innerWidth * window.innerHeight;
  const n = Math.min(950, Math.round(cssA / 2400));
  state.parts = [];
  for (let i = 0; i < n; i++) {
    state.parts.push({
      x: Math.random() * w,
      y: Math.random() * h,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
      life: Math.random() * 120,
    });
  }
}

function renderStreaks() {
  const ctx = state.ctx;
  if (!ctx) return;
  const t = TONES[state.tone];
  const m = state.mouse;
  const P = state.params;
  const w = state.W,
    h = state.H,
    mn = Math.min(w, h);
  const T = (performance.now() - state.t0) / 1000;
  const R = 0.26 * mn;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = hexA(t.bg, 0.11);
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = 1.1 * state.dpr;

  for (const p of state.parts) {
    p.px = p.x;
    p.py = p.y;
    const ang = vn(p.x * 0.0016 + T * 0.05, p.y * 0.0016 - T * 0.04) * TAU * 1.6;
    let ax = Math.cos(ang),
      ay = Math.sin(ang);
    let sp = 1.5 * state.dpr * P.drift;

    if (m.active) {
      const dx = p.x - m.x,
        dy = p.y - m.y,
        d = Math.hypot(dx, dy) || 1;
      if (d < R) {
        const fall = 1 - d / R;
        ax += ((-dy / d) * fall * 2.2 * P.force + (dx / d) * fall * 0.6 * P.force);
        ay += ((dx / d) * fall * 2.2 * P.force + (dy / d) * fall * 0.6 * P.force);
        sp += fall * m.speed * 6 * state.dpr;
      }
    }

    p.x += ax * sp;
    p.y += ay * sp;
    p.life -= 1;

    if (p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5 || p.life < 0) {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.life = 60 + Math.random() * 120;
      p.px = p.x;
      p.py = p.y;
      continue;
    }

    const grad = p.life % 2 === 0;
    ctx.strokeStyle = hexA(grad ? t.acc : t.acc2, 0.5 * P.glow);
    ctx.beginPath();
    ctx.moveTo(p.px, p.py);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

function frame() {
  if (!state.running) return;
  renderStreaks();
  state.raf = requestAnimationFrame(frame);
}

export function initWallpaper(canvas: HTMLCanvasElement) {
  state.canvas = canvas;
  state.ctx = canvas.getContext("2d");
  state.t0 = performance.now();

  const mv = (e: PointerEvent) => {
    const nx = e.clientX * state.dpr,
      ny = e.clientY * state.dpr;
    if (state.mouse.active) {
      state.mouse.vx = nx - state.mouse.x;
      state.mouse.vy = ny - state.mouse.y;
    }
    state.mouse.x = nx;
    state.mouse.y = ny;
    state.mouse.active = true;
    const mn = Math.min(state.W, state.H);
    state.mouse.speed = Math.min(Math.hypot(state.mouse.vx, state.mouse.vy) / (mn * 0.04), 1.5);
  };
  window.addEventListener("pointermove", mv, { passive: true });
  window.addEventListener("pointerout", (e) => {
    if (!(e as PointerEvent).relatedTarget) state.mouse.active = false;
  });

  resize();
  window.addEventListener("resize", resize);

  state.running = true;
  frame();

  return () => {
    state.running = false;
    cancelAnimationFrame(state.raf);
    window.removeEventListener("pointermove", mv);
    window.removeEventListener("resize", resize);
  };
}
