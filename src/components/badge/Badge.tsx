import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./badge.css";

export type BadgeVariant = "default" | "notification";

export type BadgeProps = ComponentPropsWithoutRef<"span"> &
  GlassStyleProps & {
    /**
     * - `"default"` — a glass label ("New", "Beta", a version).
     * - `"notification"` — the iOS red oval with a count, for things that need
     *   attention. Keep the content to a short number; glass props are ignored.
     */
    variant?: BadgeVariant;
    /** Tints the glass of a `"default"` badge. Any CSS colour. */
    tint?: string;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  };

/**
 * Small capsule label, or a notification count.
 *
 * @example
 * <Badge>Beta</Badge>
 * <Badge tint="var(--rmu-blue)">New</Badge>
 * <Badge variant="notification" aria-label="3 unread">3</Badge>
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, style, variant = "default", tint, leadingIcon, trailingIcon, ...props }, ref) => {
    if (variant === "notification") {
      // solid like iOS, so it reads over anything
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tone, lens, layer, material, rootClassName, rootStyle, enableLiquidAnimation, triggerAnimation, ...rest } = props;
      return (
        <span ref={ref} className={clsx("rmu-badge", "rmu-badge--notification", className)} style={style} {...rest}>
          {children}
        </span>
      );
    }
    return (
      <Glass
        as="span"
        ref={ref}
        className={clsx("rmu-badge", "rmu-badge--default", tint && "rmu-tinted", className)}
        style={tint ? ({ "--rmu-tint": tint, ...style } as React.CSSProperties) : style}
        {...props}
      >
        {leadingIcon && <span className="rmu-icon rmu-badge__icon">{leadingIcon}</span>}
        {children}
        {trailingIcon && <span className="rmu-icon rmu-badge__icon">{trailingIcon}</span>}
      </Glass>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
