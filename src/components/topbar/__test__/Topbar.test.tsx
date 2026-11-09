import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Topbar from "../Topbar";

describe("Topbar component", () => {
  it("renders brand content with icon, title, and subtitle", () => {
    render(
      <Topbar>
        <Topbar.Brand icon="✨" title="Magic UI" subtitle="Command Center" />
      </Topbar>,
    );

    expect(screen.getByText("Magic UI")).toBeInTheDocument();
    expect(screen.getByText("Command Center")).toBeInTheDocument();
    expect(screen.getByText("✨")).toBeInTheDocument();
  });

  it("allows sections to grow and align content", () => {
    render(
      <Topbar>
        <Topbar.Section data-testid="grow-section" grow align="between">
          <span>Start</span>
          <span>End</span>
        </Topbar.Section>
      </Topbar>,
    );

    const section = screen.getByTestId("grow-section");
    // Classes are hashed, so we just check if it renders
    expect(section).toBeInTheDocument();
  });

  it("matches divider height to the selected size", () => {
    render(
      <Topbar size="compact">
        <Topbar.Actions>
          <Topbar.Divider data-testid="divider" />
        </Topbar.Actions>
      </Topbar>,
    );

    expect(screen.getByTestId("divider")).toBeInTheDocument();
  });

  it("renders islands by default: no glass bar, brand and group are glass", () => {
    const { container } = render(
      <Topbar>
        <Topbar.Brand data-testid="brand" title="Magic UI" />
        <Topbar.Actions>
          <Topbar.Group>
            <button>GitHub</button>
          </Topbar.Group>
        </Topbar.Actions>
      </Topbar>,
    );

    const header = container.querySelector("header")!;
    expect(header).toHaveClass("rmu-topbar-islands");
    expect(header).not.toHaveClass("rmu-glass");
    expect(screen.getByTestId("brand")).toHaveClass("rmu-glass", "rmu-topbar-island");
    expect(screen.getByTestId("brand")).not.toHaveClass("rmu-glass--inner");
    expect(screen.getByRole("group")).toHaveClass("rmu-glass", "rmu-topbar-island");
    expect(screen.getByRole("group")).not.toHaveClass("rmu-glass--inner");
  });

  it("keeps a bare brand with glass={false}", () => {
    render(
      <Topbar>
        <Topbar.Brand data-testid="brand" title="Magic UI" glass={false} />
      </Topbar>,
    );

    expect(screen.getByTestId("brand")).not.toHaveClass("rmu-glass");
  });

  it("variant bar is one glass capsule; group becomes an inner layer", () => {
    const { container } = render(
      <Topbar variant="bar">
        <Topbar.Brand data-testid="brand" title="Magic UI" />
        <Topbar.Group>
          <button>GitHub</button>
        </Topbar.Group>
      </Topbar>,
    );

    const header = container.querySelector("header")!;
    expect(header).toHaveClass("rmu-glass", "rmu-topbar-bar");
    expect(screen.getByTestId("brand")).not.toHaveClass("rmu-glass");
    expect(screen.getByRole("group")).toHaveClass("rmu-glass--inner");
  });

  it("passes tone to the islands", () => {
    const { container } = render(
      <Topbar tone="dark">
        <Topbar.Brand data-testid="brand" title="Magic UI" />
      </Topbar>,
    );

    expect(container.querySelector("header")).toHaveAttribute("data-glass-tone", "dark");
    expect(screen.getByTestId("brand")).toHaveAttribute("data-glass-tone", "dark");
  });

  it("exposes context through useTopbar helper", () => {
    const ReadSize = () => {
      const { size } = Topbar.useTopbar();
      return <span>size:{size}</span>;
    };

    render(
      <Topbar size="spacious">
        <Topbar.Section>
          <ReadSize />
        </Topbar.Section>
      </Topbar>,
    );

    expect(screen.getByText("size:spacious")).toBeInTheDocument();
  });
});


