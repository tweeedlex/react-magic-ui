import React, { ComponentPropsWithoutRef, forwardRef, useRef, useState } from "react";
import clsx from "clsx";
import { useMergedRef } from "../../core/refs";
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
    /** Track colour when on. Any CSS colour. Default iOS green (`--rmu-green`). */
    tint?: string;
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
 * iOS-style toggle on a glass track. Click or tap to toggle, or drag the
 * knob left and right: it follows the pointer and settles on the side it
 * is released on.
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
      tint,
      className,
      style,
      onClick,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      ...props
    },
    ref,
  ) => {
    const controlledValue = checked ?? isActive;
    const [inner, setInner] = useState(defaultChecked);
    const on = controlledValue ?? inner;

    const localRef = useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRef<HTMLButtonElement>(localRef, ref);

    const commit = (next: boolean) => {
      if (next === on) return;
      if (controlledValue === undefined) setInner(next);
      onCheckedChange?.(next);
      setIsActive?.(next);
    };

    // drag: the knob follows the pointer; past halfway it lands on the other side
    const drag = useRef<{ startX: number; from: number; travel: number; moved: boolean } | null>(null);
    const suppressClick = useRef(false);
    const [dragX, setDragX] = useState<number | null>(null);

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      suppressClick.current = false;
      if (disabled || event.defaultPrevented || event.button !== 0) return;
      const el = event.currentTarget;
      const cs = getComputedStyle(el);
      const tw = parseFloat(cs.getPropertyValue("--tw")) || 38;
      const pad = parseFloat(cs.getPropertyValue("--pad")) || 2;
      // while held the knob is 8px wider, so it travels 8px less
      const travel = Math.max(0, el.clientWidth - tw - 8 - 2 * pad);
      drag.current = { startX: event.clientX, from: on ? travel : 0, travel, moved: false };
      el.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event);
      const d = drag.current;
      if (!d) return;
      const dx = event.clientX - d.startX;
      if (!d.moved && Math.abs(dx) < 3) return;
      d.moved = true;
      setDragX(Math.min(d.travel, Math.max(0, d.from + dx)));
    };

    const endDrag = (event: React.PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
      const d = drag.current;
      drag.current = null;
      if (!d || !d.moved) return;
      // the click that follows a drag must not toggle again
      suppressClick.current = true;
      setDragX(null);
      if (!cancelled) {
        const x = Math.min(d.travel, Math.max(0, d.from + event.clientX - d.startX));
        commit(x > d.travel / 2);
      }
    };

    const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (suppressClick.current) {
        suppressClick.current = false;
        return;
      }
      if (disabled || event.defaultPrevented) return;
      commit(!on);
    };

    const dragging = dragX !== null;
    const shownOn = dragging ? dragX > (drag.current?.travel ?? 0) / 2 : on;
    const rootStyle = {
      ...(tint ? { "--rmu-switch-on": tint } : null),
      ...(dragging ? { "--rmu-switch-x": `${dragX}px` } : null),
      ...style,
    } as React.CSSProperties;

    return (
      <Glass
        as="button"
        ref={mergedRef}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={toggle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerUp?.(event);
          endDrag(event, false);
        }}
        onPointerCancel={(event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerCancel?.(event);
          endDrag(event, true);
        }}
        className={clsx(
          "rmu-switch",
          `rmu-switch--${size}`,
          shownOn && "rmu-switch--on",
          dragging && "rmu-switch--dragging",
          disabled && "rmu-switch--disabled",
          className,
        )}
        style={rootStyle}
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
