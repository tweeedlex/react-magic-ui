import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./button.css";

export type ButtonVariant = "default" | "prominent" | "positive" | "negative" | "warning";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> &
  GlassStyleProps & {
    /** Button label. Same as `children`; `children` wins when both are set. */
    text?: string;
    children?: React.ReactNode;
    /**
     * - `"default"` — clear glass.
     * - `"prominent"` — tinted with the accent colour (primary action).
     * - `"positive" | "negative" | "warning"` — tinted with a status colour.
     */
    variant?: ButtonVariant;
    /** Height: small 32px, medium 44px, large 52px. Default `"medium"`. */
    size?: ButtonSize;
    /** Circle icon button (pass an icon as children and an `aria-label`). */
    rounded?: boolean;
    /** Spring + brighten on press. Default `true`. */
    enableClickAnimation?: boolean;
  };

const tints: Partial<Record<ButtonVariant, string>> = {
  prominent: "var(--rmu-accent)",
  positive: "var(--rmu-green)",
  negative: "var(--rmu-red)",
  warning: "var(--rmu-orange)",
};

/**
 * Capsule glass button.
 *
 * @example
 * <Button onClick={save}>Save</Button>
 * <Button variant="prominent" size="large">Continue</Button>
 * <Button rounded aria-label="Close"><XIcon /></Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = "medium",
      variant = "default",
      disabled,
      text,
      children,
      enableClickAnimation = true,
      rounded = false,
      className,
      style,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const tint = tints[variant];
    return (
      <Glass
        as="button"
        ref={ref}
        type={type}
        interactive={!disabled && enableClickAnimation}
        disabled={disabled}
        className={clsx(
          "rmu-button",
          `rmu-button--${size}`,
          `rmu-button--${variant}`,
          rounded && "rmu-button--rounded",
          tint && "rmu-tinted",
          disabled && "rmu-button--disabled",
          className,
        )}
        style={tint ? ({ "--rmu-tint": tint, ...style } as React.CSSProperties) : style}
        {...props}
      >
        {children ?? text}
      </Glass>
    );
  },
);

Button.displayName = "Button";

export default Button;
