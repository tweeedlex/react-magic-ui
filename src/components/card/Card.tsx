import { ComponentPropsWithoutRef, forwardRef } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./card.css";

export type CardProps = ComponentPropsWithoutRef<"div"> &
  GlassStyleProps & {
    /** Padding and corner radius: small 12/18, medium 20/26, large 28/34. Default `"medium"`. */
    size?: "small" | "medium" | "large";
    /** Flex direction of the content. Default `"column"`. */
    direction?: "column" | "row";
    /** `align-items`. Default `"stretch"`. */
    align?: "center" | "start" | "end" | "stretch";
    /** `justify-content`. Default `"start"`. */
    justify?: "center" | "start" | "end" | "space-between" | "space-around";
    /** Gap between children in px. Default 12. */
    gap?: number;
  };

/**
 * Panel for grouping content. Frosted by default: Apple keeps Liquid Glass for
 * controls and navigation, content panels get a plain blur. Pass
 * `material="glass"` for a Liquid Glass card. Components inside render as inner
 * layers of the card (no glass-on-glass blur).
 *
 * @example
 * <Card>
 *   <h3>Settings</h3>
 *   <Switch aria-label="Wi-Fi" />
 * </Card>
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { children, material = "frosted", size = "medium", direction = "column", align = "stretch", justify = "start", gap, className, style, ...props },
    ref,
  ) => (
    <Glass
      ref={ref}
      material={material}
      className={clsx("rmu-card", `rmu-card--${size}`, className)}
      style={{
        flexDirection: direction,
        alignItems: align === "start" || align === "end" ? `flex-${align}` : align,
        justifyContent: justify === "start" || justify === "end" ? `flex-${justify}` : justify,
        ...(gap !== undefined ? { gap } : null),
        ...style,
      }}
      {...props}
    >
      {children}
    </Glass>
  ),
);

Card.displayName = "Card";

export default Card;
