import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./button.css";

export type ButtonVariant = "glass" | "prominent";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> &
  GlassStyleProps & {
    /** Button label. Same as `children`; `children` wins when both are set. */
    text?: string;
    children?: React.ReactNode;
    /**
     * The two iOS 26 button styles.
     * - `"glass"` — clear glass (default). Most buttons.
     * - `"prominent"` — glass tinted with the accent colour. The primary action;
     *   keep it to one per screen or bar.
     */
    variant?: ButtonVariant;
    /**
     * Destructive role (delete, remove): red label on `"glass"`, red tint on
     * `"prominent"`.
     */
    destructive?: boolean;
    /**
     * Custom colour, like `.tint()` in SwiftUI: the tint of a `"prominent"`
     * button, the label colour of a `"glass"` one. Any CSS colour. Default:
     * the accent (`--rmu-accent`, system blue). `destructive` wins over it.
     */
    tint?: string;
    /** Height: small 32px, medium 44px, large 52px. Default `"medium"`. */
    size?: ButtonSize;
    /** Circle icon button (pass an icon as children and an `aria-label`). */
    rounded?: boolean;
    /** Spring + brighten on press. Default `true`. */
    enableClickAnimation?: boolean;
  };

/**
 * Capsule glass button.
 *
 * @example
 * <Button onClick={cancel}>Cancel</Button>
 * <Button variant="prominent" onClick={save}>Done</Button>
 * <Button destructive onClick={remove}>Delete</Button>
 * <Button variant="prominent" tint="var(--rmu-green)">Answer</Button>
 * <Button rounded aria-label="Close"><XIcon /></Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = "medium",
      variant = "glass",
      destructive = false,
      tint,
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
    const prominent = variant === "prominent";
    const color = destructive ? "var(--rmu-red)" : tint;
    // prominent: the colour fills the glass; glass: it colours the label
    const vars = prominent
      ? { "--rmu-tint": color ?? "var(--rmu-accent)" }
      : color
        ? { "--rmu-label": color }
        : null;
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
          destructive && "rmu-button--destructive",
          rounded && "rmu-button--rounded",
          prominent && "rmu-tinted",
          !prominent && color && "rmu-button--colored",
          disabled && "rmu-button--disabled",
          className,
        )}
        style={vars ? ({ ...vars, ...style } as React.CSSProperties) : style}
        {...props}
      >
        {children ?? text}
      </Glass>
    );
  },
);

Button.displayName = "Button";

export default Button;
