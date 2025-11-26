import React from "react";
import styles from "./styles/Switch.module.scss";
import clsx from "clsx";
import Glass from "../glass/Glass.tsx";

export type SwitchProps = {
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  isActive?: boolean;
  enableClickAnimation?: boolean;
  setIsActive?: (isActive: boolean) => void;
};

const Switch: React.FC<SwitchProps> = ({
  size = "medium",
  disabled,
  isActive = false,
  setIsActive,
  enableClickAnimation = true,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && setIsActive) setIsActive(!isActive);
  };

  return (
    <Glass
      enableLiquidAnimation={enableClickAnimation}
      as="button"
      onClick={handleClick}
      className={clsx(styles.switch, styles[size], isActive && styles.active, disabled && styles.disabled)}
      rootClassName={clsx(styles[size])}
      rootStyle={{ borderRadius: "999px" }}
      disabled={disabled}
      {...props}
    />
  );
};

export default Switch;
