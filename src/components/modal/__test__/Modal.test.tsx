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

  describe("focus", () => {
    const Harness = ({ open }: { open: boolean }) => (
      <>
        <div data-testid="app">
          <button type="button">Opener</button>
        </div>
        <Modal open={open} onOpenChange={() => {}} title="Focus" footer={<button type="button">Last</button>}>
          <button type="button">First</button>
        </Modal>
      </>
    );

    it("makes the page behind inert while open and restores it on close", () => {
      const { rerender } = render(<Harness open={false} />);
      const app = screen.getByTestId("app");
      expect(app.closest("[inert]")).toBeNull();

      rerender(<Harness open />);
      expect(app.closest("[inert]")).not.toBeNull();
      expect(screen.getByTestId("modal-container").closest("[inert]")).toBeNull();

      rerender(<Harness open={false} />);
      expect(app.closest("[inert]")).toBeNull();
    });

    it("cycles Tab inside the dialog", () => {
      render(<Harness open />);
      const dialog = screen.getByRole("dialog");
      const close = screen.getByRole("button", { name: "close modal" });
      const last = screen.getByRole("button", { name: "Last" });

      last.focus();
      fireEvent.keyDown(last, { key: "Tab" });
      expect(document.activeElement).toBe(close);

      close.focus();
      fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(last);

      dialog.focus();
      fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(last);
    });

    it("returns focus to the opener on close", () => {
      const { rerender } = render(<Harness open={false} />);
      const opener = screen.getByRole("button", { name: "Opener" });
      opener.focus();

      rerender(<Harness open />);
      expect(document.activeElement).toBe(screen.getByRole("dialog"));

      rerender(<Harness open={false} />);
      expect(document.activeElement).toBe(opener);
    });

    it("keeps the toast layer usable", () => {
      const toastLayer = document.createElement("div");
      toastLayer.setAttribute("data-rmu-keep-active", "");
      document.body.appendChild(toastLayer);
      render(<Harness open />);
      expect(toastLayer).not.toHaveAttribute("inert");
      toastLayer.remove();
    });
  });
});


