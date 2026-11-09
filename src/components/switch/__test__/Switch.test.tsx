import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Switch from "../Switch";

// jsdom does no layout: give the track the default 64px width
const setup = (props: React.ComponentProps<typeof Switch> = {}) => {
  const onCheckedChange = vi.fn();
  render(<Switch aria-label="Wi-Fi" onCheckedChange={onCheckedChange} {...props} />);
  const el = screen.getByRole("switch");
  Object.defineProperty(el, "clientWidth", { configurable: true, value: 64 });
  return { el, onCheckedChange };
};

// a drag ends with pointerup and then the browser's click on the same button
const drag = (el: HTMLElement, from: number, to: number) => {
  fireEvent.pointerDown(el, { button: 0, clientX: from, pointerId: 1 });
  fireEvent.pointerMove(el, { clientX: (from + to) / 2, pointerId: 1 });
  fireEvent.pointerMove(el, { clientX: to, pointerId: 1 });
  fireEvent.pointerUp(el, { clientX: to, pointerId: 1 });
  fireEvent.click(el);
};

describe("Switch", () => {
  it("toggles on click", () => {
    const { el, onCheckedChange } = setup();
    fireEvent.click(el);
    expect(el).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("turns on when the knob is dragged past halfway, once", () => {
    const { el, onCheckedChange } = setup();
    drag(el, 10, 30);
    expect(el).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("stays put when the knob is let go before halfway", () => {
    const { el, onCheckedChange } = setup({ defaultChecked: true });
    drag(el, 30, 26);
    expect(el).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("drags back to off", () => {
    const { el, onCheckedChange } = setup({ defaultChecked: true });
    drag(el, 30, 5);
    expect(el).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("does not drag when disabled", () => {
    const { el, onCheckedChange } = setup({ disabled: true });
    drag(el, 10, 40);
    expect(el).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
