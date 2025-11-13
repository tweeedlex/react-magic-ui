import React, {
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../func.ts";
import Glass from "../glass/Glass.tsx";

type ToastVariant = "default" | "success" | "error" | "info";

type ToastAnimation =
  | "slide-from-right"
  | "slide-from-left"
  | "slide-from-bottom"
  | "scale";

type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type ToastDefinition = {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  animation?: ToastAnimation;
  position?: ToastPosition;
  onClose?: () => void;
};

type ToastRecord = ToastDefinition & {
  id: string;
  createdAt: number;
  dismissed: boolean;
  duration: number;
  animation: ToastAnimation;
  position: ToastPosition;
  variant: ToastVariant;
};

export type ToastProviderProps = PropsWithChildren<{
  duration?: number;
  animation?: ToastAnimation;
  position?: ToastPosition;
  portalContainer?: HTMLElement | null;
}>;

type ToastContextValue = {
  showToast: (toast: ToastDefinition) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  defaults: {
    duration: number;
    animation: ToastAnimation;
    position: ToastPosition;
  };
};

const defaultVariantClasses: Record<ToastVariant, string> = {
  default:
    "bg-white/10 border-white/25 text-white shadow-[0_18px_40px_rgba(15,23,42,0.32)]",
  success:
    "bg-emerald-500/15 border-emerald-400/40 text-emerald-50 shadow-[0_18px_40px_rgba(16,185,129,0.28)]",
  error:
    "bg-rose-500/15 border-rose-400/40 text-rose-50 shadow-[0_18px_40px_rgba(244,63,94,0.3)]",
  info: "bg-sky-500/15 border-sky-400/40 text-sky-50 shadow-[0_18px_40px_rgba(56,189,248,0.28)]",
};

// const accentClasses: Record<ToastVariant, string> = {
//   default: "bg-white/50",
//   success: "bg-emerald-300",
//   error: "bg-rose-300",
//   info: "bg-sky-300",
// };

const animationStyles: Record<
  ToastAnimation,
  { initial: string; enter: string; exit: string; duration: number }
> = {
  "slide-from-right": {
    initial: "translate-x-6 opacity-0",
    enter: "translate-x-0 opacity-100",
    exit: "translate-x-6 opacity-0",
    duration: 220,
  },
  "slide-from-left": {
    initial: "-translate-x-6 opacity-0",
    enter: "translate-x-0 opacity-100",
    exit: "-translate-x-6 opacity-0",
    duration: 220,
  },
  "slide-from-bottom": {
    initial: "translate-y-6 opacity-0",
    enter: "translate-y-0 opacity-100",
    exit: "translate-y-6 opacity-0",
    duration: 240,
  },
  scale: {
    initial: "scale-95 opacity-0",
    enter: "scale-100 opacity-100",
    exit: "scale-90 opacity-0",
    duration: 200,
  },
};

const positionStyles: Record<
  ToastPosition,
  { container: string; sort: "asc" | "desc" }
> = {
  "top-right": {
    container:
      "pointer-events-none fixed top-6 right-6 z-[1100] flex max-w-xs flex-col items-end gap-3 sm:max-w-sm md:max-w-md",
    sort: "desc",
  },
  "top-left": {
    container:
      "pointer-events-none fixed top-6 left-6 z-[1100] flex max-w-xs flex-col items-start gap-3 sm:max-w-sm md:max-w-md",
    sort: "desc",
  },
  "top-center": {
    container:
      "pointer-events-none fixed top-6 left-1/2 z-[1100] flex max-w-xs -translate-x-1/2 flex-col items-center gap-3 sm:max-w-sm md:max-w-md",
    sort: "desc",
  },
  "bottom-right": {
    container:
      "pointer-events-none fixed bottom-6 right-6 z-[1100] flex max-w-xs flex-col items-end gap-3 sm:max-w-sm md:max-w-md",
    sort: "asc",
  },
  "bottom-left": {
    container:
      "pointer-events-none fixed bottom-6 left-6 z-[1100] flex max-w-xs flex-col items-start gap-3 sm:max-w-sm md:max-w-md",
    sort: "asc",
  },
  "bottom-center": {
    container:
      "pointer-events-none fixed bottom-6 left-1/2 z-[1100] flex max-w-xs -translate-x-1/2 flex-col items-center gap-3 sm:max-w-sm md:max-w-md",
    sort: "asc",
  },
};

const ToastContext = createContext<ToastContextValue | null>(null);

const generateToastId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

const ToastCard: React.FC<{
  toast: ToastRecord;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const [phase, setPhase] = useState<"initial" | "enter" | "exit">("initial");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closed = useRef(false);

  const animation = animationStyles[toast.animation];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPhase("enter");
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (toast.duration === Infinity) {
      return;
    }

    closeTimer.current = setTimeout(() => {
      setPhase("exit");
    }, toast.duration);

    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, [toast.duration]);

  useEffect(() => {
    if (!toast.dismissed) {
      return;
    }

    setPhase("exit");
  }, [toast.dismissed]);

  useEffect(() => {
    if (phase !== "exit") {
      return;
    }

    if (!closed.current) {
      closed.current = true;
      toast.onClose?.();
    }

    removeTimer.current = setTimeout(() => {
      onRemove(toast.id);
    }, animation.duration);

    return () => {
      if (removeTimer.current) {
        clearTimeout(removeTimer.current);
      }
    };
  }, [animation.duration, onRemove, phase, toast]);

  const animationClass =
    phase === "initial"
      ? animation.initial
      : phase === "enter"
      ? animation.enter
      : animation.exit;

  return (
    <Glass
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto w-full rounded-3xl border transition-all duration-200 ease-out",
        defaultVariantClasses[toast.variant],
        animationClass,
      )}
    >
      <div className="relative px-6 py-4">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            {toast.title && (
              <p className="text-base font-semibold leading-tight">
                {toast.title}
              </p>
            )}
            {toast.description && (
              <p className="text-sm leading-snug text-white/80">
                {toast.description}
              </p>
            )}
          </div>

          <button
            type="button"
            aria-label="close toast"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-sm font-medium text-white transition duration-150 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            onClick={() => setPhase("exit")}
          >
            ×
          </button>
        </div>
      </div>
    </Glass>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  duration = 4000,
  animation = "slide-from-right",
  position = "top-right",
  portalContainer,
}) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (portalContainer) {
      setPortalNode(portalContainer);
      return;
    }

    if (typeof document !== "undefined") {
      setPortalNode(document.body);
    }
  }, [portalContainer]);

  const showToast = useCallback(
    (toast: ToastDefinition) => {
      const id = toast.id ?? generateToastId();
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: toast.title,
          description: toast.description,
          variant: toast.variant ?? "default",
          duration: toast.duration ?? duration,
          animation: toast.animation ?? animation,
          position: toast.position ?? position,
          onClose: toast.onClose,
          createdAt: Date.now(),
          dismissed: false,
        },
      ]);

      return id;
    },
    [animation, duration, position],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              dismissed: true,
            }
          : toast,
      ),
    );
  }, []);

  const clearToasts = useCallback(() => {
    setToasts((prev) =>
      prev.map((toast) => ({
        ...toast,
        dismissed: true,
      })),
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      showToast,
      dismissToast,
      clearToasts,
      defaults: {
        duration,
        animation,
        position,
      },
    }),
    [animation, clearToasts, dismissToast, duration, position, showToast],
  );

  const toastsByPosition = useMemo(() => {
    return toasts.reduce<Record<ToastPosition, ToastRecord[]>>(
      (acc, toast) => {
        if (!acc[toast.position]) {
          acc[toast.position] = [];
        }
        acc[toast.position].push(toast);
        return acc;
      },
      {
        "top-left": [],
        "top-right": [],
        "top-center": [],
        "bottom-left": [],
        "bottom-right": [],
        "bottom-center": [],
      },
    );
  }, [toasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portalNode &&
        createPortal(
          <>
            {(
              Object.entries(toastsByPosition) as [
                ToastPosition,
                ToastRecord[],
              ][]
            ).map(([toastPosition, items]) => {
              if (!items.length) {
                return null;
              }

              const config =
                positionStyles[toastPosition] ?? positionStyles[position];

              const ordered =
                config.sort === "desc"
                  ? [...items].sort((a, b) => b.createdAt - a.createdAt)
                  : [...items].sort((a, b) => a.createdAt - b.createdAt);

              return (
                <div key={toastPosition} className={config.container}>
                  {ordered.map((toast) => (
                    <ToastCard
                      key={toast.id}
                      toast={toast}
                      onRemove={removeToast}
                    />
                  ))}
                </div>
              );
            })}
          </>,
          portalNode,
        )}
    </ToastContext.Provider>
  );
};


