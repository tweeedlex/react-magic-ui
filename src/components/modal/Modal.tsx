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
import styles from "./style/Modal.module.scss";

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
  enableLiquidAnimation?: boolean;
  portalContainer?: HTMLElement | null;
};



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
  enableLiquidAnimation = true,
  className,
  portalContainer,
  onClick,
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
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

  // Trigger liquid animation when modal opens
  useEffect(() => {
    if (open && enableLiquidAnimation) {
      // Reset animation state first
      setShouldAnimate(false);

      // Trigger animation after a short delay to ensure modal is rendered
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [open, enableLiquidAnimation]);

  if (!open || !mounted || !container) {
    return null;
  }

  const labelledBy = title ? titleId : undefined;
  const describedBy = description ? descriptionId : undefined;
  const showHeader = Boolean(title || description || onClose || onOpenChange);

  return createPortal(
    <div className={styles.modalContainer}>
      <div
        aria-hidden="true"
        className={styles.modalOverlay}
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
        enableLiquidAnimation={false}
        triggerAnimation={enableLiquidAnimation && shouldAnimate}
        className={cn(styles.modalContent, styles[size], className)}
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
          <div className={styles.modalHeader}>
            <div className={styles.modalHeading}>
              {title && (
                <h2 id={titleId} className={styles.modalTitle}>
                  {title}
                </h2>
              )}

              {description && (
                <p id={descriptionId} className={styles.modalDescription}>
                  {description}
                </p>
              )}
            </div>

            {(onClose || onOpenChange) && (
              <button
                type="button"
                className={styles.modalClose}
                aria-label="close modal"
                onClick={handleClose}
              >
                <span aria-hidden="true">x</span>
              </button>
            )}
          </div>
        )}

        {children && <div className={styles.modalBody}>{children}</div>}

        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </Glass>
    </div>,
    container,
  );
};

export default Modal;


