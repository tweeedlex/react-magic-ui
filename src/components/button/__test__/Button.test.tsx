import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button component", () => {
  it("renders provided text content", () => {
    render(<Button text="press me" />);
    expect(screen.getByRole("button").textContent).toBe("press me");
  });

  it("applies default styling when no variant or size provided", () => {
    render(<Button text="default styles" />);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.className).toContain("rmu-button");
    expect(button.className).toContain("medium");
  });

  it("applies variant and size specific classes", () => {
    render(<Button text="done" variant="prominent" size="small" />);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.className).toContain("rmu-button--prominent");
    expect(button.className).toContain("rmu-tinted");
    expect(button.style.getPropertyValue("--rmu-tint")).toBe("var(--rmu-accent)");
    expect(button.className).toContain("small");
  });

  it("colours the label of a destructive glass button red", () => {
    render(<Button text="delete" destructive />);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.className).toContain("rmu-button--glass");
    expect(button.className).toContain("rmu-button--colored");
    expect(button.className).not.toContain("rmu-tinted");
    expect(button.style.getPropertyValue("--rmu-label")).toBe("var(--rmu-red)");
  });

  it("tints a prominent button with a custom colour, destructive wins", () => {
    const { rerender } = render(<Button text="go" variant="prominent" tint="rgb(1 2 3)" />);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.style.getPropertyValue("--rmu-tint")).toBe("rgb(1 2 3)");
    rerender(<Button text="go" variant="prominent" tint="rgb(1 2 3)" destructive />);
    expect(button.style.getPropertyValue("--rmu-tint")).toBe("var(--rmu-red)");
  });

  it("calls onClick handler when enabled", () => {
    const handleClick = vi.fn();
    render(<Button text="click" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button text="disabled" disabled onClick={handleClick} />);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
