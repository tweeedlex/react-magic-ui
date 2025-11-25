import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Glass from "../glass/Glass.tsx";
import clsx from "clsx";
import styles from "./style/Sidebar.module.scss";

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



export type SidebarProps = ComponentPropsWithoutRef<"aside"> & {
  size?: SidebarSize;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  enableLiquidAnimation?: boolean;
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
      enableLiquidAnimation = true,
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
    const [shouldAnimate, setShouldAnimate] = useState(false);

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

    // Trigger liquid animation on collapse/expand
    useEffect(() => {
      if (enableLiquidAnimation && collapsible) {
        // Reset animation state
        setShouldAnimate(false);

        // Trigger animation after a short delay
        const timer = setTimeout(() => {
          setShouldAnimate(true);
        }, 50);

        return () => clearTimeout(timer);
      }
    }, [collapsed, enableLiquidAnimation, collapsible]);

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

    const widthClass = collapsed ? styles.collapsed : styles[size];
    const paddingXClass = collapsed ? styles.paddingCollapsed : styles.paddingExpanded;

    return (
      <SidebarContext.Provider value={contextValue}>
        <Glass
          as="aside"
          ref={ref}
          enableLiquidAnimation={false}
          triggerAnimation={enableLiquidAnimation && shouldAnimate}
          className={clsx(
            styles.sidebar,
            paddingXClass,
            className,
          )}
          rootClassName={clsx(widthClass, styles.sidebarRoot)}
          {...rest}
        >
          {children}
        </Glass>
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
        className={clsx(
          styles.sidebarHeader,
          collapsed && styles.headerCollapsed,
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
        className={clsx(styles.sidebarFooter, className)}
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
        className={clsx(styles.sidebarItems, className)}
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
        className={clsx(
          styles.sidebarItem,
          collapsed && styles.itemCollapsed,
          isActive && styles.itemActive,
          className,
        )}
        onClick={handleClick}
        disabled={disabled}
        aria-label={ariaLabel}
        {...restProps}
      >
        {icon && (
          <span
            className={styles.itemIcon}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {!collapsed && (
          <span className={styles.itemContent}>
            <span className={styles.itemText}>{children}</span>
            {badge && (
              <span className={styles.itemBadge}>
                {badge}
              </span>
            )}
          </span>
        )}

        {collapsed && !icon && (
          <span
            className={styles.itemFallback}
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
        className={clsx(
          styles.sidebarToggle,
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

