import React, { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Select from "../Select";

const options = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
];

describe("Select component", () => {
  it("calls onValueChange and onOpenChange when an option is picked", () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    render(<Select aria-label="Size" options={options} onValueChange={onValueChange} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Size" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByRole("option", { name: "Medium" }));
    expect(onValueChange).toHaveBeenCalledWith("m");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("button", { name: "Size" }).textContent).toContain("Medium");
  });

  it("still calls the deprecated onChange", () => {
    const onChange = vi.fn();
    render(<Select aria-label="Size" options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Size" }));
    fireEvent.click(screen.getByRole("option", { name: "Small" }));
    expect(onChange).toHaveBeenCalledWith("s");
  });

  it("forwards the ref to the trigger and posts its value with a form", () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<Select ref={ref} aria-label="Size" name="size" options={options} defaultValue="s" />);
    expect(ref.current).toBe(screen.getByRole("button", { name: "Size" }));
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe("size");
    expect(hidden.value).toBe("s");
  });
});
