import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { cn } from "../../func.ts";

type SidebarSize = "small" | "medium" | "large";

export type SidebarContextValue = {
  size: SidebarSize;
  collapsed: boolean;
  collapsible: boolean;
  toggleCollapsed: () => void;
  handleItemSelect: (
    itemId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  activeItemId?: string;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

const useSidebarContext = (component: string) => {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error(`${component} must be used within Sidebar`);
  }

  return context;
};

const sizeStyles: Record<SidebarSize, string> = {
  small: "w-[200px]",
  medium: "w-[260px]",
  large: "w-[320px]",
};

export type SidebarProps = ComponentPropsWithoutRef<"aside"> & {
  size?: SidebarSize;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  onToggle?: (collapsed: boolean) => void;
  activeItemId?: string;
  defaultActiveItemId?: string;
  onSelectItem?: (
    itemId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
};

const SidebarBase = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      size = "medium",
      collapsed: collapsedProp,
      defaultCollapsed = false,
      collapsible = false,
      onToggle,
      activeItemId: activeItemIdProp,
      defaultActiveItemId,
      onSelectItem,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isCollapsedControlled = collapsedProp !== undefined;
    const [collapsedState, setCollapsedState] = useState(defaultCollapsed);

    const collapsed = isCollapsedControlled ? collapsedProp : collapsedState;

    const setCollapsed = useCallback(
      (next: boolean) => {
        if (!isCollapsedControlled) {
          setCollapsedState(next);
        }
        onToggle?.(next);
      },
      [isCollapsedControlled, onToggle],
    );

    const handleToggle = useCallback(() => {
      if (!collapsible) {
        return;
      }

      setCollapsed(!collapsed);
    }, [collapsible, collapsed, setCollapsed]);

    const isActiveControlled = activeItemIdProp !== undefined;
    const [activeItemIdState, setActiveItemIdState] = useState<
      string | undefined
    >(defaultActiveItemId);

    const activeItemId = isActiveControlled
      ? activeItemIdProp
      : activeItemIdState;

    const handleItemSelect = useCallback(
      (itemId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isActiveControlled) {
          setActiveItemIdState(itemId);
        }

        onSelectItem?.(itemId, event);
      },
      [isActiveControlled, onSelectItem],
    );

    const contextValue = useMemo<SidebarContextValue>(
      () => ({
        size,
        collapsed,
        collapsible,
        toggleCollapsed: handleToggle,
        handleItemSelect,
        activeItemId,
      }),
      [size, collapsed, collapsible, handleToggle, handleItemSelect, activeItemId],
    );

    const widthClass = collapsed ? "w-[88px]" : sizeStyles[size];
    const paddingXClass = collapsed ? "px-3" : "px-4";

    return (
      <SidebarContext.Provider value={contextValue}>
        <aside
          ref={ref}
          className={cn(
            "glass bg-default text-white flex flex-col gap-4 relative min-h-full py-6 transition-[width,padding] duration-200",
            widthClass,
            paddingXClass,
            className,
          )}
          {...rest}
        >
          {children}
        </aside>
      </SidebarContext.Provider>
    );
  },
);

SidebarBase.displayName = "Sidebar";

export type SidebarHeaderProps = ComponentPropsWithoutRef<"div">;

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...rest }, ref) => {
    const { collapsed } = useSidebarContext("Sidebar.Header");

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-2 pb-2 transition-all duration-200",
          collapsed ? "justify-center" : "",
          className,
        )}
        {...rest}
      />
    );
  },
);

SidebarHeader.displayName = "Sidebar.Header";

export type SidebarFooterProps = ComponentPropsWithoutRef<"div">;

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between pt-2", className)}
        {...rest}
      />
    );
  },
);

SidebarFooter.displayName = "Sidebar.Footer";

export type SidebarItemsProps = ComponentPropsWithoutRef<"nav">;

const SidebarItems = forwardRef<HTMLElement, SidebarItemsProps>(
  ({ className, ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("flex flex-col gap-2 flex-1", className)}
        {...rest}
      />
    );
  },
);

SidebarItems.displayName = "Sidebar.Items";

export type SidebarItemProps = ComponentPropsWithoutRef<"button"> & {
  itemId: string;
  icon?: ReactNode;
  badge?: ReactNode;
  collapsedFallback?: ReactNode;
};

const getCollapsedFallback = (
  collapsedFallback: ReactNode | undefined,
  children: ReactNode,
) => {
  if (collapsedFallback) {
    return collapsedFallback;
  }

  if (typeof children === "string" && children.trim().length > 0) {
    return children.trim().charAt(0).toUpperCase();
  }

  return "•";
};

const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      itemId,
      icon,
      badge,
      collapsedFallback,
      disabled,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const { collapsed, handleItemSelect, activeItemId } = useSidebarContext(
      "Sidebar.Item",
    );

    const { ["aria-label"]: ariaLabelProp, ...restProps } = rest;

    const isActive = activeItemId === itemId;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      handleItemSelect(itemId, event);
      onClick?.(event);
    };

    const ariaLabel =
      typeof children === "string" ? children : ariaLabelProp;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center gap-3 w-full rounded-xl text-left font-medium transition-all duration-200 border-none outline-none bg-transparent text-inherit py-3 px-[14px] hover:bg-white/20 active:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:bg-transparent",
          collapsed ? "justify-center py-2.5 px-2.5" : "",
          isActive
            ? "bg-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
            : "",
          className,
        )}
        onClick={handleClick}
        disabled={disabled}
        aria-label={ariaLabel}
        {...restProps}
      >
        {icon && (
          <span
            className="flex items-center justify-center rounded-lg w-9 h-9 bg-white/15 shadow-[0_10px_20px_rgba(15,23,42,0.25)]"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {!collapsed && (
          <span className="flex items-center gap-2 flex-1 overflow-hidden">
            <span className="truncate">{children}</span>
            {badge && (
              <span className="inline-flex items-center justify-center rounded-full text-xs font-semibold min-w-[24px] px-2 py-0.5 bg-white/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]">
                {badge}
              </span>
            )}
          </span>
        )}

        {collapsed && !icon && (
          <span
            className="flex items-center justify-center rounded-lg text-sm font-semibold w-8 h-8 bg-white/15 shadow-[0_10px_20px_rgba(15,23,42,0.25)]"
            aria-hidden="true"
          >
            {getCollapsedFallback(collapsedFallback, children)}
          </span>
        )}
      </button>
    );
  },
);

SidebarItem.displayName = "Sidebar.Item";

export type SidebarToggleProps = ComponentPropsWithoutRef<"button">;

const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, onClick, ...rest }, ref) => {
    const { collapsible, collapsed, toggleCollapsed } = useSidebarContext(
      "Sidebar.Toggle",
    );

    if (!collapsible) {
      return null;
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      toggleCollapsed();
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center justify-center rounded-full transition-colors w-9 h-9 border-none outline-none bg-white/15 text-inherit hover:bg-white/25 active:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          className,
        )}
        aria-label={collapsed ? "expand sidebar" : "collapse sidebar"}
        onClick={handleClick}
        {...rest}
      >
        <span aria-hidden="true">{collapsed ? "»" : "«"}</span>
      </button>
    );
  },
);

SidebarToggle.displayName = "Sidebar.Toggle";

type SidebarCompoundComponent = React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLElement>
> & {
  Header: typeof SidebarHeader;
  Footer: typeof SidebarFooter;
  Items: typeof SidebarItems;
  Item: typeof SidebarItem;
  Toggle: typeof SidebarToggle;
  useSidebar: () => SidebarContextValue;
};

const Sidebar = SidebarBase as SidebarCompoundComponent;

Sidebar.Header = SidebarHeader;
Sidebar.Footer = SidebarFooter;
Sidebar.Items = SidebarItems;
Sidebar.Item = SidebarItem;
Sidebar.Toggle = SidebarToggle;
Sidebar.useSidebar = () => useSidebarContext("Sidebar.useSidebar");

export default Sidebar;

