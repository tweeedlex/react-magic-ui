import React, { forwardRef, ComponentPropsWithoutRef } from "react";
import "./style/Button.scss";
import clsx from "clsx";
import Glass from "../glass/Glass.tsx";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  text?: string;
  children?: React.ReactNode;
  variant?: "default" | "danger" | "link";
  size?: "small" | "medium" | "large";
  enableClickAnimation?: boolean;
};

const sizeStyles = {
  small: "small text-sm",
  medium: "medium text-lg",
  large: "large text-md",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  size = "medium",
  variant,
  disabled,
  text,
  children,
  onClick,
  enableClickAnimation = true,
  className,
  ...props
}, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <Glass
      as="button"
      ref={ref}
      type="button"
      onClick={handleClick}
      enableLiquidAnimation={!disabled && enableClickAnimation}
      className={clsx(
        "btn",
        variant && `bg-${variant}`,
        sizeStyles[size],
        disabled ? "opacity-50 cursor-not-allowed" : "",
        "hover:bg-white/30 active:bg-white/40",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children ?? text}
    </Glass>
  );
});

Button.displayName = "Button";

export default Button;
