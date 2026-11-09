import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GlassText from "../GlassText";

describe("GlassText", () => {
  it("keeps the text as real, readable text", () => {
    render(<GlassText as="h1">9:41</GlassText>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("9:41");
    // the SVG copies are hidden from assistive tech
    heading.querySelectorAll("svg, .rmu-glass-text__glass").forEach((el) =>
      expect(el.getAttribute("aria-hidden")).toBe("true"),
    );
  });

  it("clips the glass layer to an SVG copy of the text once measured", () => {
    const { container } = render(<GlassText>Hello</GlassText>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute("data-ready")).toBe(true);
    const glass = root.querySelector(".rmu-glass-text__glass") as HTMLElement;
    const id = glass.style.clipPath.match(/url\(["']?#([^"')]+)/)?.[1];
    expect(id).toBeTruthy();
    expect(root.querySelector(`clipPath[id="${id}"] text`)?.textContent).toBe("Hello");
  });

  it("passes tone, tint and ref through", () => {
    const ref = React.createRef<HTMLElement>();
    render(<GlassText ref={ref} tone="light" tint="red">12</GlassText>);
    expect(ref.current?.getAttribute("data-glass-tone")).toBe("light");
    expect(ref.current?.className).toContain("rmu-glass-text--tinted");
    expect(ref.current?.style.getPropertyValue("--rmu-gt-tint")).toBe("red");
  });
});
