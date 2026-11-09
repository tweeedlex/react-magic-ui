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
import { cn } from "../../func";
import Glass, { GlassStyleProps } from "../glass/Glass";
import { scoped } from "../../core/classes";
import "./modal.css";
import { Xmark } from "../../core/icons";

const styles = scoped("rmu-modal");

type ModalSize = "sm" | "md" | "lg";

export type ModalProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  /** Whether the modal is shown. */
  open: boolean;
  /** Called when the user dismisses it (close button, overlay, Escape). */
  onClose?: () => void;
  /** Same as `onClose`, called with `false`. */
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Actions row at the bottom, e.g. Cancel / Confirm buttons. */
  footer?: ReactNode;
  /** Default `true`. */
  closeOnOverlay?: boolean;
  /** Default `true`. */
  closeOnEsc?: boolean;
  /** Stop the page scrolling while open. Default `true`. */
  lockScroll?: boolean;
  /** Max width: sm 400px, md 520px, lg 680px. Default `"md"`. */
  size?: ModalSize;
  /** Spring the panel in and out. Default `true`. */
  enableLiquidAnimation?: boolean;
  /** Where to portal. Default `document.body`. */
  portalContainer?: HTMLElement | null;
} & Pick<GlassStyleProps, "tone" | "lens">;

const EXIT_MS = 220;

/**
 * Glass dialog over a dimmed backdrop. Springs in, fades out.
 *
 * @example
 * <Modal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Delete photo?"
 *   description="This can't be undone."
 *   footer={<>
 *     <Button onClick={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="negative" onClick={remove}>Delete</Button>
 *   </>}
 * />
 */
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
  // stays rendered for the exit animation after `open` turns false
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);
  const shown = open || (present && enableLiquidAnimation);
  const closing = shown && !open;
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

  useEffect(() => {
    if (open || !present) return;
    const timer = setTimeout(() => setPresent(false), enableLiquidAnimation ? EXIT_MS : 0);
    return () => clearTimeout(timer);
  }, [open, present, enableLiquidAnimation]);

  if (!shown || !mounted || !container) {
    return null;
  }

  const labelledBy = title ? titleId : undefined;
  const describedBy = description ? descriptionId : undefined;
  const showHeader = Boolean(title || description || onClose || onOpenChange);

  return createPortal(
    <div
      className={cn(
        styles.modalContainer,
        enableLiquidAnimation && styles.animated,
        closing && styles.closing,
      )}
      data-testid="modal-container"
    >
      <div
        data-testid="modal-overlay"
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
        ref={contentRef as React.Ref<Element>}
        layer="surface"
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
                <Xmark className="rmu-icon" width={15} height={15} />
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


