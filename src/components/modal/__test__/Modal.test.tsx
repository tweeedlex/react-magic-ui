import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal, { ModalProps } from "../Modal";

const renderModal = (props?: Partial<ModalProps>) => {
  const onOpenChange = vi.fn();

  const result = render(
    <Modal
      open
      onOpenChange={onOpenChange}
      title="Glass modal"
      description="Keeps the focus on your content."
      footer={<span>Footer actions</span>}
      {...props}
    >
      <p>Modal body content</p>
    </Modal>,
  );

  return {
    ...result,
    onOpenChange,
  };
};

describe("Modal component", () => {
  it("renders dialog content when open", () => {
    renderModal();

    expect(
      screen.getByRole("dialog", { name: "Glass modal" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Modal body content")).toBeInTheDocument();
  });

  it("forwards the ref to the dialog", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Modal open title="Hi" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("dialog"));
  });

  it("calls onOpenChange when overlay clicked", () => {
    const { onOpenChange } = renderModal();

    const overlay = screen.getByTestId("modal-overlay");
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close when overlay click disabled", () => {
    const { onOpenChange } = renderModal({ closeOnOverlay: false });

    const overlay = screen.getByTestId("modal-overlay");
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("invokes onOpenChange when escape key pressed", () => {
    const { onOpenChange } = renderModal();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders in the body by default", () => {
    render(
      <Modal
        open
        onOpenChange={() => { }}
        title="Glass modal"
        description="Keeps the focus on your content."
      >
        <p>Modal body content</p>
      </Modal>,
    );

    const modalContainer = screen.getByTestId("modal-container");
    expect(modalContainer.parentElement!.tagName).toBe("BODY");
  });

  it("blocks page wheel scroll while open, keeps the scrollbar, unlocks on close", () => {
    const wheel = () => {
      const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: 100 });
      document.body.dispatchEvent(event);
      return event.defaultPrevented;
    };
    const { rerender } = render(
      <Modal
        open
        onOpenChange={() => { }}
        title="Glass modal"
        description="Keeps the focus on your content."
      >
        <p>Modal body content</p>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("");
    expect(wheel()).toBe(true);

    rerender(
      <Modal
        open={false}
        onOpenChange={() => { }}
        title="Glass modal"
        description="Keeps the focus on your content."
      >
        <p>Modal body content</p>
      </Modal>,
    );

    expect(wheel()).toBe(false);
  });
});


