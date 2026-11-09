import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../../func";
import Glass, { GlassStyleProps } from "../glass/Glass";

import { scoped } from "../../core/classes";
import "./tabs.css";

const styles = scoped("rmu-tabs");

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
  /** Ink colour for the whole tab group (sets `data-glass-tone`). */
  tone?: GlassStyleProps["tone"];
};

const TabsBase = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      activationMode = "auto",
      orientation = "horizontal",
      tone,
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
        <div
          ref={ref}
          data-glass-tone={tone && tone !== "auto" ? tone : undefined}
          className={cn(
            styles.tabs,
            orientation === "vertical" ? styles.tabsVertical : "",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

TabsBase.displayName = "Tabs";

export type TabsListProps = ComponentPropsWithoutRef<"div"> &
  Pick<GlassStyleProps, "tone" | "lens" | "layer"> & {
    children: ReactNode;
  };

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...rest }, ref) => {
    const { orientation, value } = useTabsContext("Tabs.List");
    const listRef = useRef<HTMLDivElement | null>(null);
    const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

    // the selection pill slides (with a spring) to the selected trigger
    useLayoutEffect(() => {
      const list = listRef.current;
      if (!list) return;
      const measure = () => {
        const sel = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
        if (!sel) return setPill(null);
        setPill({ x: sel.offsetLeft, y: sel.offsetTop, w: sel.offsetWidth, h: sel.offsetHeight });
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(list);
      return () => ro.disconnect();
    }, [value]);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    return (
      <Glass
        ref={setRefs as React.Ref<Element>}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          styles.tabsList,
          orientation === "vertical" ? styles.tabsListVertical : styles.tabsListHorizontal,
          className,
        )}
        {...rest}
      >
        {pill && (
          <span
            className={styles.indicator}
            aria-hidden="true"
            style={{ width: pill.w, height: pill.h, transform: `translate(${pill.x}px, ${pill.y}px)` }}
          />
        )}
        {children}
      </Glass>
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
      orientation,
      isControlled,
      registerTrigger,
      unregisterTrigger,
      updateTriggerDisabled,
      getTriggerId,
      getContentId,
      getEnabledTriggerValues,
      focusValue,
    } = useTabsContext("Tabs.Trigger");

    const triggerId = getTriggerId(value);
    const contentId = getContentId(value);
    const isSelected = selectedValue === value;

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      setValue(value);
      onClick?.(event);
    }, [disabled, onClick, setValue, value]);

    const handleFocus = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
      // Focus the trigger when tabbing in from outside the tab list
      if (event.target === event.currentTarget) {
        const enabledValues = getEnabledTriggerValues();
        const currentIndex = enabledValues.indexOf(value);
        if (currentIndex === -1) return;
        
        const triggerElement = document.getElementById(triggerId);
        if (triggerElement) {
          triggerElement.focus();
        }
      }
      onFocus?.(event);
    }, [getEnabledTriggerValues, onFocus, triggerId, value]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      
      if (event.defaultPrevented) return;
      
      const enabledValues = getEnabledTriggerValues();
      if (enabledValues.length === 0) return;
      
      const currentIndex = enabledValues.indexOf(value);
      if (currentIndex === -1) return;
      
      const moveFocus = (direction: 1 | -1) => {
        let nextIndex = currentIndex + direction;
        
        // Wrap around if needed
        if (nextIndex < 0) {
          nextIndex = enabledValues.length - 1;
        } else if (nextIndex >= enabledValues.length) {
          nextIndex = 0;
        }
        
        focusValue(enabledValues[nextIndex]);
      };
      
      switch (event.key) {
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            event.preventDefault();
            moveFocus(-1);
          }
          break;
          
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            event.preventDefault();
            moveFocus(1);
          }
          break;
          
        case 'ArrowUp':
          if (orientation === 'vertical') {
            event.preventDefault();
            moveFocus(-1);
          }
          break;
          
        case 'ArrowDown':
          if (orientation === 'vertical') {
            event.preventDefault();
            moveFocus(1);
          }
          break;
          
        case 'Home':
          event.preventDefault();
          focusValue(enabledValues[0]);
          break;
          
        case 'End':
          event.preventDefault();
          focusValue(enabledValues[enabledValues.length - 1]);
          break;
      }
    }, [focusValue, getEnabledTriggerValues, onKeyDown, orientation, value]);

    // handleFocus is already defined above with useCallback

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
      <button
        ref={composedRef}
        type="button"
        role="tab"
        id={triggerId}
        className={cn(
          styles.tabsTrigger,
          isSelected ? styles.triggerSelected : "",
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
      </button>
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
          styles.tabsContent,
          !isActive ? styles.contentHidden : "",
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


