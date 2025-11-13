import "./style/Glass.scss";
import React, {
  forwardRef,
  ElementType,
  ComponentPropsWithoutRef,
} from "react";
import clsx from "clsx";

export type GlassProps<T extends ElementType = "div"> = {
  as?: T;
  children?: React.ReactNode;
  rootClassName?: string;
} & ComponentPropsWithoutRef<T>;

const Glass = forwardRef(
  <T extends ElementType = "div">(
    { as, children, className, rootClassName, ...props }: GlassProps<T>,
    ref: React.ForwardedRef<any>,
  ) => {
    const Component = as || "div";

    return (
      <>
        <svg style={{ display: "none" }}>
          <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.005"
              numOctaves="5"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="80"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        <div className={clsx("relative overflow-hidden rounded-[8px]", rootClassName)}>
          <div className="glass-filter"></div>
          <div className="glass-overlay"></div>
          <div className="glass-specular"></div>
          <Component
            {...props}
            ref={ref}
            className={clsx("glass-content", className)}
          >
            {children}
          </Component>
        </div>
      </>
    );
  },
);

Glass.displayName = "Glass";

export default Glass;
