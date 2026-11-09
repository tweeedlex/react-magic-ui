import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./input.css";

export type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> &
  GlassStyleProps & {
    /** Height: small 32px, medium 44px, large 52px. Default `"medium"`. */
    size?: "small" | "medium" | "large";
    /** Icon before the text (e.g. a search glass). */
    leadingIcon?: React.ReactNode;
    /** Icon or element after the text. */
    trailingIcon?: React.ReactNode;
    /** Marks the field invalid (red ring, `aria-invalid`). */
    invalid?: boolean;
    /** Class for the glass capsule around the `<input>`. `className` goes to the `<input>`. */
    wrapperClassName?: string;
    /** Style for the glass capsule around the `<input>`. */
    wrapperStyle?: React.CSSProperties;
    /** @deprecated No effect. */
    enableClickAnimation?: boolean;
  };

/**
 * Capsule glass text field. All `<input>` props go to the inner `<input>`,
 * and `ref` points at it.
 *
 * @example
 * <Input placeholder="Search" leadingIcon={<SearchIcon />} value={q} onChange={(e) => setQ(e.target.value)} />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "medium",
      disabled,
      leadingIcon,
      trailingIcon,
      invalid,
      wrapperClassName,
      wrapperStyle,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      enableClickAnimation: _ignored,
      tone,
      lens,
      layer,
      rootClassName,
      rootStyle,
      className,
      type = "text",
      ...props
    },
    ref,
  ) => {
    return (
      <Glass
        as="label"
        tone={tone}
        lens={lens}
        layer={layer}
        className={clsx(
          "rmu-input",
          `rmu-input--${size}`,
          disabled && "rmu-input--disabled",
          invalid && "rmu-input--invalid",
          rootClassName,
          wrapperClassName,
        )}
        style={rootStyle ? { ...rootStyle, ...wrapperStyle } : wrapperStyle}
      >
        {leadingIcon && <span className="rmu-icon rmu-input__icon">{leadingIcon}</span>}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={clsx("rmu-input__field", className)}
          {...props}
        />
        {trailingIcon && <span className="rmu-icon rmu-input__icon">{trailingIcon}</span>}
      </Glass>
    );
  },
);

Input.displayName = "Input";

export default Input;
