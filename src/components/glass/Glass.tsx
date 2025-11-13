import "./style/Glass.scss";
import React, { forwardRef, ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "../../func.ts";

export type GlassProps<T extends ElementType = "div"> = {
  as?: T;
  children?: React.ReactNode;
} & ComponentPropsWithoutRef<T>;

const Glass = forwardRef(
  <T extends ElementType = "div">(
    { as, children, className, ...props }: GlassProps<T>,
    ref: React.ForwardedRef<any>
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

        <Component
          ref={ref}
          className={cn("relative overflow-hidden rounded-[8px]", className)}
          {...props}
        >
          <div>
            <div className="glass-filter"></div>
            <div className="glass-overlay"></div>
            <div className="glass-specular"></div>
            <div className="glass-content">{children}</div>
          </div>
        </Component>
      </>
    );
  }
);

Glass.displayName = "Glass";

export default Glass;
