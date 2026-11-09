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

/** Island (or bar) height: compact 48px, comfortable 60px, spacious 72px. */
export type TopbarSize = "compact" | "comfortable" | "spacious";

/**
 * - `"islands"` (default) — no bar behind the content. The brand and each
 *   `Topbar.Group` are their own glass capsules, and a lone button is its own
 *   capsule (iOS 26 toolbars: glass only where there are controls).
 * - `"bar"` — one glass capsule across the full width (the pre-2.0 look).
 */
export type TopbarVariant = "islands" | "bar";

type TopbarGlassProps = Omit<GlassStyleProps, "layer">;

export type TopbarContextValue = {
  size: TopbarSize;
  variant: TopbarVariant;
  elevated: boolean;
  /** Glass props given to Topbar. The islands use them. */
  glass: TopbarGlassProps;
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
  /** Default `"islands"`. */
  variant?: TopbarVariant;
  /** Soft drop shadow under the bar, or under each island. Default `true`. */
  elevated?: boolean;
} & TopbarGlassProps;

/**
 * Top of a page. By default there is no bar: the brand, each group of
 * secondary actions and the primary button float as separate glass capsules.
 * `variant="bar"` puts everything on one full-width glass capsule instead.
 *
 * @example
 * <Topbar size="compact">
 *   <Topbar.Brand icon={<Logo />} title="My app" />
 *   <Topbar.Actions>
 *     <Topbar.Group>
 *       <Button rounded size="small" icon={<Bell />} aria-label="Alerts" />
 *       <Button rounded size="small" icon={<Gear />} aria-label="Settings" />
 *     </Topbar.Group>
 *     <Button size="small" variant="prominent">New</Button>
 *   </Topbar.Actions>
 * </Topbar>
 */
const TopbarBase = forwardRef<HTMLElement, TopbarProps>(
  (
    {
      size = "comfortable",
      variant = "islands",
      elevated = true,
      tone,
      material,
      lens,
      enableLiquidAnimation,
      triggerAnimation,
      rootClassName,
      rootStyle,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const glass = useMemo<TopbarGlassProps>(() => {
      const props: TopbarGlassProps = {};
      if (tone !== undefined) props.tone = tone;
      if (material !== undefined) props.material = material;
      if (lens !== undefined) props.lens = lens;
      if (enableLiquidAnimation !== undefined) props.enableLiquidAnimation = enableLiquidAnimation;
      if (triggerAnimation !== undefined) props.triggerAnimation = triggerAnimation;
      return props;
    }, [tone, material, lens, enableLiquidAnimation, triggerAnimation]);

    const value = useMemo<TopbarContextValue>(
      () => ({ size, variant, elevated, glass }),
      [size, variant, elevated, glass],
    );

    const classes = cn(
      styles.topbar,
      styles[size],
      variant === "islands" ? styles.islands : styles.bar,
      elevated ? styles.elevated : "",
      rootClassName,
      className,
    );
    const mergedStyle = rootStyle ? { ...rootStyle, ...style } : style;

    return (
      <TopbarContext.Provider value={value}>
        {variant === "bar" ? (
          <Glass
            as="header"
            ref={ref as React.Ref<Element>}
            layer="surface"
            className={classes}
            style={mergedStyle}
            {...glass}
            {...rest}
          >
            {children}
          </Glass>
        ) : (
          <header
            ref={ref}
            className={classes}
            style={mergedStyle}
            data-glass-tone={tone && tone !== "auto" ? tone : undefined}
            {...rest}
          >
            {children}
          </header>
        )}
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
  /**
   * Put the brand on its own glass capsule (`"islands"` variant only).
   * `false` gives a bare title like an iOS navigation bar; then make sure it
   * stays readable on your background. Default `true`.
   */
  glass?: boolean;
};

const TopbarBrand = forwardRef<HTMLDivElement, TopbarBrandProps>(
  (
    { icon, title, subtitle, iconClassName, glass = true, children, className, ...rest },
    ref,
  ) => {
    const ctx = useTopbarContext("Topbar.Brand");
    const { size } = ctx;
    const island = ctx.variant === "islands" && glass;

    const classes = cn(
      styles.topbarBrand,
      island ? styles.island : "",
      island && ctx.elevated ? styles.islandElevated : "",
      island && icon ? styles.brandIslandWithIcon : "",
      className,
    );

    const content = (
      <>
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
              {title && <span className={styles.brandTitle}>{title}</span>}
              {subtitle && <span className={styles.brandSubtitle}>{subtitle}</span>}
            </>
          )}
        </div>
      </>
    );

    if (island) {
      return (
        <Glass ref={ref} layer="surface" className={classes} {...ctx.glass} {...rest}>
          {content}
        </Glass>
      );
    }

    return (
      <div ref={ref} className={classes} {...rest}>
        {content}
      </div>
    );
  },
);

TopbarBrand.displayName = "Topbar.Brand";

export type TopbarActionsProps = ComponentPropsWithoutRef<"div"> & {
  /** Default `"tight"`. */
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

export type TopbarGroupProps = ComponentPropsWithoutRef<"div"> & {
  /** Default `"tight"`. */
  gap?: TopbarGap;
};

/**
 * Glass capsule for related secondary actions (icon buttons, a badge).
 * Buttons inside become layers of this glass, not glass on glass. Keep the
 * primary action outside the group so it stands alone. Apple keeps a toolbar
 * to about three groups.
 */
const TopbarGroup = forwardRef<HTMLDivElement, TopbarGroupProps>(
  ({ gap = "tight", className, children, ...rest }, ref) => {
    const ctx = useTopbarContext("Topbar.Group");
    const island = ctx.variant === "islands";

    return (
      <Glass
        ref={ref}
        role="group"
        layer={island ? "surface" : "auto"}
        className={cn(
          styles.topbarGroup,
          gapClassMap[gap],
          island ? styles.island : "",
          island && ctx.elevated ? styles.islandElevated : "",
          className,
        )}
        {...(island ? ctx.glass : {})}
        {...rest}
      >
        {children}
      </Glass>
    );
  },
);

TopbarGroup.displayName = "Topbar.Group";

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
  Group: typeof TopbarGroup;
  Divider: typeof TopbarDivider;
  useTopbar: () => TopbarContextValue;
};

const Topbar = TopbarBase as TopbarCompoundComponent;

Topbar.Section = TopbarSection;
Topbar.Brand = TopbarBrand;
Topbar.Actions = TopbarActions;
Topbar.Group = TopbarGroup;
Topbar.Divider = TopbarDivider;
Topbar.useTopbar = () => useTopbarContext("Topbar.useTopbar");

export default Topbar;
