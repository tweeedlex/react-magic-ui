import React, {
  ComponentPropsWithoutRef,
  ElementType,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Lens, lensSupported } from "../../core/lens";
import "./glass.css";
import { setRef } from "../../core/refs";

/** How many real glass surfaces are above this one. */
const GlassDepthContext = createContext(0);

/**
 * Where the surface sits in the glass hierarchy.
 * - `"auto"` — real glass at the top level; an inner layer when nested inside another Glass.
 * - `"surface"` — always real glass (floating things: modals, toasts, menus, popovers).
 * - `"inner"` — always an inner layer: a lighter fill of the glass it sits on, no second blur.
 */
export type GlassLayer = "auto" | "surface" | "inner";

/**
 * Ink (text/icon colour) on the glass.
 * - `"auto"` — follows the theme (dark ink in light theme, light ink in dark theme).
 * - `"light"` — light ink and a darker tint; use over dark images in a light theme.
 * - `"dark"` — dark ink and a light tint, even in dark theme.
 */
export type GlassTone = "auto" | "light" | "dark";

/**
 * What the surface is made of.
 * - `"glass"` — Liquid Glass: light blur, lens at the rim. For controls and
 *   navigation that float over content (buttons, bars, menus, sheets).
 * - `"frosted"` — a softer blur without the lens, for content panels when
 *   the glass look is too busy (Apple keeps Liquid Glass off the content layer).
 */
export type GlassMaterial = "glass" | "frosted";

/** Props every glass component accepts. */
export type GlassStyleProps = {
  /** Surface material. Default `"glass"`. */
  material?: GlassMaterial;
  /** Ink colour on the glass. Default `"auto"`. Can also be set for a whole subtree with `data-glass-tone` on any ancestor. */
  tone?: GlassTone;
  /** Bend the backdrop at the rim (Chromium only, other browsers get flat glass). Default `true` for `"glass"`, `false` for `"frosted"`. */
  lens?: boolean;
  /** Position in the glass hierarchy. Default `"auto"`. */
  layer?: GlassLayer;
  /** @deprecated Use `className` — the glass is one element now. */
  rootClassName?: string;
  /** @deprecated Use `style` — the glass is one element now. */
  rootStyle?: React.CSSProperties;
  /** @deprecated Use `interactive`. */
  enableLiquidAnimation?: boolean;
  /** Plays a short "settle" animation every time it turns `true`. */
  triggerAnimation?: boolean;
};

type GlassOwnProps<T extends ElementType> = GlassStyleProps & {
  /** Element or component to render. Default `"div"`. */
  as?: T;
  /** Hover brightens the tint, press springs the surface. Use for clickable glass. */
  interactive?: boolean;
  /** Selected state of an interactive inner layer (brighter fill + stroke). */
  selected?: boolean;
  children?: React.ReactNode;
};

export type GlassProps<T extends ElementType = "div"> = GlassOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GlassOwnProps<T>>;

function useLens(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || !lensSupported()) return;
    const lens = new Lens(el);
    void lens.update();
    return () => lens.destroy();
  }, [enabled, ref]);
}

function GlassImpl<T extends ElementType = "div">(
  {
    as,
    tone = "auto",
    material = "glass",
    lens: lensProp,
    layer = "auto",
    interactive,
    selected,
    rootClassName,
    rootStyle,
    enableLiquidAnimation,
    triggerAnimation,
    className,
    style,
    children,
    ...rest
  }: GlassProps<T>,
  ref: React.ForwardedRef<Element>,
) {
  const Component: ElementType = as || "div";
  const depth = useContext(GlassDepthContext);
  const inner = layer === "inner" || (layer === "auto" && depth > 0);
  const isInteractive = interactive ?? enableLiquidAnimation ?? false;
  const lens = lensProp ?? material === "glass";

  const localRef = useRef<HTMLElement | null>(null);
  const composedRef = useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node;
      setRef(ref, node);
    },
    [ref],
  );
  useLens(localRef, lens && !inner);

  // a one-shot settle animation, retriggered each time the flag turns on
  const [pulse, setPulse] = useState(0);
  const [lastTrigger, setLastTrigger] = useState(triggerAnimation);
  if (triggerAnimation !== lastTrigger) {
    setLastTrigger(triggerAnimation);
    if (triggerAnimation) setPulse((p) => p + 1);
  }

  return (
    <GlassDepthContext.Provider value={inner ? depth : depth + 1}>
      <Component
        ref={composedRef}
        className={clsx(
          "rmu-glass",
          inner && "rmu-glass--inner",
          !inner && material === "frosted" && "rmu-glass--frosted",
          isInteractive && "rmu-glass--interactive",
          selected && "rmu-glass--selected",
          pulse > 0 && (pulse % 2 ? "rmu-glass--pulse-a" : "rmu-glass--pulse-b"),
          rootClassName,
          className,
        )}
        style={rootStyle ? { ...rootStyle, ...style } : style}
        data-glass-tone={tone === "auto" ? undefined : tone}
        {...rest}
      >
        {children}
      </Component>
    </GlassDepthContext.Provider>
  );
}

/**
 * The liquid glass material. Every component in the kit is built on it;
 * use it directly for custom surfaces.
 *
 * Nest freely: a Glass inside a Glass renders as an inner layer of the outer
 * one (one real glass level, like iOS 26), unless you set `layer="surface"`.
 *
 * @example
 * <Glass className="my-panel" style={{ padding: 16, borderRadius: 24 }}>
 *   <h3>Now playing</h3>
 * </Glass>
 *
 * @example Clickable glass
 * <Glass as="button" interactive onClick={play}>Play</Glass>
 */
const Glass = forwardRef(GlassImpl) as (<T extends ElementType = "div">(
  props: GlassProps<T> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

Glass.displayName = "Glass";

/** Reads whether the current component is rendered on top of glass. */
// eslint-disable-next-line react-refresh/only-export-components
export const useGlassDepth = () => useContext(GlassDepthContext);

export default Glass;
