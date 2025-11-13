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
    expect(button.className).toContain("btn");
    expect(button.className).toContain("medium");
    expect(button.className).toContain("text-lg");
  });

  it("applies variant and size specific classes", () => {
    render(<Button text="danger" variant="danger" size="small" />);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.className).toContain("bg-danger");
    expect(button.className).toContain("small");
    expect(button.className).toContain("text-sm");
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
