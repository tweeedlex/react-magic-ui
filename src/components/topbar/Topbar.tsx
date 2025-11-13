import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import { cn } from "../../func.ts";
import Glass from "../glass/Glass.tsx";

type TopbarSize = "compact" | "comfortable" | "spacious";

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

const topbarSizeStyles: Record<TopbarSize, string> = {
  compact: "min-h-[52px] px-4 py-2 gap-3 text-sm",
  comfortable: "min-h-[64px] px-5 py-3 gap-4 text-base",
  spacious: "min-h-[72px] px-6 py-4 gap-5 text-base",
};

const sectionGapStyles = {
  tight: "gap-2",
  regular: "gap-3",
  relaxed: "gap-4",
} as const;

type SectionGap = keyof typeof sectionGapStyles;

const dividerHeights: Record<TopbarSize, string> = {
  compact: "h-8",
  comfortable: "h-9",
  spacious: "h-10",
};

const iconSizes: Record<TopbarSize, string> = {
  compact: "w-9 h-9 text-base",
  comfortable: "w-10 h-10 text-lg",
  spacious: "w-11 h-11 text-xl",
};

export type TopbarProps = ComponentPropsWithoutRef<"header"> & {
  size?: TopbarSize;
  elevated?: boolean;
};

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
          ref={ref}
          className={cn(
            "text-white flex items-center w-full rounded-2xl",
            topbarSizeStyles[size],
            elevated ? "shadow-[0_18px_40px_rgba(15,23,42,0.32)]" : "",
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
  grow?: boolean;
  align?: "left" | "center" | "right" | "between";
  gap?: SectionGap;
  wrap?: boolean;
};

const alignClassName: Record<NonNullable<TopbarSectionProps["align"]>, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  between: "justify-between",
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
          "flex items-center min-w-0",
          wrap ? "flex-wrap" : "flex-nowrap",
          sectionGapStyles[gap],
          grow ? "flex-1 min-w-0" : "",
          alignClassName[align],
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
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  iconClassName?: string;
};

const TopbarBrand = forwardRef<HTMLDivElement, TopbarBrandProps>(
  ({ icon, title, subtitle, iconClassName, children, className, ...rest }, ref) => {
    const { size } = useTopbarContext("Topbar.Brand");

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3 min-w-0 text-white", className)}
        {...rest}
      >
        {icon && (
          <span
            className={cn(
              "flex items-center justify-center rounded-xl bg-white/15",
              "shadow-[0_12px_30px_rgba(15,23,42,0.35)]",
              iconSizes[size],
              iconClassName,
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <div className="flex flex-col min-w-0">
          {children ? (
            children
          ) : (
            <>
              {title && (
                <span className="font-semibold tracking-tight truncate">
                  {title}
                </span>
              )}
              {subtitle && (
                <span className="text-sm font-normal text-white/70 truncate">
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
  gap?: SectionGap;
};

const TopbarActions = forwardRef<HTMLDivElement, TopbarActionsProps>(
  ({ gap = "tight", className, children, ...rest }, ref) => {
    return (
      <TopbarSection
        ref={ref}
        align="right"
        gap={gap}
        className={cn("text-sm font-medium", className)}
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
          "w-px rounded-full bg-white/20",
          dividerHeights[size],
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


