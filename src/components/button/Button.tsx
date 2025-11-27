import React, { forwardRef, ComponentPropsWithoutRef } from "react";
import styles from "./style/Button.module.scss";
import clsx from "clsx";
import Glass from "../glass/Glass.tsx";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  text?: string;
  children?: React.ReactNode;
  variant?: "default" | "positive" | "negative" | "warning";
  size?: "small" | "medium" | "large";
  enableClickAnimation?: boolean;
  rounded?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  size = "medium",
  variant,
  disabled,
  text,
  children,
  onClick,
  enableClickAnimation = true,
  rounded = false,
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
        styles.btn,
        variant && `bg-${variant}`,
        styles[size],
        disabled && styles.disabled,
        rounded && styles.rounded,
        className,
      )}
      rootClassName={rounded && styles.roundedRoot}
      disabled={disabled}
      {...props}
    >
      {children ?? text}
    </Glass>
  );
});

Button.displayName = "Button";

export default Button;
