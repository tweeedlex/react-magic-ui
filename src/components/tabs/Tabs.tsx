import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../../func.ts";
import Glass from "../glass/Glass.tsx";

type TabsOrientation = "horizontal" | "vertical";
type TabsActivationMode = "auto" | "manual";

type TriggerEntry = {
  ref: HTMLButtonElement | null;
  disabled: boolean;
};

export type TabsContextValue = {
  value?: string;
  setValue: (next: string) => void;
  deactivate: (next: string) => void;
  activationMode: TabsActivationMode;
  orientation: TabsOrientation;
  isControlled: boolean;
  registerTrigger: (value: string, node: HTMLButtonElement | null, disabled: boolean) => void;
  unregisterTrigger: (value: string) => void;
  updateTriggerDisabled: (value: string, disabled: boolean) => void;
  focusValue: (value: string) => void;
  getEnabledTriggerValues: () => string[];
  getTriggerId: (value: string) => string;
  getContentId: (value: string) => string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = (component: string) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error(`${component} must be used within Tabs`);
  }

  return context;
};

const sanitizeIdPart = (part: string) => part.replace(/[^a-zA-Z0-9_-]/g, "-");

export type TabsProps = ComponentPropsWithoutRef<"div"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  activationMode?: TabsActivationMode;
  orientation?: TabsOrientation;
};

const TabsBase = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      activationMode = "auto",
      orientation = "horizontal",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [valueState, setValueState] = useState(defaultValue);

    const value = isControlled ? valueProp : valueState;

    const setValue = useCallback(
      (next: string) => {
        if (!isControlled) {
          setValueState(next);
        }

        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const triggerEntries = useRef<Map<string, TriggerEntry>>(new Map());
    const triggerOrder = useRef<string[]>([]);

    const registerTrigger = useCallback(
      (triggerValue: string, node: HTMLButtonElement | null, disabled: boolean) => {
        const sanitizedValue = triggerValue;

        if (node) {
          triggerEntries.current.set(sanitizedValue, { ref: node, disabled });
          if (!triggerOrder.current.includes(sanitizedValue)) {
            triggerOrder.current.push(sanitizedValue);
          }
        } else {
          triggerEntries.current.delete(sanitizedValue);
          triggerOrder.current = triggerOrder.current.filter((item) => item !== sanitizedValue);
        }
      },
      [],
    );

    const unregisterTrigger = useCallback((triggerValue: string) => {
      triggerEntries.current.delete(triggerValue);
      triggerOrder.current = triggerOrder.current.filter((item) => item !== triggerValue);
    }, []);

    const updateTriggerDisabled = useCallback((triggerValue: string, disabled: boolean) => {
      const entry = triggerEntries.current.get(triggerValue);

      if (entry) {
        entry.disabled = disabled;
      }
    }, []);

    const focusValue = useCallback((nextValue: string) => {
      const entry = triggerEntries.current.get(nextValue);
      entry?.ref?.focus();
    }, []);

    const getEnabledTriggerValues = useCallback(() => {
      return triggerOrder.current.filter((item) => {
        const entry = triggerEntries.current.get(item);
        return Boolean(entry) && !entry?.disabled;
      });
    }, []);

    const baseId = useId();

    const getTriggerId = useCallback(
      (triggerValue: string) =>
        `${baseId}-trigger-${sanitizeIdPart(triggerValue)}`,
      [baseId],
    );

    const getContentId = useCallback(
      (triggerValue: string) =>
        `${baseId}-content-${sanitizeIdPart(triggerValue)}`,
      [baseId],
    );

    const deactivate = useCallback(
      (next: string) => {
        if (activationMode === "auto") {
          setValue(next);
        }
      },
      [activationMode, setValue],
    );

    const contextValue = useMemo<TabsContextValue>(
      () => ({
        value,
        setValue,
        deactivate,
        activationMode,
        orientation,
        isControlled,
        registerTrigger,
        unregisterTrigger,
        updateTriggerDisabled,
        focusValue,
        getEnabledTriggerValues,
        getTriggerId,
        getContentId,
      }),
      [value, setValue, deactivate, activationMode, orientation, isControlled, registerTrigger, unregisterTrigger, updateTriggerDisabled, focusValue, getEnabledTriggerValues, getTriggerId, getContentId],
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <Glass
          ref={ref}
          className={cn(
            "bg-default text-white flex flex-col gap-4 p-4",
            orientation === "vertical" ? "max-w-[320px]" : "",
            className,
          )}
          {...rest}
        >
          {children}
        </Glass>
      </TabsContext.Provider>
    );
  },
);

TabsBase.displayName = "Tabs";

export type TabsListProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...rest }, ref) => {
    const { orientation } = useTabsContext("Tabs.List");

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-col" : "flex-row",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabsList.displayName = "Tabs.List";

export type TabsTriggerProps = ComponentPropsWithoutRef<"button"> & {
  value: string;
};

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, disabled, className, onClick, onFocus, onKeyDown, children, ...rest }, ref) => {
    const {
      value: selectedValue,
      setValue,
      deactivate,
      activationMode,
      orientation,
      registerTrigger,
      unregisterTrigger,
      updateTriggerDisabled,
      focusValue,
      getEnabledTriggerValues,
      getTriggerId,
      getContentId,
      isControlled,
    } = useTabsContext("Tabs.Trigger");

    const isSelected = selectedValue === value;
    const triggerId = getTriggerId(value);
    const contentId = getContentId(value);

    const handleSelect = useCallback(() => {
      if (disabled) {
        return;
      }

      setValue(value);
    }, [disabled, setValue, value]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      handleSelect();
    };

    const moveFocus = useCallback(
      (direction: 1 | -1) => {
        const enabledValues = getEnabledTriggerValues();
        if (enabledValues.length === 0) {
          return;
        }

        const currentIndex = enabledValues.indexOf(value);
        const fallbackIndex = Math.max(0, Math.min(enabledValues.length - 1, currentIndex));
        const startIndex = currentIndex === -1 ? fallbackIndex : currentIndex;

        let nextIndex = startIndex + direction;

        if (nextIndex < 0) {
          nextIndex = enabledValues.length - 1;
        }

        if (nextIndex >= enabledValues.length) {
          nextIndex = 0;
        }

        const nextValue = enabledValues[nextIndex];

        if (nextValue) {
          focusValue(nextValue);
          deactivate(nextValue);
        }
      },
      [deactivate, focusValue, getEnabledTriggerValues, value],
    );

    const moveToEdge = useCallback(
      (edge: "start" | "end") => {
        const enabledValues = getEnabledTriggerValues();
        if (enabledValues.length === 0) {
          return;
        }

        const edgeValue = edge === "start" ? enabledValues[0] : enabledValues[enabledValues.length - 1];

        if (edgeValue) {
          focusValue(edgeValue);
          deactivate(edgeValue);
        }
      },
      [deactivate, focusValue, getEnabledTriggerValues],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      const isHorizontal = orientation === "horizontal";

      switch (event.key) {
        case "ArrowRight":
          if (isHorizontal) {
            event.preventDefault();
            moveFocus(1);
          }
          break;
        case "ArrowLeft":
          if (isHorizontal) {
            event.preventDefault();
            moveFocus(-1);
          }
          break;
        case "ArrowDown":
          if (!isHorizontal) {
            event.preventDefault();
            moveFocus(1);
          }
          break;
        case "ArrowUp":
          if (!isHorizontal) {
            event.preventDefault();
            moveFocus(-1);
          }
          break;
        case "Home":
          event.preventDefault();
          moveToEdge("start");
          break;
        case "End":
          event.preventDefault();
          moveToEdge("end");
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          handleSelect();
          break;
        default:
          break;
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
      onFocus?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (activationMode === "auto" && selectedValue !== value && !disabled) {
        setValue(value);
      }
    };

    const composedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        registerTrigger(value, node, Boolean(disabled));

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }

        if (!node) {
          unregisterTrigger(value);
        }
      },
      [disabled, ref, registerTrigger, unregisterTrigger, value],
    );

    useEffect(() => {
      updateTriggerDisabled(value, Boolean(disabled));
    }, [disabled, updateTriggerDisabled, value]);

    useEffect(() => {
      if (!isControlled && selectedValue === undefined && !disabled) {
        setValue(value);
      }
    }, [disabled, isControlled, selectedValue, setValue, value]);

    return (
      <Glass
        as="button"
        ref={composedRef}
        type="button"
        role="tab"
        id={triggerId}
        className={cn(
          "bg-white/10 hover:bg-white/20 active:bg-white/25 transition-colors px-4 py-2 rounded-lg text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed",
          isSelected ? "bg-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" : "",
          className,
        )}
        aria-selected={isSelected}
        aria-controls={contentId}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </Glass>
    );
  },
);

TabsTrigger.displayName = "Tabs.Trigger";

export type TabsContentProps = ComponentPropsWithoutRef<"div"> & {
  value: string;
  lazyMount?: boolean;
};

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, lazyMount, className, children, ...rest }, ref) => {
    const { value: selectedValue, getTriggerId, getContentId } = useTabsContext("Tabs.Content");

    const isActive = selectedValue === value;

    if (lazyMount && !isActive) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={getContentId(value)}
        aria-labelledby={getTriggerId(value)}
        hidden={!isActive}
        className={cn(
          "rounded-xl bg-white/10 p-4 text-sm leading-relaxed shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
          !isActive ? "opacity-0 pointer-events-none absolute h-0 w-0 overflow-hidden" : "",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabsContent.displayName = "Tabs.Content";

type TabsCompoundComponent = React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>> & {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
  useTabs: () => TabsContextValue;
};

const Tabs = TabsBase as TabsCompoundComponent;

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
Tabs.useTabs = () => useTabsContext("Tabs.useTabs");

export default Tabs;


