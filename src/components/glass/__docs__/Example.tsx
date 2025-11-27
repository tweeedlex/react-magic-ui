import { FC } from "react";
import Glass, { GlassProps } from "../Glass";

const Example: FC<GlassProps & { text?: string }> = ({
  enableLiquidAnimation = false,
  triggerAnimation = false,
  text = "Glass Effect",
  as = "div",
  rootClassName = "",
  rootStyle = {},
  ...props
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "40px",
      }}
    >
      <Glass
        as={as}
        enableLiquidAnimation={enableLiquidAnimation}
        triggerAnimation={triggerAnimation}
        rootClassName={rootClassName}
        rootStyle={{
          padding: "40px 60px",
          minWidth: "300px",
          ...rootStyle,
        }}
        {...props}
      >
        <div style={{ color: "white", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
            {text}
          </h2>
          <p style={{ margin: "10px 0 0", fontSize: "14px", opacity: 0.9 }}>
            {enableLiquidAnimation ? "Click me to see liquid animation!" : "Beautiful glass morphism effect"}
          </p>
        </div>
      </Glass>
    </div>
  );
};

export default Example;
