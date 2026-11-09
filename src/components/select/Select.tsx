import React, { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
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
  onValueChange?: (value: string) => void;
  /** @deprecated Use `onValueChange` (same signature). */
  onChange?: (value: string) => void;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Form field name: renders a hidden input with the value, so the select posts with a `<form>`. */
  name?: string;
  /** Shown when nothing is selected. Default `"Select an option"`. */
  placeholder?: string;
  disabled?: boolean;
  /** Height: small 32px, medium 44px, large 52px. Default `"medium"`. */
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
  /** Id of the trigger button (for a `<label htmlFor>`). */
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
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
 *   onValueChange={setSize}
 * />
 */
/**
 * Keyframe that squeezes the menu onto the trigger's rect (scale from the
 * top-left corner, radius corrected for the scale). Null when there is
 * nothing to animate: no Web Animations API (tests, old browsers) or the
 * user asked for reduced motion.
 */
function morphFrom(trigger: HTMLElement, menu: HTMLElement): Keyframe | null {
  if (typeof menu.animate !== "function") return null;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return null;
  const t = trigger.getBoundingClientRect();
  const m = menu.getBoundingClientRect();
  if (!m.width || !m.height || !t.width || !t.height) return null;
  const sx = t.width / m.width;
  const sy = t.height / m.height;
  const r = t.height / 2;
  return {
    transform: `translate(${t.left - m.left}px, ${t.top - m.top}px) scale(${sx}, ${sy})`,
    opacity: 0.5,
    borderRadius: `${r / sx}px / ${r / sy}px`,
  };
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(({
  size = "medium",
  disabled,
  options,
  value,
  defaultValue,
  onValueChange,
  onChange,
  onOpenChange,
  name,
  placeholder = "Select an option",
  tone,
  lens,
  className,
  style,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}, ref) => {
  const [open, setOpenState] = useState(false);
  const setOpen = (next: boolean) => {
    if (next === open) return;
    setOpenState(next);
    onOpenChange?.(next);
  };
  const [inner, setInner] = useState(defaultValue);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // the menu is portalled to <body> (glass can't sample the page from inside other glass)
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  // the menu is portalled to body, so it takes the theme and ink tone of the trigger's ancestors
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const menuOpen = open && !disabled;
  // stays mounted after closing until the menu has folded back into the trigger
  const [mounted, setMounted] = useState(false);
  if (menuOpen && !mounted) setMounted(true);
  const menuShown = mounted && !!pos;
  useLayoutEffect(() => {
    if (menuShown && menuWrapRef.current) syncGlassContext(menuWrapRef.current, rootRef.current);
  }, [menuShown]);

  // iOS 26: the menu grows out of the trigger and folds back into it
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const trigger = rootRef.current;
    if (!menuShown || !menu || !trigger) return;
    const from = morphFrom(trigger, menu);
    if (menuOpen) {
      if (!from) return;
      const anim = menu.animate([from, { transform: "none", opacity: 1, borderRadius: "22px" }], {
        duration: 460,
        easing: "cubic-bezier(.25, 1.18, .5, 1)",
      });
      return () => anim.cancel();
    }
    if (!from) {
      setMounted(false);
      return;
    }
    const anim = menu.animate([{ transform: "none", opacity: 1, borderRadius: "22px" }, { ...from, opacity: 0 }], {
      duration: 220,
      easing: "cubic-bezier(.4, 0, .7, 1)",
      fill: "forwards",
    });
    // finish events can lag in background tabs; the timer makes sure it unmounts
    const done = window.setTimeout(() => setMounted(false), 260);
    anim.onfinish = () => setMounted(false);
    return () => {
      window.clearTimeout(done);
      anim.onfinish = null;
      anim.cancel();
    };
  }, [menuShown, menuOpen]);
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
    onValueChange?.(opt.value);
    onChange?.(opt.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpenState(false);
      onOpenChange?.(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {name !== undefined && <input type="hidden" name={name} value={current ?? ""} />}
      <Glass
        as="button"
        ref={ref as React.Ref<Element>}
        type="button"
        id={id}
        tone={tone}
        lens={lens}
        interactive={!disabled}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
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

      {menuShown && typeof document !== "undefined" && createPortal(
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
          aria-hidden={menuOpen ? undefined : true}
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
});

Select.displayName = "Select";

export default Select;
