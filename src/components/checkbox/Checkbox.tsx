import React, { ComponentPropsWithoutRef, forwardRef, useId, useState } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./checkbox.css";
import { Checkmark } from "../../core/icons";

export type CheckboxProps = Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value"> &
  GlassStyleProps & {
    /** Controlled checked state. */
    checked?: boolean;
    /** Initial state when uncontrolled. */
    defaultChecked?: boolean;
    /** Called with the next state. */
    onCheckedChange?: (checked: boolean) => void;
    /** @deprecated Use `onCheckedChange` (same signature). */
    onChange?: (checked: boolean) => void;
    /** Text next to the box; clicking it toggles too. */
    label?: React.ReactNode;
    /** Box size: small 18px, medium 22px, large 26px. Default `"medium"`. */
    size?: "small" | "medium" | "large";
    /** @deprecated No effect. */
    enableClickAnimation?: boolean;
  };

/**
 * Round-cornered glass checkbox with an animated check.
 *
 * @example
 * <Checkbox label="Remember me" checked={remember} onCheckedChange={setRemember} />
 */
const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      size = "medium",
      disabled,
      checked,
      defaultChecked = false,
      onCheckedChange,
      onChange,
      label,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      enableClickAnimation: _ignored,
      className,
      id,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [inner, setInner] = useState(defaultChecked);
    const on = checked ?? inner;
    const autoId = useId();
    const boxId = id ?? autoId;

    const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (disabled || event.defaultPrevented) return;
      const next = !on;
      if (checked === undefined) setInner(next);
      onCheckedChange?.(next);
      onChange?.(next);
    };

    return (
      <span className={clsx("rmu-checkbox", `rmu-checkbox--${size}`, disabled && "rmu-checkbox--disabled", className)}>
        <Glass
          as="button"
          ref={ref}
          id={boxId}
          type="button"
          role="checkbox"
          aria-checked={on}
          disabled={disabled}
          onClick={toggle}
          className={clsx("rmu-checkbox__box", on && "rmu-tinted rmu-checkbox__box--on")}
          style={on ? ({ "--rmu-tint": "var(--rmu-accent)" } as React.CSSProperties) : undefined}
          {...props}
        >
          <Checkmark className="rmu-checkbox__check" />
        </Glass>
        {label && (
          <label htmlFor={boxId} className="rmu-checkbox__label">
            {label}
          </label>
        )}
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
