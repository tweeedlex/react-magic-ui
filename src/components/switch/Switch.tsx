import React, { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./switch.css";

export type SwitchProps = Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value"> &
  GlassStyleProps & {
    /** Controlled on/off state. */
    checked?: boolean;
    /** Initial state when uncontrolled. */
    defaultChecked?: boolean;
    /** Called with the next state. */
    onCheckedChange?: (checked: boolean) => void;
    /** Track size. Default `"medium"` (64×28). */
    size?: "small" | "medium" | "large";
    /** @deprecated Use `checked`. */
    isActive?: boolean;
    /** @deprecated Use `onCheckedChange`. */
    setIsActive?: (isActive: boolean) => void;
    /** @deprecated No effect; the switch always springs. */
    enableClickAnimation?: boolean;
  };

/**
 * iOS-style toggle on a glass track.
 *
 * @example
 * const [on, setOn] = useState(false);
 * <Switch checked={on} onCheckedChange={setOn} aria-label="Wi-Fi" />
 */
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      size = "medium",
      disabled,
      checked,
      defaultChecked = false,
      onCheckedChange,
      isActive,
      setIsActive,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      enableClickAnimation: _ignored,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const controlledValue = checked ?? isActive;
    const [inner, setInner] = useState(defaultChecked);
    const on = controlledValue ?? inner;

    const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (disabled || event.defaultPrevented) return;
      const next = !on;
      if (controlledValue === undefined) setInner(next);
      onCheckedChange?.(next);
      setIsActive?.(next);
    };

    return (
      <Glass
        as="button"
        ref={ref}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={toggle}
        className={clsx(
          "rmu-switch",
          `rmu-switch--${size}`,
          on && "rmu-switch--on",
          disabled && "rmu-switch--disabled",
          className,
        )}
        {...props}
      >
        <span className="rmu-switch__fill" aria-hidden="true" />
        <span className="rmu-switch__thumb" aria-hidden="true" />
      </Glass>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
