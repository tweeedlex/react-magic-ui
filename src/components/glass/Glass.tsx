import "./style/Glass.scss";
import React from "react";
export type GlassProps = {
  children?: React.ReactNode;
};

const Glass: React.FC<GlassProps> = ({ children }) => {
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

      <div className={"relative overflow-hidden rounded-[8px]"}>
        <div className="glass-filter"></div>
        <div className="glass-overlay"></div>
        <div className="glass-specular"></div>
        <div className="glass-content">{children}</div>
      </div>
    </>
  );
};

export default Glass;
