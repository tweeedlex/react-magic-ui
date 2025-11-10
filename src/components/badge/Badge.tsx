import React from "react";
import clsx from "clsx";
import "./style/Badge.scss";

export type BadgeVariant =
  | "default"
  | "positive"
  | "negative"
  | "warning"
  | "info"
  | "neutral";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
};

const variantBackground = {
  default: "bg-default",
  positive: "bg-positive",
  negative: "bg-negative",
  warning: "bg-warning",
  info: "bg-info",
  neutral: "bg-neutral",
} as const;

const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  leadingIcon,
  trailingIcon,
  ...props
}) => {
  return (
    <span
      className={clsx(
        "glass badge inline-flex items-center gap-2 rounded-full text-xs font-semibold uppercase tracking-wide text-white",
        "px-3 py-1",
        variantBackground[variant],
        className,
      )}
      {...props}
    >
      {leadingIcon && <span className="badge__icon">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="badge__icon">{trailingIcon}</span>}
    </span>
  );
};

export default Badge;

