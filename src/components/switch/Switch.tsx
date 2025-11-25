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
      rootClassName={clsx(
        "rounded-[999px]",
        size === "small" && "w-[40px] h-[20px]",
        size === "medium" && "w-[50px] h-[25px]",
        size === "large" && "w-[60px] h-[30px]"
      )}
      disabled={disabled}
      {...props}
    />
  );
};

export default Switch;
