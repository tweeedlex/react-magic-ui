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
    expect(section).toHaveClass("flex-1");
    expect(section).toHaveClass("justify-between");
  });

  it("matches divider height to the selected size", () => {
    render(
      <Topbar size="compact">
        <Topbar.Actions>
          <Topbar.Divider data-testid="divider" />
        </Topbar.Actions>
      </Topbar>,
    );

    expect(screen.getByTestId("divider")).toHaveClass("h-8");
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


