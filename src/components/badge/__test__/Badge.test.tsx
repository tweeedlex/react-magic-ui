import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "../Badge";

describe("Badge component", () => {
  it("renders children text content", () => {
    render(<Badge>active</Badge>);
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Badge>default</Badge>);
    const badge = screen.getByText("default");
    expect(badge.className).toContain("badge");
  });

  it("tints a default badge", () => {
    render(<Badge tint="rgb(1 2 3)">new</Badge>);
    const badge = screen.getByText("new");
    expect(badge.className).toContain("rmu-tinted");
    expect(badge.style.getPropertyValue("--rmu-tint")).toBe("rgb(1 2 3)");
  });

  it("renders a notification badge as a solid oval, not glass", () => {
    render(<Badge variant="notification" tone="dark">3</Badge>);
    const badge = screen.getByText("3");
    expect(badge.className).toContain("rmu-badge--notification");
    expect(badge.className).not.toContain("rmu-glass");
    expect(badge.getAttribute("tone")).toBeNull();
  });

  it("renders leading and trailing icons", () => {
    render(
      <Badge
        leadingIcon={<span data-testid="leading">L</span>}
        trailingIcon={<span data-testid="trailing">R</span>}
      >
        icon badge
      </Badge>,
    );

    expect(screen.getByTestId("leading")).toBeInTheDocument();
    expect(screen.getByTestId("trailing")).toBeInTheDocument();
  });
});

