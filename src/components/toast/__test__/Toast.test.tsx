import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ToastProvider, useToast, ToastDefinition } from "../ToastProvider";

const Trigger = ({ toast }: { toast: ToastDefinition }) => {
  const { showToast, clearToasts } = useToast();
  return (
    <>
      <button onClick={() => showToast(toast)}>show</button>
      <button onClick={clearToasts}>clear</button>
    </>
  );
};

const flushFrame = () => act(() => { vi.advanceTimersByTime(20); });

describe("ToastProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
  });
  afterEach(() => vi.useRealTimers());

  it("plays the exit animation when cleared, then removes the toast", () => {
    const onClose = vi.fn();
    render(<ToastProvider><Trigger toast={{ title: "Saved", onClose }} /></ToastProvider>);
    fireEvent.click(screen.getByText("show"));
    flushFrame();
    const card = screen.getByRole("status");
    expect(card.className).toContain("rmu-toast-animEnter");

    fireEvent.click(screen.getByText("clear"));
    expect(card.className).toContain("rmu-toast-animExit");
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("removes at once without animation when enableLiquidAnimation is false", () => {
    render(<ToastProvider enableLiquidAnimation={false}><Trigger toast={{ title: "Saved" }} /></ToastProvider>);
    fireEvent.click(screen.getByText("show"));
    flushFrame();
    expect(screen.getByRole("status").className).toContain("rmu-toast-static");

    fireEvent.click(screen.getByText("clear"));
    act(() => { vi.advanceTimersByTime(0); });
    expect(screen.queryByRole("status")).toBeNull();
  });
});
