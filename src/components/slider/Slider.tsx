import React, { ComponentPropsWithoutRef, forwardRef, useRef, useState } from "react";
import clsx from "clsx";
import Glass, { GlassStyleProps } from "../glass/Glass";
import "./slider.css";

export type SliderProps = Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue" | "children"> &
  Pick<GlassStyleProps, "tone"> & {
  /** Controlled value. */
  value?: number;
  /** Initial value when uncontrolled. Default 50. */
  defaultValue?: number;
  /** Called with the new value while dragging and on keyboard changes. */
  onValueChange?: (value: number) => void;
  /** @deprecated Use `onValueChange` (same signature). */
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Track thickness / thumb size. Default `"medium"`. */
  size?: "small" | "medium" | "large";
  /** Show the current value after the track. */
  showValue?: boolean;
  /** Accessible name of the thumb. Use this or `aria-labelledby`. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** @deprecated No effect. */
  enableClickAnimation?: boolean;
};

/**
 * iOS-style slider: thin glass track, accent fill, white capsule thumb that
 * swells while dragged. Keyboard: arrows, Page Up/Down, Home/End.
 *
 * @example
 * <Slider aria-label="Volume" value={vol} onValueChange={setVol} />
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>(({
  size = "medium",
  disabled,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  onValueChange,
  onChange,
  showValue = false,
  tone,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enableClickAnimation: _ignored,
  ...rest
}, ref) => {
  const [inner, setInner] = useState(defaultValue);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const current = value ?? inner;
  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100;

  const commit = (v: number) => {
    const clamped = Math.max(min, Math.min(max, Math.round((v - min) / step) * step + min));
    const fixed = Number(clamped.toFixed(6));
    if (fixed === current) return;
    if (value === undefined) setInner(fixed);
    onValueChange?.(fixed);
    onChange?.(fixed);
  };

  const fromPointer = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    commit(min + ((clientX - r.left) / r.width) * (max - min));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromPointer(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const big = (max - min) / 10;
    const map: Record<string, number> = {
      ArrowRight: current + step, ArrowUp: current + step,
      ArrowLeft: current - step, ArrowDown: current - step,
      PageUp: current + big, PageDown: current - big,
      Home: min, End: max,
    };
    if (e.key in map) {
      e.preventDefault();
      commit(map[e.key]);
    }
  };

  return (
    <div
      ref={ref}
      className={clsx("rmu-slider", `rmu-slider--${size}`, dragging && "rmu-slider--dragging", disabled && "rmu-slider--disabled", className)}
      {...rest}
    >
      <div
        ref={trackRef}
        className="rmu-slider__hit"
        onPointerDown={onPointerDown}
        onPointerMove={(e) => dragging && fromPointer(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <Glass tone={tone} lens={false} className="rmu-slider__track">
          <span className="rmu-slider__fill" style={{ width: `${pct}%` }} />
        </Glass>
        <span
          className="rmu-slider__thumb rmu-focusable"
          style={{ left: `${pct}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-orientation="horizontal"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-disabled={disabled || undefined}
          onKeyDown={onKeyDown}
        />
      </div>
      {showValue && <span className="rmu-slider__value">{current}</span>}
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;
