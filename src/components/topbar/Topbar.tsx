import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import { cn } from "../../func";
import Glass, { GlassStyleProps } from "../glass/Glass";
import { scoped } from "../../core/classes";
import "./topbar.css";

const styles = scoped("rmu-topbar");

/** Minimum bar height: compact 48px, comfortable 60px, spacious 72px. */
export type TopbarSize = "compact" | "comfortable" | "spacious";

export type TopbarContextValue = {
  size: TopbarSize;
};

const TopbarContext = React.createContext<TopbarContextValue | null>(null);

const useTopbarContext = (component: string) => {
  const context = useContext(TopbarContext);

  if (!context) {
    throw new Error(`${component} must be used within Topbar`);
  }

  return context;
};

/** Space between items in a section. */
export type TopbarGap = "tight" | "regular" | "relaxed";

export type TopbarProps = ComponentPropsWithoutRef<"header"> & {
  /** Default `"comfortable"`. */
  size?: TopbarSize;
  /** Soft drop shadow under the bar. Default `true`. */
  elevated?: boolean;
} & Omit<GlassStyleProps, "layer">;

/**
 * Floating glass bar for the top of a page.
 *
 * @example
 * <Topbar size="compact">
 *   <Topbar.Brand icon={<Logo />} title="My app" />
 *   <Topbar.Section grow><Input placeholder="Search" /></Topbar.Section>
 *   <Topbar.Actions>
 *     <Button size="small" variant="prominent">New</Button>
 *   </Topbar.Actions>
 * </Topbar>
 */
const TopbarBase = forwardRef<HTMLElement, TopbarProps>(
  ({ size = "comfortable", elevated = true, className, children, ...rest }, ref) => {
    const value = useMemo<TopbarContextValue>(
      () => ({
        size,
      }),
      [size],
    );

    return (
      <TopbarContext.Provider value={value}>
        <Glass
          as="header"
          ref={ref as React.Ref<Element>}
          layer="surface"
          className={cn(
            styles.topbar,
            styles[size],
            elevated ? styles.elevated : "",
            className,
          )}
          {...rest}
        >
          {children}
        </Glass>
      </TopbarContext.Provider>
    );
  },
);

TopbarBase.displayName = "Topbar";

export type TopbarSectionProps = ComponentPropsWithoutRef<"div"> & {
  /** Take the free space (e.g. a search field). */
  grow?: boolean;
  /** Default `"left"`. */
  align?: "left" | "center" | "right" | "between";
  /** Default `"regular"`. */
  gap?: TopbarGap;
  /** Let items wrap to a second line. */
  wrap?: boolean;
};

const alignClassMap: Record<NonNullable<TopbarSectionProps["align"]>, string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
  between: styles.alignBetween,
};

const gapClassMap: Record<TopbarGap, string> = {
  tight: styles.gapTight,
  regular: styles.gapRegular,
  relaxed: styles.gapRelaxed,
};

const TopbarSection = forwardRef<HTMLDivElement, TopbarSectionProps>(
  (
    {
      grow = false,
      align = "left",
      gap = "regular",
      wrap = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.topbarSection,
          wrap ? styles.sectionWrap : styles.sectionNoWrap,
          gapClassMap[gap],
          grow ? styles.sectionGrow : "",
          alignClassMap[align],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TopbarSection.displayName = "Topbar.Section";

export type TopbarBrandProps = ComponentPropsWithoutRef<"div"> & {
  /** Logo or icon before the title. */
  icon?: ReactNode;
  /** App or page name. */
  title?: ReactNode;
  /** Smaller line under the title. */
  subtitle?: ReactNode;
  iconClassName?: string;
};

const TopbarBrand = forwardRef<HTMLDivElement, TopbarBrandProps>(
  ({ icon, title, subtitle, iconClassName, children, className, ...rest }, ref) => {
    const { size } = useTopbarContext("Topbar.Brand");

    return (
      <div
        ref={ref}
        className={cn(styles.topbarBrand, className)}
        {...rest}
      >
        {icon && (
          <span
            className={cn(
              styles.brandIcon,
              size === "compact" ? styles.brandIconCompact : "",
              size === "comfortable" ? styles.brandIconComfortable : "",
              size === "spacious" ? styles.brandIconSpacious : "",
              iconClassName,
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <div className={styles.brandContent}>
          {children ? (
            children
          ) : (
            <>
              {title && (
                <span className={styles.brandTitle}>
                  {title}
                </span>
              )}
              {subtitle && (
                <span className={styles.brandSubtitle}>
                  {subtitle}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    );
  },
);

TopbarBrand.displayName = "Topbar.Brand";

export type TopbarActionsProps = ComponentPropsWithoutRef<"div"> & {
  /** Default `"regular"`. */
  gap?: TopbarGap;
};

const TopbarActions = forwardRef<HTMLDivElement, TopbarActionsProps>(
  ({ gap = "tight", className, children, ...rest }, ref) => {
    return (
      <TopbarSection
        ref={ref}
        align="right"
        gap={gap}
        className={cn(styles.topbarActions, className)}
        {...rest}
      >
        {children}
      </TopbarSection>
    );
  },
);

TopbarActions.displayName = "Topbar.Actions";

export type TopbarDividerProps = ComponentPropsWithoutRef<"div">;

const TopbarDivider = forwardRef<HTMLDivElement, TopbarDividerProps>(
  ({ className, ...rest }, ref) => {
    const { size } = useTopbarContext("Topbar.Divider");

    return (
      <div
        ref={ref}
        className={cn(
          styles.topbarDivider,
          size === "compact" ? styles.dividerCompact : "",
          size === "comfortable" ? styles.dividerComfortable : "",
          size === "spacious" ? styles.dividerSpacious : "",
          className,
        )}
        aria-hidden="true"
        {...rest}
      />
    );
  },
);

TopbarDivider.displayName = "Topbar.Divider";

type TopbarCompoundComponent = React.ForwardRefExoticComponent<
  TopbarProps & React.RefAttributes<HTMLElement>
> & {
  Section: typeof TopbarSection;
  Brand: typeof TopbarBrand;
  Actions: typeof TopbarActions;
  Divider: typeof TopbarDivider;
  useTopbar: () => TopbarContextValue;
};

const Topbar = TopbarBase as TopbarCompoundComponent;

Topbar.Section = TopbarSection;
Topbar.Brand = TopbarBrand;
Topbar.Actions = TopbarActions;
Topbar.Divider = TopbarDivider;
Topbar.useTopbar = () => useTopbarContext("Topbar.useTopbar");

export default Topbar;

