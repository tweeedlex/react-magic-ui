import React, { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Slider from "../Slider";

describe("Slider component", () => {
  it("changes with the keyboard and calls onValueChange", () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={50} step={5} onValueChange={onValueChange} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenLastCalledWith(55);
    expect(thumb.getAttribute("aria-valuenow")).toBe("55");
    fireEvent.keyDown(thumb, { key: "End" });
    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });

  it("keeps a controlled value and still calls the deprecated onChange", () => {
    const onChange = vi.fn();
    render(<Slider aria-label="Volume" value={10} onChange={onChange} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    fireEvent.keyDown(thumb, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(11);
    expect(thumb.getAttribute("aria-valuenow")).toBe("10");
  });

  it("forwards the ref and extra props to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Slider ref={ref} aria-label="Volume" data-testid="root" />);
    expect(ref.current).toBe(screen.getByTestId("root"));
  });
});
