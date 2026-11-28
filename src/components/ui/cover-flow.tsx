"use client";

// Cover Flow by Louis Studios.
// 200 more hand-made React components at https://studios.lou15.com/?ref=21st-code

import * as React from "react";

/** One cover in the flow. */
export interface CoverFlowItem {
  /** Title shown on the centre cover. */
  title: string;
  /** Second caption line under the title, for example the artist. */
  subtitle?: string;
  /** Image URL for the cover. Square images look best; anything else is cropped to fill. */
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  /** Alternative text for the cover image. Defaults to the title. */
  alt?: string;
}

export interface CoverFlowProps {
  /** The covers, in order. Each takes an image source. */
  items: CoverFlowItem[];
  /** Controlled centre cover index. Pair it with onIndexChange. */
  index?: number;
  /** Centre cover when uncontrolled. */
  defaultIndex?: number;
  /** Called with the new centre index after a drag, swipe, wheel, click, arrow key or autoplay step. */
  onIndexChange?: (index: number) => void;
  /** Called when the centre cover is clicked, or Enter is pressed while the flow has focus. */
  onSelect?: (index: number) => void;
  /** Step to the next cover on a timer. Pauses while hovered, focused or dragged. */
  autoplay?: boolean;
  /** Seconds between autoplay steps. */
  interval?: number;
  /** Wrap around at the ends so the flow never runs out of covers. */
  loop?: boolean;
  /** Colour of the rounded stage the covers sit on, and of the floor fade. */
  stageColor?: string;
  /** Show the tinted stage and photo backdrop behind the covers. */
  showBackdrop?: boolean;
  /** Page colour around the stage. */
  pageColor?: string;
  /** Focus ring colour. */
  accent?: string;
  /** Colour of the caption title. The subtitle uses the same colour at half strength. */
  captionColor?: string;
  /** Mirror the centre cover on a glossy floor under it. The covers move up to make room. */
  showReflection?: boolean;
  /** Show the title and subtitle on the centre cover. */
  showCaptions?: boolean;
  /** Strength of the idle sway of the side covers, 0 to 1. */
  sway?: number;
  /** Let the mouse wheel step through covers. Horizontal trackpad scrolling always works. */
  wheel?: boolean;
  /** Font stack for the captions and the type on the built-in artworks. */
  font?: string;
  /** Freeze the animation at this many seconds. With autoplay it steps through the covers on the interval. For stills and tests. */
  seconds?: number;
  /** Accessible name for the carousel region. */
  ariaLabel?: string;
  /** Extra class on the outer element. */
  className?: string;
  /** Extra style on the outer element. The root fills its container (width and height 100%), falls back to a 16 / 9 aspect ratio when the container has no height, and is never shorter than 360 px. */
  style?: React.CSSProperties;
}

const DEFAULT_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, "Helvetica Neue", Arial, sans-serif';

/* ------------------------------------------------------------------ */
/* Geometry, measured from the reference still                         */
/* ------------------------------------------------------------------ */

const STAGE_RATIO = 2.1807; // stage width / height
const PAGE_PAD = 0.0865; // side margin / root width on wide layouts
const CARD = 0.8745; // centre cover size / stage height
const CARD_REFLECT = 0.74; // centre cover size / stage height with the reflection on
const STAGE_CORNER = 0.1602; // superellipse extent / stage height
const STAGE_CORNER_N = 2.65;
const CORNER_C = 0.0573; // centre cover corner extent / cover size
const CORNER_C_N = 2.5;
const CORNER_S = 0.115; // side cover corner extent / cover size
const CORNER_S_N = 1.9;
const SHIFT = 0.011; // the flow sits this many cover sizes right of the stage centre
const PERSP = 2.5; // per-cover perspective distance, in cover sizes
const SLOPE = 0.366; // top-edge slope of a side cover
const THETA = Math.atan(2 * PERSP * SLOPE); // side cover rotation, radians
// Outer-edge half height of a side cover (cover sizes) and outer-edge positions of slots 1 to 4,
// as fractions of the free stage on that side.
const LEFT = { h: 0.48065, edges: [0.27594, 0.64944, 0.97468, 1.27] };
const RIGHT = { h: 0.46949, edges: [0.3315, 0.6386, 0.91841, 1.2] };
const FADE_FROM = 0.3428; // side cover floor fade, local fraction of its height
const FADE_TO = 0.9813;
// floor fade over the backdrop: [percent of stage height, percent of stage colour]
const FLOOR: [number, number][] = [[40, 0], [44, 3], [52, 13], [61, 43], [69, 63], [78, 77], [87, 92], [90, 100]];
// left edge fade: [percent of stage width, percent of stage colour], measured from the reference
const EDGE: [number, number][] = [[0, 100], [1.3, 88], [2.29, 76], [3.27, 60], [4.26, 40], [5.24, 16], [6.06, 0]];
const TITLE = { size: 0.067, base: 0.8685 }; // caption metrics, fractions of the cover size
const SUB = { size: 0.0407, base: 0.9288 };

/* ------------------------------------------------------------------ */
/* Small math                                                          */
/* ------------------------------------------------------------------ */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const mod = (v: number, n: number) => ((v % n) + n) % n;
/** 0 to 1 ease for the turn into the centre: flat at the centre and at the slot, so a cover turns while it travels. */
const ease = (u: number) => u * u * (3 - 2 * u);

function squircle(w: number, h: number, a: number, n: number, ox = 0, oy = 0, seg = 18): string {
  const r = Math.max(0, Math.min(a, w / 2, h / 2));
  const e = 2 / n;
  const pts: string[] = [];
  const put = (x: number, y: number) => pts.push(`${(x + ox).toFixed(2)} ${(y + oy).toFixed(2)}`);
  // clockwise from the left end of the top-left corner; each corner runs t = 0 to 90 degrees
  const corners: ((c: number, s: number) => [number, number])[] = [
    (c, s) => [r - r * c, r - r * s],
    (c, s) => [w - r + r * s, r - r * c],
    (c, s) => [w - r + r * c, h - r + r * s],
    (c, s) => [r - r * s, h - r + r * c],
  ];
  for (const f of corners) {
    for (let i = 0; i <= seg; i++) {
      const t = (i / seg) * (Math.PI / 2);
      const [x, y] = f(Math.pow(Math.cos(t), e), Math.pow(Math.sin(t), e));
      put(x, y);
    }
  }
  return `M ${pts.join(" L ")} Z`;
}

/** Monotone cubic through (1, y1) ... (m, ym); returns value and slope. */
function monotone(ys: number[]) {
  const n = ys.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push(ys[i + 1] - ys[i]);
  const m: number[] = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (u: number) => {
    // u is a slot coordinate starting at 1
    const x = u - 1;
    if (x >= n - 1) return ys[n - 1] + m[n - 1] * (x - (n - 1));
    const i = Math.max(0, Math.floor(x));
    const t = x - i;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * m[i + 1];
  };
}

interface Side { h: number; k: number; x: (u: number) => number }

/** Builds the horizontal path of one side for a stage with `free` cover sizes of room beyond the centre cover. */
function buildSide(spec: { h: number; edges: number[] }, free: number): Side {
  const sin = Math.sin(THETA), cos = Math.cos(THETA);
  const fo = PERSP / (PERSP - 0.5 * sin);
  const k = (2 * spec.h) / fo;
  const wo = spec.h * cos; // projected distance from the outer edge to the cover centre
  const slots = spec.edges.map((e) => 0.5 + e * free - wo);
  const outer = monotone(slots);
  const x1 = slots[0];
  const m1 = outer(1.001) - outer(1) > 0 ? (outer(1.001) - outer(1)) / 0.001 : 0;
  const m0 = 2.1 * x1; // covers either side of the centre meet halfway through a step
  return {
    h: spec.h,
    k,
    x: (u: number) => {
      if (u >= 1) return outer(u);
      const t = u, t2 = t * t, t3 = t2 * t;
      return (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * x1 + (t3 - t2) * m1;
    },
  };
}

/* Motion: a critically damped lead that eases in, followed by a soft spring. */
const LEAD = 14, SPRING = 13, DAMP = 0.78;
interface Motion { pos: number; vel: number; aim: number; aimVel: number }
function integrate(m: Motion, target: number, h: number) {
  const a1 = -LEAD * LEAD * (m.aim - target) - 2 * LEAD * m.aimVel;
  m.aimVel += a1 * h;
  m.aim += m.aimVel * h;
  const a2 = -SPRING * SPRING * (m.pos - m.aim) - 2 * DAMP * SPRING * m.vel;
  m.vel += a2 * h;
  m.pos += m.vel * h;
}
/** Deterministic response of the motion model to a unit step, x seconds in. */
function stepCurve(x: number) {
  const m: Motion = { pos: 0, vel: 0, aim: 0, aimVel: 0 };
  const h = 1 / 240;
  let t = 0;
  while (t + h <= x) { integrate(m, 1, h); t += h; }
  if (x - t > 1e-9) integrate(m, 1, x - t);
  return m.pos;
}

/* ------------------------------------------------------------------ */
/** Writes a soft, dim copy of a cover into a tiny canvas; the stage shows it scaled up as its ambient light. Never reads pixels, so cross-origin images are fine. */
function glow(src: CanvasImageSource, w: number, h: number, out: HTMLCanvasElement) {
  if (!w || !h) return;
  const s = Math.min(w, h);
  const mid = document.createElement("canvas");
  mid.width = mid.height = 80;
  const m = mid.getContext("2d");
  const tiny = document.createElement("canvas");
  tiny.width = tiny.height = 20;
  const t = tiny.getContext("2d");
  const o = out.getContext("2d");
  if (!m || !t || !o) return;
  m.imageSmoothingQuality = "high";
  m.drawImage(src, (w - s) / 2, (h - s) / 2, s, s, 0, 0, 80, 80);
  t.imageSmoothingQuality = "high";
  t.drawImage(mid, 0, 0, 20, 20);
  out.width = out.height = 64;
  o.imageSmoothingQuality = "high";
  if ("filter" in o) o.filter = "saturate(1.7)";
  o.drawImage(tiny, 0, 0, 64, 64);
  if ("filter" in o) o.filter = "none";
  o.fillStyle = "rgba(0, 0, 0, 0.915)"; // ls:keep (a brightness mask, not a colour)
  o.fillRect(0, 0, 64, 64);
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface Layout {
  W: number; H: number;
  sx: number; sy: number; sw: number; sh: number;
  S: number; cx: number; cy: number;
  free: number;
  reflect: boolean;
  left: Side; right: Side;
}

function computeLayout(W: number, H: number, reflect: boolean): Layout {
  const padX = W >= 600 ? W * PAGE_PAD : lerp(16, 600 * PAGE_PAD, clamp((W - 375) / 225, 0, 1));
  const padY = 16;
  const availW = Math.max(40, W - 2 * padX), availH = Math.max(40, H - 2 * padY);
  const ratio = lerp(1.22, STAGE_RATIO, smooth(340, 560, availW));
  let sw = availW, sh = sw / ratio;
  if (sh > availH) { sh = availH; sw = Math.min(availW, sh * ratio); }
  sw = Math.round(sw);
  sh = Math.round(sh);
  const sx = Math.round((W - sw) / 2 + W * 0.0005), sy = Math.round((H - sh) / 2);
  const S = sh * (reflect ? CARD_REFLECT : CARD);
  const cx = sw / 2 + SHIFT * S;
  const cy = reflect ? sh * 0.43 : sh / 2;
  const free = Math.max(0, (sw / 2 - S / 2) / S);
  return { W, H, sx, sy, sw, sh, S, cx, cy, free, reflect, left: buildSide(LEFT, free), right: buildSide(RIGHT, free) };
}

/** Pose of one cover at a signed slot offset. */
function pose(L: Layout, o: number, swayDeg: number) {
  const side = o < 0 ? L.left : L.right;
  const sgn = o < 0 ? -1 : 1;
  const u = Math.abs(o);
  const e = u >= 1 ? 1 : ease(u);
  const theta = THETA * e + (swayDeg * Math.PI / 180) * e;
  const h = 0.5 + (side.h - 0.5) * e;
  const sin = Math.sin(theta);
  const fo = PERSP / (PERSP - 0.5 * sin);
  const k = (2 * h) / fo;
  const x = sgn * side.x(u);
  return { u, sgn, theta, k, x, e, fo };
}

export function CoverFlow({
  items,
  index,
  defaultIndex = 3,
  onIndexChange,
  onSelect,
  autoplay = false,
  interval = 3.5,
  loop = true,
  stageColor = "#010101",
  showBackdrop = true,
  pageColor = "#f5f5f5",
  accent = "#7fb2ff",
  captionColor = "#ffffff",
  showReflection = false,
  showCaptions = true,
  sway = 1,
  wheel = true,
  font = DEFAULT_FONT,
  seconds,
  ariaLabel = "Cover flow",
  className,
  style,
}: CoverFlowProps) {
  const n = items.length;
  const controlled = index !== undefined;
  const start = n ? mod(Math.round(controlled ? (index as number) : defaultIndex), n) : 0;
  const [active, setActive] = React.useState(start);
  const [layout, setLayout] = React.useState<Layout | null>(null);
  const [focusRing, setFocusRing] = React.useState(false);
  const [baseline, setBaseline] = React.useState(0.86);
  const [requestRevision, bump] = React.useState(0);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const probeRef = React.useRef<HTMLDivElement | null>(null);
  const wrapRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const clipRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const fadeRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const shadowRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const mirrorRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const capRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const backRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const backArtRefs = React.useRef<(HTMLCanvasElement | null)[]>([]);

  const props = { items, n, controlled, index, onIndexChange, onSelect, autoplay, interval, loop, sway, wheel, seconds, showReflection };
  const P = React.useRef(props);
  P.current = props;

  const st = React.useRef({
    pos: start, vel: 0, aim: start, aimVel: 0, target: start, emitted: start,
    dragging: false, moved: false, startX: 0, startPos: 0, downCard: -1, samples: [] as { t: number; p: number }[],
    wheelAt: 0, wheelAcc: 0, wheelStep: 0, wheelLast: 0, wheelTimer: 0 as unknown as ReturnType<typeof setTimeout>,
    hover: false, focus: false, visible: true, hidden: false, reduced: false,
    raf: 0, last: 0, t0: 0, autoAt: 0, clipCache: [] as string[], paint: (() => {}) as () => void,
    kick: (() => {}) as () => void,
  });

  /* ---------- measure ---------- */
  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      setLayout((prev) => {
        const reflect = P.current.showReflection;
        if (prev && prev.reflect === reflect && Math.abs(prev.W - r.width) < 0.5 && Math.abs(prev.H - r.height) < 0.5) return prev;
        return computeLayout(r.width, r.height, reflect);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showReflection]);

  React.useLayoutEffect(() => {
    const p = probeRef.current;
    if (!p) return;
    const line = p.firstElementChild as HTMLElement | null;
    const mark = p.lastElementChild as HTMLElement | null;
    if (!line || !mark) return;
    const b = mark.getBoundingClientRect().top - line.getBoundingClientRect().top;
    if (b > 0) setBaseline(b / 100);
  }, [font]);

  /* Backdrops use the existing photographs. */
  React.useEffect(() => {
    if (!layout || !showBackdrop) return;
    let active = true;
    items.forEach((item, i) => {
      const backdrop = backArtRefs.current[i];
      if (!backdrop) return;
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (active) glow(image, image.naturalWidth, image.naturalHeight, backdrop);
      };
      image.src = item.src;
    });
    return () => { active = false; };
  }, [items, layout, showBackdrop]);

  /* ---------- painting one frame ---------- */
  const paint = React.useCallback((pos: number, t: number) => {
    const L = layout;
    if (!L || !n) return;
    const pr = P.current;
    const swayDeg = st.current.reduced ? 0 : 1.2 * clamp(pr.sway, 0, 1) * Math.sin((Math.PI * 2 * t) / 6);
    const S = L.S;
    const offs: number[] = [];
    let A = -1, B = -1;
    for (let i = 0; i < n; i++) {
      let o = i - pos;
      if (pr.loop) { o = mod(o + n / 2, n) - n / 2; }
      offs.push(o);
      if (o < 0 && o > -1 && (A < 0 || o > offs[A])) A = i;
      if (o >= 0 && o < 1 && (B < 0 || o < offs[B])) B = i;
    }
    const poses = offs.map((o) => pose(L, o, swayDeg));
    // where the two covers either side of the centre would meet in depth
    let cutX = NaN;
    if (A >= 0 && B >= 0) {
      const a = poses[A], b = poses[B];
      const tA = Math.tan(a.theta), tB = Math.tan(b.theta);
      if (tA + tB > 1e-4) cutX = (0.6 * b.u - 0.6 * a.u + a.x * tA + b.x * tB) / (tA + tB);
    }
    for (let i = 0; i < n; i++) {
      const wrap = wrapRefs.current[i], card = cardRefs.current[i];
      if (!wrap || !card) continue;
      const q = poses[i];
      const vis = q.u < 4.2;
      wrap.style.visibility = vis ? "visible" : "hidden";
      const cap = capRefs.current[i];
      if (!vis) { if (cap) cap.style.opacity = "0"; continue; }
      const px = L.cx + q.x * S;
      card.style.transform = `translate3d(${(px - S / 2).toFixed(3)}px, ${(L.cy - S / 2).toFixed(3)}px, 0) scale(${q.k.toFixed(5)}) perspective(${(PERSP * S).toFixed(1)}px) rotateY(${(-q.sgn * q.theta * 180 / Math.PI).toFixed(4)}deg)`;
      wrap.style.zIndex = String(1000 - Math.round(q.u * 100));
      wrap.style.opacity = String(1 - smooth(3, 3.85, q.u));
      // depth cut between the two covers that cross the centre
      let clip = "none";
      if (!isNaN(cutX) && (i === A || i === B)) {
        const front = poses[A].u < poses[B].u ? A : B;
        if (i === front) {
          const cx = L.cx + cutX * S;
          clip = i === B ? `inset(0 0 0 ${Math.max(0, cx).toFixed(2)}px)` : `inset(0 ${Math.max(0, L.sw - cx).toFixed(2)}px 0 0)`;
        }
      }
      if (st.current.clipCache[i] !== clip) { wrap.style.clipPath = clip; st.current.clipCache[i] = clip; }
      const fadeEl = fadeRefs.current[i];
      if (fadeEl) fadeEl.style.opacity = String(Math.min(1, q.u));
      const sh = shadowRefs.current[i];
      if (sh) sh.style.opacity = String(Math.max(0, 1 - q.u * 1.6));
      const mir = mirrorRefs.current[i];
      if (mir) mir.style.opacity = String(Math.max(0, 1 - q.u * 1.4));
      const clipEl = clipRefs.current[i];
      if (clipEl) {
        const a = lerp(CORNER_C, CORNER_S, q.e) * S, nn = lerp(CORNER_C_N, CORNER_S_N, q.e);
        const key = `${a.toFixed(1)}|${nn.toFixed(2)}`;
        if (clipEl.dataset.k !== key) {
          clipEl.dataset.k = key;
          clipEl.style.clipPath = `path("${squircle(S, S, a, nn)}")`;
          if (sh) sh.style.borderRadius = `${(a * 0.82).toFixed(1)}px`;
        }
      }
      if (cap) {
        const op = 1 - smooth(0, 0.26, q.u);
        cap.style.opacity = op.toFixed(3);
        cap.style.transform = `translate3d(${(px - S * 0.46).toFixed(2)}px, 0, 0)`;
        cap.style.visibility = op > 0 ? "visible" : "hidden";
      }
    }
    // backdrop: the art nearest the centre, cross-faded with the next one
    const base = Math.floor(pos), w = smooth(0, 1, pos - base);
    const ia = mod(base, n), ib = mod(base + 1, n);
    for (let i = 0; i < n; i++) {
      const b = backRefs.current[i];
      if (!b) continue;
      const op = i === ia ? (ia === ib ? 1 : 1) : i === ib ? w : 0;
      b.style.opacity = op.toFixed(3);
      b.style.zIndex = i === ib ? "2" : "1";
      b.style.visibility = op > 0.001 ? "visible" : "hidden";
    }
  }, [layout, n]);

  /* ---------- deterministic time (stills, tests, the card video) ---------- */
  const autoPos = (s: number, t: number, I: number) => {
    const Lm = Math.min(I * 0.85, 0.95);
    const m = Math.floor(t / I + 1e-9);
    const tau = t - m * I;
    const begin = I - Lm;
    let r = 0;
    if (tau > begin) {
      const x = tau - begin;
      r = stepCurve(x) + (1 - stepCurve(Lm)) * smooth(0, 1, x / Lm);
    }
    return s + m + r;
  };

  React.useLayoutEffect(() => {
    if (seconds === undefined || !layout) return;
    const pos = autoplay ? autoPos(start, seconds, Math.max(0.4, interval)) : start;
    st.current.pos = pos;
    paint(pos, seconds);
    const a = mod(Math.round(pos), n);
    if (a !== active) setActive(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, layout, paint, autoplay, interval, start]);

  /* ---------- the live engine ---------- */
  React.useEffect(() => {
    if (seconds !== undefined || !layout) return;
    const s = st.current;
    const mq = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    s.reduced = !!mq?.matches;
    const onMq = () => { s.reduced = !!mq?.matches; kick(); };
    mq?.addEventListener?.("change", onMq);
    s.t0 = s.t0 || performance.now();
    s.autoAt = performance.now() + P.current.interval * 1000;
    const swaying = () => !s.reduced && P.current.sway > 0;
    const frame = (now: number) => {
      s.raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - (s.last || now)) / 1000));
      s.last = now;
      const pr = P.current;
      if (!s.dragging && now - s.wheelAt > 160) {
        if (s.reduced) { s.pos = s.aim = s.target; s.vel = s.aimVel = 0; }
        else {
          let rem = dt;
          while (rem > 0) {
            const h = Math.min(rem, 1 / 240);
            integrate(s, s.target, h);
            rem -= h;
          }
          if (Math.abs(s.pos - s.target) < 1e-4 && Math.abs(s.vel) < 1e-3 && Math.abs(s.aim - s.target) < 1e-4) { s.pos = s.aim = s.target; s.vel = s.aimVel = 0; }
        }
      }
      if (pr.autoplay && !s.hover && !s.focus && !s.dragging && now >= s.autoAt) {
        request(s.target + 1);
        s.autoAt = now + Math.max(0.4, pr.interval) * 1000;
      }
      paint(s.pos, (now - s.t0) / 1000);
      const moving = s.dragging || s.pos !== s.target || now - s.wheelAt < 400;
      if (s.visible && !s.hidden && (moving || swaying() || pr.autoplay)) s.raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!s.raf && s.visible && !s.hidden) { s.last = performance.now(); s.raf = requestAnimationFrame(frame); }
    };
    s.kick = kick;
    const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((es) => { s.visible = es.some((e) => e.isIntersecting); if (s.visible) kick(); }) : null;
    if (rootRef.current && io) io.observe(rootRef.current);
    const onVis = () => { s.hidden = document.hidden; if (!s.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);
    paint(s.pos, (performance.now() - s.t0) / 1000);
    kick();
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mq?.removeEventListener?.("change", onMq);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, paint, seconds]);

  /* ---------- index requests ---------- */
  const request = React.useCallback((t: number) => {
    const s = st.current, pr = P.current;
    if (!pr.n) return;
    const tt = pr.loop ? t : clamp(t, 0, pr.n - 1);
    s.target = tt;
    const idx = mod(tt, pr.n);
    s.autoAt = performance.now() + Math.max(0.4, pr.interval) * 1000;
    if (idx !== s.emitted) {
      s.emitted = idx;
      pr.onIndexChange?.(idx);
      if (!pr.controlled) setActive(idx);
      else setTimeout(() => bump((v) => v + 1), 0);
    }
    s.kick();
  }, []);

  // controlled index: follow the prop along the shortest way round
  React.useEffect(() => {
    if (!controlled || !n) return;
    const s = st.current;
    const want = mod(Math.round(index as number), n);
    setActive(want);
    if (mod(s.target, n) === want && s.emitted === want) return;
    const base = Math.round(s.pos);
    let d = want - mod(base, n);
    if (loop) d = mod(d + n / 2, n) - n / 2;
    s.target = loop ? base + d : want;
    s.emitted = want;
    s.kick();
  }, [controlled, index, loop, n, requestRevision]);

  /* ---------- input ---------- */
  const pxPer = React.useCallback(() => (layout ? layout.S * 0.5 : 200), [layout]);
  const nearest = (i: number) => {
    const s = st.current;
    let o = i - s.target;
    if (P.current.loop) o = mod(o + n / 2, n) - n / 2;
    return s.target + o;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !n || seconds !== undefined) return;
    // Keep keyboard focus on the carousel when a cover moves out of view.
    e.preventDefault();
    rootRef.current?.focus({ preventScroll: true });
    const s = st.current;
    const el = (e.target as HTMLElement).closest("[data-cf-i]") as HTMLElement | null;
    s.downCard = el ? Number(el.dataset.cfI) : -1;
    s.dragging = true;
    s.moved = false;
    s.startX = e.clientX;
    s.startPos = s.pos;
    s.vel = 0;
    s.aim = s.pos;
    s.aimVel = 0;
    s.samples = [{ t: performance.now(), p: s.pos }];
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    s.kick();
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > 6) s.moved = true;
    if (!s.moved) return;
    let p = s.startPos - dx / pxPer();
    if (!P.current.loop) {
      const lo = 0, hi = n - 1;
      if (p < lo) p = lo - (1 - 1 / (1 + (lo - p) * 0.6)) / 0.6;
      if (p > hi) p = hi + (1 - 1 / (1 + (p - hi) * 0.6)) / 0.6;
    }
    s.pos = p;
    const now = performance.now();
    s.samples.push({ t: now, p });
    while (s.samples.length > 2 && now - s.samples[0].t > 100) s.samples.shift();
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;
    (e.currentTarget as HTMLDivElement).releasePointerCapture?.(e.pointerId);
    if (!s.moved) {
      if (s.downCard >= 0) {
        const t = nearest(s.downCard);
        if (t === s.target && Math.abs(s.pos - s.target) < 0.5) P.current.onSelect?.(mod(t, n));
        else request(t);
      }
      return;
    }
    const a = s.samples[0], b = s.samples[s.samples.length - 1];
    const v = b && a && b.t - a.t > 8 ? ((b.p - a.p) / (b.t - a.t)) * 1000 : 0;
    s.vel = s.reduced ? 0 : clamp(v, -30, 30);
    s.aim = s.pos;
    s.aimVel = s.vel;
    const proj = s.pos + s.vel * 0.2;
    request(clamp(Math.round(proj), Math.round(s.pos) - 6, Math.round(s.pos) + 6));
  };

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el || seconds !== undefined) return;
    const onWheel = (e: WheelEvent) => {
      const s = st.current, pr = P.current;
      if (!pr.n) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const dx = e.deltaX * unit, dy = e.deltaY * unit;
      const now = performance.now();
      if (Math.abs(dx) > Math.abs(dy) || (e.shiftKey && dy)) {
        e.preventDefault();
        const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        let p = s.pos + d / pxPer();
        if (!pr.loop) p = clamp(p, -0.35, pr.n - 1 + 0.35);
        s.pos = p;
        s.vel = 0;
        s.aim = p;
        s.aimVel = 0;
        s.wheelAt = now;
        clearTimeout(s.wheelTimer);
        s.wheelTimer = setTimeout(() => request(Math.round(st.current.pos)), 150);
        s.kick();
      } else if (pr.wheel && dy) {
        e.preventDefault();
        if (now - s.wheelLast > 400) s.wheelAcc = 0;
        s.wheelLast = now;
        s.wheelAcc += dy;
        if (Math.abs(s.wheelAcc) >= 36 && now - s.wheelStep > 140) {
          request(s.target + Math.sign(s.wheelAcc));
          s.wheelAcc = 0;
          s.wheelStep = now;
        }
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [seconds, layout, pxPer, request]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!n || seconds !== undefined) return;
    const s = st.current;
    let t: number | null = null;
    if (e.key === "ArrowRight") t = s.target + 1;
    else if (e.key === "ArrowLeft") t = s.target - 1;
    else if (e.key === "Home") t = nearest(0);
    else if (e.key === "End") t = nearest(n - 1);
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); P.current.onSelect?.(mod(s.target, n)); return; }
    if (t === null) return;
    e.preventDefault();
    request(t);
  };

  /* ---------- render ---------- */
  const L = layout;
  const S = L ? L.S : 0;
  const ringPad = 5;
  const titlePx = Math.max(13, S * TITLE.size);
  const subPx = Math.max(11, S * SUB.size);
  const cur = items[active];

  return (
    <div
      ref={rootRef}
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={(e) => {
        st.current.focus = true;
        let fv = true;
        try { fv = (e.target as HTMLElement).matches(":focus-visible"); } catch { fv = true; }
        if (e.target === e.currentTarget) setFocusRing(fv);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) { st.current.focus = false; setFocusRing(false); }
      }}
      onPointerEnter={() => { st.current.hover = true; }}
      onPointerLeave={() => { st.current.hover = false; }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 360,
        aspectRatio: "16 / 9",
        background: pageColor,
        overflow: "hidden",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      <div ref={probeRef} aria-hidden style={{ position: "absolute", left: -9999, top: 0, fontFamily: font, fontSize: 100, lineHeight: 1, whiteSpace: "nowrap", visibility: "hidden" }}>
        <span style={{ display: "inline-block", verticalAlign: "top" }}>H</span>
        <span style={{ display: "inline-block", width: 1, height: 0, verticalAlign: "baseline" }} />
      </div>
      {L && (
        <>
          <svg
            aria-hidden
            width={L.sw + ringPad * 2 + 4}
            height={L.sh + ringPad * 2 + 4}
            style={{ position: "absolute", left: L.sx - ringPad - 2, top: L.sy - ringPad - 2, pointerEvents: "none", opacity: focusRing ? 1 : 0, transition: "opacity 160ms ease" }}
          >
            <path d={squircle(L.sw + ringPad * 2, L.sh + ringPad * 2, STAGE_CORNER * L.sh + ringPad, STAGE_CORNER_N, 2, 2)} fill="none" stroke={accent} strokeWidth={2.5} />
          </svg>
          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              const state = st.current;
              if (!state.dragging) return;
              state.dragging = false;
              request(Math.round(state.pos));
            }}
            style={{
              position: "absolute",
              left: L.sx,
              top: L.sy,
              width: L.sw,
              height: L.sh,
              background: showBackdrop ? stageColor : "transparent",
              maskImage: showBackdrop ? undefined : "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
              clipPath: `path("${squircle(L.sw, L.sh, STAGE_CORNER * L.sh, STAGE_CORNER_N)}")`,
              touchAction: "pan-y",
              userSelect: "none",
              WebkitUserSelect: "none",
              cursor: "grab",
              isolation: "isolate",
            }}
          >
            {/* blurred, dimmed copy of the centre art behind everything */}
            {showBackdrop && <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              {items.map((it, i) => (
                <div
                  key={i}
                  ref={(el) => { backRefs.current[i] = el; }}
                  style={{
                    position: "absolute",
                    left: L.sw * 0.02,
                    top: -L.sh * 0.15,
                    width: L.sw * 1.06,
                    height: L.sh * 2.2,
                    opacity: 0,
                    visibility: "hidden",
                  }}
                >
                  <canvas ref={(el) => { backArtRefs.current[i] = el; }} style={{ width: "100%", height: "100%", display: "block" }} />
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: L.cx - S * 0.5,
                  top: L.cy - S * 0.5,
                  width: S,
                  height: S,
                  zIndex: 3,
                  borderRadius: S * 0.06,
                  boxShadow: `0 0 ${(S * 0.09).toFixed(1)}px ${(S * 0.02).toFixed(1)}px rgba(0, 0, 0, 0.55)`,
                }}
              />
              <div style={{ position: "absolute", inset: 0, zIndex: 3, background: `linear-gradient(90deg, color-mix(in srgb, ${stageColor} 30%, transparent) 0%, transparent 32%, transparent 62%, color-mix(in srgb, ${stageColor} 45%, transparent) 100%)` }} />
              <div style={{ position: "absolute", inset: 0, zIndex: 4, background: `linear-gradient(180deg, ${FLOOR.map(([o, a]) => `color-mix(in srgb, ${stageColor} ${a}%, transparent) ${o}%`).join(", ")})` }} />
            </div>}
            {/* covers */}
            <div style={{ position: "absolute", inset: 0 }}>
              {items.map((it, i) => (
                <div key={i} ref={(el) => { wrapRefs.current[i] = el; }} style={{ position: "absolute", inset: 0, pointerEvents: "none", visibility: "hidden" }}>
                  <div
                    ref={(el) => { cardRefs.current[i] = el; }}
                    data-cf-i={i}
                    role="button"
                    aria-label={i === active ? `${it.title}${it.subtitle ? `, ${it.subtitle}` : ""}` : `Show ${it.title}`}
                    aria-current={i === active ? "true" : undefined}
                    style={{ position: "absolute", left: 0, top: 0, width: S, height: S, transformOrigin: "50% 50%", pointerEvents: "auto", willChange: "transform" }}
                  >
                    <div ref={(el) => { shadowRefs.current[i] = el; }} style={{ position: "absolute", inset: 0, borderRadius: S * 0.05, boxShadow: `0 ${(S * 0.012).toFixed(1)}px ${(S * 0.05).toFixed(1)}px rgba(0, 0, 0, 0.32)`, opacity: 0 }} />
                    {showReflection && (
                      <div ref={(el) => { mirrorRefs.current[i] = el; }} aria-hidden style={{ position: "absolute", left: 0, top: S * 1.012, width: S, height: S, transform: "scaleY(-1)", opacity: 0, WebkitMaskImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.42) 0%, transparent 36%)", maskImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.42) 0%, transparent 36%)", borderRadius: CORNER_C * S, overflow: "hidden" }}>
                        <img src={it.src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    )}
                    <div ref={(el) => { clipRefs.current[i] = el; }} style={{ position: "absolute", inset: 0, overflow: "hidden", background: stageColor }}>
                      <img src={it.src} srcSet={it.srcSet} sizes={it.sizes} width={it.width} height={it.height} alt={it.alt ?? it.title} decoding="async" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div ref={(el) => { fadeRefs.current[i] = el; }} style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent ${FADE_FROM * 100}%, ${stageColor} ${FADE_TO * 100}%)`, opacity: 0 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* the far left edge sinks into the stage */}
            {showBackdrop && <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2000, pointerEvents: "none", background: `linear-gradient(90deg, ${EDGE.map(([o, a]) => `color-mix(in srgb, ${stageColor} ${a}%, transparent) ${o}%`).join(", ")})` }} />}
            {showCaptions && (
              <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2001, pointerEvents: "none" }}>
                {items.map((it, i) => (
                  <div
                    key={i}
                    ref={(el) => { capRefs.current[i] = el; }}
                    style={{ position: "absolute", left: 0, top: L.cy - S / 2, width: S * 0.92, height: S, opacity: 0, visibility: "hidden", fontFamily: font, textAlign: "center", color: captionColor }}
                  >
                    <div style={{ position: "absolute", left: 0, right: 0, top: S * TITLE.base - baseline * titlePx, fontSize: titlePx, lineHeight: 1, fontWeight: 400, letterSpacing: "-0.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textShadow: "0 1px 5px rgba(0, 0, 0, 0.9)" }}>{it.title}</div>
                    {it.subtitle && (
                      <div style={{ position: "absolute", left: 0, right: 0, top: S * TITLE.base + Math.max(subPx * 1.18, S * (SUB.base - TITLE.base)) - baseline * subPx, fontSize: subPx, lineHeight: 1, fontWeight: 400, opacity: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.subtitle}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <div aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {cur ? `${cur.title}${cur.subtitle ? `, ${cur.subtitle}` : ""}. ${active + 1} of ${n}` : ""}
      </div>
    </div>
  );
}

export default CoverFlow;
