import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../func.ts";
import { Glass } from "../glass";

type ModalSize = "sm" | "md" | "lg";

export type ModalProps = ComponentPropsWithoutRef<"div"> & {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  lockScroll?: boolean;
  size?: ModalSize;
  portalContainer?: HTMLElement | null;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

const containerClasses =
  "modal-container fixed inset-0 z-[1000] flex items-center justify-center px-4 py-10 sm:py-16";

const overlayClasses =
  "modal-overlay absolute inset-0 bg-slate-950/30 backdrop-blur-[10px] transition-opacity duration-200";

const baseContentClasses =
  "modal-content relative text-white w-full shadow-[0_28px_60px_rgba(15,23,42,0.45)] rounded-3xl outline-none flex flex-col overflow-hidden p-8";

const headerClasses = "modal-header flex items-start justify-between gap-6";
const headingClasses = "modal-heading flex flex-col gap-2";
const titleClasses =
  "modal-title text-2xl font-semibold leading-tight tracking-tight";
const descriptionClasses =
  "modal-description text-base text-white/70 leading-snug";

const closeButtonClasses =
  "modal-close inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition duration-150 hover:border-white/40 hover:bg-white/20 active:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40";

const bodyClasses =
  "modal-body mt-6 text-base text-white/90 leading-relaxed overflow-y-auto max-h-[calc(90vh-220px)] pr-1";

const footerClasses =
  "modal-footer mt-8 flex flex-wrap items-center justify-end gap-3";

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  onOpenChange,
  title,
  description,
  footer,
  children,
  closeOnOverlay = true,
  closeOnEsc = true,
  lockScroll = true,
  size = "md",
  className,
  portalContainer,
  onClick,
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (portalContainer) {
      setContainer(portalContainer);
      return;
    }

    if (typeof document !== "undefined") {
      setContainer(document.body);
    }
  }, [mounted, portalContainer]);

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
    onClose?.();
  }, [onClose, onOpenChange]);

  useEffect(() => {
    if (!open || !lockScroll || typeof document === "undefined") {
      return;
    }

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    return () => {
      style.overflow = previousOverflow;
    };
  }, [lockScroll, open]);

  useEffect(() => {
    if (!open || !closeOnEsc) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEsc, handleClose, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const element = contentRef.current;
    if (element) {
      element.focus({ preventScroll: true });
    }
  }, [open]);

  if (!open || !mounted || !container) {
    return null;
  }

  const labelledBy = title ? titleId : undefined;
  const describedBy = description ? descriptionId : undefined;
  const showHeader = Boolean(title || description || onClose || onOpenChange);

  return createPortal(
    <div className={containerClasses}>
      <div
        aria-hidden="true"
        className={overlayClasses}
        onClick={
          closeOnOverlay
            ? () => {
                handleClose();
              }
            : undefined
        }
      />

      <Glass
        ref={contentRef}
        className={cn(baseContentClasses, sizeClasses[size], className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        {...rest}
      >
        {showHeader && (
          <div className={headerClasses}>
            <div className={headingClasses}>
              {title && (
                <h2 id={titleId} className={titleClasses}>
                  {title}
                </h2>
              )}

              {description && (
                <p id={descriptionId} className={descriptionClasses}>
                  {description}
                </p>
              )}
            </div>

            {(onClose || onOpenChange) && (
              <button
                type="button"
                className={closeButtonClasses}
                aria-label="close modal"
                onClick={handleClose}
              >
                <span aria-hidden="true">x</span>
              </button>
            )}
          </div>
        )}

        {children && <div className={bodyClasses}>{children}</div>}

        {footer && <div className={footerClasses}>{footer}</div>}
      </Glass>
    </div>,
    container,
  );
};

export default Modal;


