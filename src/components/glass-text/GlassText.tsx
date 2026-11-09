import React, { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useMergedRef } from "../../core/refs";
import type { GlassTone } from "../glass/Glass";
import "../glass/glass.css";
import "./glass-text.css";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type GlassTextElement = "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type GlassTextProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The text. One line: it never wraps. */
  children: string | number;
  /** Element to render. Default `"span"`; use a heading for titles. */
  as?: GlassTextElement;
  /**
   * Ink of the area it sits on. `"light"` (over dark photos, or the dark
   * theme) brightens the glass; `"dark"` darkens it. Default `"auto"`
   * follows `data-glass-tone` / the theme like every other glass surface.
   */
  tone?: GlassTone;
  /** Tint the glass with a colour (any CSS colour), e.g. `"var(--rmu-blue)"`. */
  tint?: string;
};

type Origin = { x: number; y: number };

/**
 * Chromium drops the clip-path (and mask) of a backdrop-filter element when
 * an ancestor clips its overflow with rounded corners: the glass then fills
 * its whole box. Inside such a box GlassText draws frosted glyphs instead.
 */
const insideRoundedClip = (el: HTMLElement) => {
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const cs = getComputedStyle(node);
    if ((cs.overflowX !== "visible" || cs.overflowY !== "visible") && /[1-9]/.test(cs.borderRadius)) return true;
  }
  return false;
};

/**
 * Text made of liquid glass, like the iOS 26 lock screen clock: each glyph
 * bends and brightens what is behind it, with a light rim on its edges.
 * Meant for large display text (clocks, hero titles) over a photo or
 * gradient. The text stays real text: selectable, read by screen readers.
 *
 * Browsers without backdrop-filter, and the reduced-transparency setting,
 * get plain text in the inherited colour. Inside a box that clips its
 * overflow with rounded corners (`overflow: hidden` + `border-radius`)
 * Chromium cannot cut the glass to the glyphs, so it draws frosted glyphs
 * without the blur there.
 *
 * @example
 * <GlassText as="h1" tone="light" style={{ fontSize: 120, fontWeight: 700 }}>9:41</GlassText>
 */
const GlassText = forwardRef<HTMLElement, GlassTextProps>(
  ({ children, as = "span", tone = "auto", tint, className, style, ...rest }, ref) => {
    const text = String(children);
    const rootRef = useRef<HTMLElement | null>(null);
    const probeRef = useRef<HTMLSpanElement>(null);
    const glassRef = useRef<HTMLSpanElement>(null);
    const mergedRef = useMergedRef<HTMLElement | null>(rootRef, ref);
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const clipId = `rmu-gt-clip-${id}`;
    const rimId = `rmu-gt-rim-${id}`;

    // where the first glyph's baseline sits inside the glass layer; the SVG
    // copies of the text (clip shape and rim) are drawn from that point
    const [origin, setOrigin] = useState<Origin | null>(null);
    const [flat, setFlat] = useState(false);

    useIsoLayoutEffect(() => {
      const root = rootRef.current;
      const probe = probeRef.current;
      const glass = glassRef.current;
      if (!root || !probe || !glass) return;
      const measure = () => {
        const next = { x: probe.offsetLeft - glass.offsetLeft, y: probe.offsetTop - glass.offsetTop };
        setOrigin((prev) => (prev && prev.x === next.x && prev.y === next.y ? prev : next));
        setFlat(insideRoundedClip(root));
      };
      measure();
      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
      ro?.observe(root);
      const fonts = typeof document !== "undefined" ? document.fonts : undefined;
      fonts?.ready.then(measure);
      fonts?.addEventListener?.("loadingdone", measure);
      return () => {
        ro?.disconnect();
        fonts?.removeEventListener?.("loadingdone", measure);
      };
    }, [text]);

    const Tag = as as React.ElementType;
    const vars = tint ? ({ "--rmu-gt-tint": tint } as React.CSSProperties) : null;

    return (
      <Tag
        ref={mergedRef}
        className={clsx("rmu-glass-text", tint && "rmu-glass-text--tinted", className)}
        style={vars ? { ...vars, ...style } : style}
        data-glass-tone={tone === "auto" ? undefined : tone}
        data-ready={origin ? "" : undefined}
        data-flat={flat ? "" : undefined}
        {...rest}
      >
        <span ref={glassRef} className="rmu-glass-text__glass" aria-hidden="true" style={{ clipPath: `url(#${clipId})` }} />
        <span ref={probeRef} className="rmu-glass-text__probe" aria-hidden="true" />
        <span className="rmu-glass-text__ink">{text}</span>
        <svg className="rmu-glass-text__rim" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <text x={origin?.x ?? 0} y={origin?.y ?? 0}>{text}</text>
            </clipPath>
            <linearGradient id={rimId} x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="0.4" stopColor="#fff" stopOpacity="0.15" />
              <stop offset="0.7" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.65" />
            </linearGradient>
          </defs>
          <text x={origin?.x ?? 0} y={origin?.y ?? 0} stroke={`url(#${rimId})`}>
            {text}
          </text>
        </svg>
      </Tag>
    );
  },
);

GlassText.displayName = "GlassText";

export default GlassText;
