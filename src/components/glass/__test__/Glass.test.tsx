import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Glass from "../Glass";

describe("Glass", () => {
  it("records the touch point on interactive glass for the press glow", () => {
    const onPointerDown = vi.fn();
    render(
      <Glass as="button" interactive onPointerDown={onPointerDown}>
        Play
      </Glass>,
    );
    const button = screen.getByRole("button");
    button.getBoundingClientRect = () => ({ left: 100, top: 50, width: 80, height: 40 }) as DOMRect;
    fireEvent.pointerDown(button, { clientX: 130, clientY: 62 });
    expect(button.style.getPropertyValue("--rmu-px")).toBe("30px");
    expect(button.style.getPropertyValue("--rmu-py")).toBe("12px");
    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });

  it("leaves static glass alone", () => {
    render(<Glass data-testid="panel">Text</Glass>);
    const panel = screen.getByTestId("panel");
    fireEvent.pointerDown(panel, { clientX: 10, clientY: 10 });
    expect(panel.style.getPropertyValue("--rmu-px")).toBe("");
  });
});
