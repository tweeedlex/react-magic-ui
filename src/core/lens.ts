/**
 * Rim lens: an SVG displacement filter plugged into `backdrop-filter`.
 *
 * Only the rim of a surface bends; the middle stays flat. The map is drawn
 * for a rounded rect, cut into 4 corners + 4 one-pixel edge strips, so a
 * resize only moves the pieces instead of redrawing the map.
 *
 * Chromium only — Firefox parses `url()` in backdrop-filter but draws
 * nothing, Safari ignores it. Everywhere else the CSS-only glass stays.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

let supportCache: boolean | undefined;

/** True when the browser actually draws `url()` inside `backdrop-filter`. */
export function lensSupported(): boolean {
  if (supportCache !== undefined) return supportCache;
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } };
  const brands = nav.userAgentData?.brands;
  const chromium = brands
    ? brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand))
    : /Chrome\//.test(navigator.userAgent) && !/Firefox\//.test(navigator.userAgent);
  supportCache = chromium && CSS.supports("backdrop-filter", "url(#a)");
  return supportCache;
}

type Tiles = {
  K: number;
  scale: number;
  urls: Record<"tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r", string>;
};

const tileCache = new Map<string, Promise<Tiles>>();

function buildTiles(r: number, rim: number): Tiles {
  const K = Math.ceil(Math.max(r, rim));
  const S = 2 * K + 1;
  const half = S / 2;
  const maxOff = 1.1 * rim; // a point at the very edge looks 1.1 × rim inward
  const scale = 2 * maxOff;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(S, S);
  const px = img.data;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const cx = x + 0.5 - half;
      const cy = y + 0.5 - half;
      const ax = Math.abs(cx);
      const ay = Math.abs(cy);

      // distance to the rounded-rect boundary, positive inside
      const qx = ax - (half - r);
      const qy = ay - (half - r);
      const sdf =
        Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
      const d = Math.max(0, -sdf);

      // outward normal from a corner of radius K, so the bend turns smoothly
      const kx = ax - (half - K);
      const ky = ay - (half - K);
      let nx: number;
      let ny: number;
      if (kx > 0 && ky > 0) {
        const l = Math.hypot(kx, ky) || 1;
        nx = kx / l;
        ny = ky / l;
      } else if (kx > ky) {
        nx = 1;
        ny = 0;
      } else {
        nx = 0;
        ny = 1;
      }
      nx *= Math.sign(cx) || 1;
      ny *= Math.sign(cy) || 1;

      // thick slab: hard at the edge, easing to nothing at the rim's inner edge
      const off = d < rim ? maxOff * Math.pow(1 - d / rim, 2.6) : 0;
      const i = (y * S + x) * 4;
      px[i] = clampByte(((-nx * off) / scale + 0.5) * 255);
      px[i + 1] = clampByte(((-ny * off) / scale + 0.5) * 255);
      px[i + 2] = 128;
      px[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const crop = (sx: number, sy: number, sw: number, sh: number) => {
    const c = document.createElement("canvas");
    c.width = sw;
    c.height = sh;
    c.getContext("2d")!.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
    return c.toDataURL("image/png");
  };

  return {
    K,
    scale,
    urls: {
      tl: crop(0, 0, K, K),
      tr: crop(K + 1, 0, K, K),
      bl: crop(0, K + 1, K, K),
      br: crop(K + 1, K + 1, K, K),
      t: crop(K, 0, 1, K),
      b: crop(K, K + 1, 1, K),
      l: crop(0, K, K, 1),
      r: crop(K + 1, K, K, 1),
    },
  };
}

const clampByte = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

/** Maps are built once per radius + rim and decoded before use. */
function getTiles(r: number, rim: number): Promise<Tiles> {
  const key = `${r}|${rim}`;
  let p = tileCache.get(key);
  if (!p) {
    const tiles = buildTiles(r, rim);
    p = Promise.all(
      Object.values(tiles.urls).map((u) => {
        const im = new Image();
        im.src = u;
        return im.decode();
      }),
    ).then(() => tiles);
    tileCache.set(key, p);
  }
  return p;
}

let uid = 0;

export type LensOptions = {
  /** Colour split: red bends this much further, blue this much less. Default 0.15. */
  split?: number;
};

export class Lens {
  private el: HTMLElement;
  private split: number;
  private id = `rmu-lens-${++uid}`;
  private key: string | null = null;
  private svg: SVGSVGElement;
  private ro: ResizeObserver;
  private destroyed = false;
  private K = 0;
  private filter?: SVGFilterElement;
  private flood?: SVGElement;
  private pieces: Partial<Record<keyof Tiles["urls"], SVGElement>> = {};

  constructor(el: HTMLElement, { split = 0.15 }: LensOptions = {}) {
    this.el = el;
    this.split = split;
    // every filter gets its own <svg>
    this.svg = document.createElementNS(SVG_NS, "svg");
    this.svg.setAttribute("width", "0");
    this.svg.setAttribute("height", "0");
    this.svg.setAttribute("aria-hidden", "true");
    this.svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    document.body.append(this.svg);
    this.ro = new ResizeObserver(() => void this.update());
    this.ro.observe(el);
  }

  destroy() {
    this.destroyed = true;
    this.ro.disconnect();
    this.svg.remove();
    this.el.style.removeProperty("--rmu-lens");
    delete this.el.dataset.lens;
  }

  private off() {
    this.el.style.removeProperty("--rmu-lens");
    this.el.dataset.lens = "off";
  }

  async update() {
    const el = this.el;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const cs = getComputedStyle(el);
    // under 32px, or on its own compositing layer: Chrome may draw the map itself
    if (Math.min(w, h) < 32 || cs.willChange !== "auto") return this.off();

    const r = Math.round(Math.min(parseFloat(cs.borderTopLeftRadius) || 0, w / 2, h / 2) * 2) / 2;
    // thick rim on small controls, a thin one on big panels (like iOS)
    const rim = Math.round(Math.max(4, Math.min(20, Math.min(w, h) / 3.5)) * 2) / 2;
    const key = `${r}|${rim}`;

    if (key !== this.key) {
      const tiles = await getTiles(r, rim);
      if (this.destroyed) return;
      this.build(tiles);
      this.key = key;
    }
    this.place(w, h);
    el.style.setProperty("--rmu-lens", `url(#${this.id})`);
    el.dataset.lens = "on";
  }

  private build({ urls, scale, K }: Tiles) {
    this.K = K;
    const f = document.createElementNS(SVG_NS, "filter");
    f.setAttribute("id", this.id);
    f.setAttribute("filterUnits", "userSpaceOnUse");
    f.setAttribute("primitiveUnits", "userSpaceOnUse");
    f.setAttribute("color-interpolation-filters", "sRGB");

    const node = (tag: string, attrs: Record<string, string>) => {
      const n = document.createElementNS(SVG_NS, tag);
      for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
      f.append(n);
      return n;
    };

    this.flood = node("feFlood", { "flood-color": "rgb(128,128,128)", result: "mid" });
    this.pieces = {};
    for (const name of Object.keys(urls) as (keyof Tiles["urls"])[]) {
      this.pieces[name] = node("feImage", {
        href: urls[name],
        preserveAspectRatio: "none",
        result: `m-${name}`,
      });
    }
    const merge = node("feMerge", { result: "map" });
    for (const res of ["mid", "m-t", "m-b", "m-l", "m-r", "m-tl", "m-tr", "m-bl", "m-br"]) {
      const mn = document.createElementNS(SVG_NS, "feMergeNode");
      mn.setAttribute("in", res);
      merge.append(mn);
    }

    const s = this.split;
    const channels: [string, number, string][] = [
      ["R", 1 + s, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
      ["G", 1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
      ["B", 1 - s, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
    ];
    for (const [c, k, m] of channels) {
      node("feDisplacementMap", {
        in: "SourceGraphic",
        in2: "map",
        scale: (scale * k).toFixed(2),
        xChannelSelector: "R",
        yChannelSelector: "G",
        result: `d${c}`,
      });
      node("feColorMatrix", { in: `d${c}`, type: "matrix", values: m, result: `c${c}` });
    }
    node("feBlend", { in: "cR", in2: "cG", mode: "screen", result: "cRG" });
    node("feBlend", { in: "cRG", in2: "cB", mode: "screen" });

    this.svg.replaceChildren(f);
    this.filter = f;
  }

  private place(w: number, h: number) {
    const K = this.K;
    const set = (n: SVGElement | undefined, x: number, y: number, ww: number, hh: number) => {
      if (!n) return;
      n.setAttribute("x", String(x));
      n.setAttribute("y", String(y));
      n.setAttribute("width", String(Math.max(0, ww)));
      n.setAttribute("height", String(Math.max(0, hh)));
    };
    const p = this.pieces;
    set(this.filter, 0, 0, w, h);
    set(this.flood, 0, 0, w, h);
    set(p.tl, 0, 0, K, K);
    set(p.tr, w - K, 0, K, K);
    set(p.bl, 0, h - K, K, K);
    set(p.br, w - K, h - K, K, K);
    set(p.t, K, 0, w - 2 * K, K);
    set(p.b, K, h - K, w - 2 * K, K);
    set(p.l, 0, K, K, h - 2 * K);
    set(p.r, w - K, K, K, h - 2 * K);
  }
}
