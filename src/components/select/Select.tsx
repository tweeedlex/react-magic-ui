import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { syncGlassContext } from "../../core/portal";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./select.css";
import { Checkmark, ChevronDown } from "../../core/icons";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Pick<GlassStyleProps, "tone" | "lens"> & {
  /** The choices. */
  options: SelectOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the chosen option's `value`. */
  onChange?: (value: string) => void;
  /** Shown when nothing is selected. Default `"Select an option"`. */
  placeholder?: string;
  disabled?: boolean;
  /** Height: small 32px, medium 44px, large 52px. Default `"medium"`. */
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  "aria-label"?: string;
  /** @deprecated No effect. */
  enableClickAnimation?: boolean;
};

/**
 * Glass capsule that opens a floating glass menu.
 *
 * @example
 * <Select
 *   options={[{ value: "s", label: "Small" }, { value: "l", label: "Large" }]}
 *   value={size}
 *   onChange={setSize}
 * />
 */
const Select: React.FC<SelectProps> = ({
  size = "medium",
  disabled,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  tone,
  lens,
  className,
  style,
  id,
  "aria-label": ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(defaultValue);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // the menu is portalled to <body> (glass can't sample the page from inside other glass)
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  // the menu is portalled to body, so it takes the theme and ink tone of the trigger's ancestors
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const menuShown = open && !disabled && !!pos;
  useLayoutEffect(() => {
    if (menuShown && menuWrapRef.current) syncGlassContext(menuWrapRef.current, rootRef.current);
  }, [menuShown]);
  const listId = useId();

  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);

  // opening highlights the current option
  const openMenu = (next: boolean) => {
    if (next) setActive(Math.max(0, options.findIndex((o) => o.value === current)));
    setOpen(next);
  };

  const choose = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (value === undefined) setInner(opt.value);
    onChange?.(opt.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // keep the menu under the trigger while the page scrolls or resizes
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const r = rootRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 8, left: r.left, width: r.width });
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openMenu(true);
      return;
    }
    if (!open) return;
    const step = (dir: 1 | -1) => {
      let i = active;
      for (let n = 0; n < options.length; n++) {
        i = (i + dir + options.length) % options.length;
        if (!options[i].disabled) break;
      }
      setActive(i);
    };
    if (e.key === "ArrowDown") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (options[active]) choose(options[active]); }
    else if (e.key === "Escape" || e.key === "Tab") setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={clsx("rmu-select", `rmu-select--${size}`, disabled && "rmu-select--disabled", className)}
      style={style}
    >
      <Glass
        as="button"
        type="button"
        id={id}
        tone={tone}
        lens={lens}
        interactive={!disabled}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => !disabled && openMenu(!open)}
        onKeyDown={onKeyDown}
        className="rmu-select__trigger"
      >
        <span className={clsx("rmu-select__value", !selected && "rmu-select__placeholder")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={clsx("rmu-icon rmu-select__chevron", open && "rmu-select__chevron--open")} />
      </Glass>

      {open && !disabled && pos && typeof document !== "undefined" && createPortal(
        <div ref={menuWrapRef}>
        <Glass
          ref={menuRef as React.Ref<Element>}
          layer="surface"
          tone={tone}
          lens={lens}
          material="frosted"
          className={clsx("rmu-glass--dense rmu-select__menu", `rmu-select__menu--${size}`)}
          style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
          role="listbox"
          id={listId}
        >
          {options.map((opt, i) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === current}
              aria-disabled={opt.disabled || undefined}
              className={clsx(
                "rmu-select__option",
                i === active && "rmu-select__option--active",
                opt.disabled && "rmu-select__option--disabled",
              )}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(opt)}
            >
              <Checkmark className="rmu-icon rmu-select__tick"
                style={{ visibility: opt.value === current ? "visible" : "hidden" }} />
              <span className="rmu-ink">{opt.label}</span>
            </div>
          ))}
        </Glass>
        </div>,
        document.body,
      )}
    </div>
  );
};

Select.displayName = "Select";

export default Select;
