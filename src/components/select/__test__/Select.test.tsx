import React, { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Select from "../Select";

const options = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
];

describe("Select component", () => {
  it("calls onValueChange and onOpenChange when an option is picked", () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    render(<Select aria-label="Size" options={options} onValueChange={onValueChange} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("combobox", { name: "Size" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByRole("option", { name: "Medium" }));
    expect(onValueChange).toHaveBeenCalledWith("m");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("combobox", { name: "Size" }).textContent).toContain("Medium");
  });

  it("still calls the deprecated onChange", () => {
    const onChange = vi.fn();
    render(<Select aria-label="Size" options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("combobox", { name: "Size" }));
    fireEvent.click(screen.getByRole("option", { name: "Small" }));
    expect(onChange).toHaveBeenCalledWith("s");
  });

  it("forwards the ref to the trigger and posts its value with a form", () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<Select ref={ref} aria-label="Size" name="size" options={options} defaultValue="s" />);
    expect(ref.current).toBe(screen.getByRole("combobox", { name: "Size" }));
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe("size");
    expect(hidden.value).toBe("s");
  });

  it("points aria-activedescendant at the highlighted option", () => {
    render(<Select aria-label="Size" options={options} defaultValue="m" />);
    const trigger = screen.getByRole("combobox", { name: "Size" });
    expect(trigger).not.toHaveAttribute("aria-activedescendant");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const medium = screen.getByRole("option", { name: "Medium" });
    expect(medium.id).not.toBe("");
    expect(trigger.getAttribute("aria-activedescendant")).toBe(medium.id);

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "Large" }).id);

    fireEvent.keyDown(trigger, { key: "Home" });
    expect(trigger.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "Small" }).id);

    fireEvent.keyDown(trigger, { key: "End" });
    expect(trigger.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "Large" }).id);
  });

  it("closes on Escape without letting it reach a modal around it", () => {
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const onOpenChange = vi.fn();
    render(<Select aria-label="Size" options={options} onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("combobox", { name: "Size" });
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onWindowKey).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onWindowKey);
  });

  it("opens above the trigger when there is no room below", () => {
    const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(200);
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: 700, bottom: 744, left: 20, right: 220, width: 200, height: 44, x: 20, y: 700, toJSON: () => ({}),
    } as DOMRect);
    const innerHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    try {
      render(<Select aria-label="Size" options={options} />);
      fireEvent.click(screen.getByRole("combobox", { name: "Size" }));
      const menu = screen.getByRole("listbox");
      // 700 (trigger top) - 8 (gap) - 200 (menu height)
      expect(menu.style.top).toBe("492px");
    } finally {
      height.mockRestore();
      rect.mockRestore();
      Object.defineProperty(window, "innerHeight", { configurable: true, value: innerHeight });
    }
  });
});
