import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./badge.css";

export type BadgeVariant = "default" | "positive" | "negative" | "warning" | "info" | "neutral";

export type BadgeProps = ComponentPropsWithoutRef<"span"> &
  GlassStyleProps & {
    /** `"default"` is clear glass; the rest are tinted with a status colour. */
    variant?: BadgeVariant;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  };

const tints: Partial<Record<BadgeVariant, string>> = {
  positive: "var(--rmu-green)",
  negative: "var(--rmu-red)",
  warning: "var(--rmu-orange)",
  info: "var(--rmu-blue)",
  neutral: "var(--rmu-gray)",
};

/**
 * Small capsule label.
 *
 * @example
 * <Badge variant="positive">Online</Badge>
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, style, variant = "default", leadingIcon, trailingIcon, ...props }, ref) => {
    const tint = tints[variant];
    return (
      <Glass
        as="span"
        ref={ref}
        className={clsx("rmu-badge", `rmu-badge--${variant}`, tint && "rmu-tinted", className)}
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
