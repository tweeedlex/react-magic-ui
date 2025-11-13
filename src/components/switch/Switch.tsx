import React from "react";
import "./styles/Switch.scss";
import clsx from "clsx";
import Glass from "../glass/Glass.tsx";

export type SwitchProps = {
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  isActive?: boolean;
  setIsActive?: (isActive: boolean) => void;
};

const Switch: React.FC<SwitchProps> = ({
                                         size = "medium",
                                         disabled,
                                         isActive = false,
                                         setIsActive,
                                         ...props
                                       }) => {
  const handleClick = () => {
    if (!disabled && setIsActive) setIsActive(!isActive);
  };

  return (
    <Glass
      as="button"
      onClick={handleClick}
      className={clsx("switch", size, isActive ? "active" : "", disabled ? "disabled" : "")}
      rootClassName={clsx("rounded-[999px]", size === "small" && "flex h-[20px]")}
      disabled={disabled}
      {...props}
    />
  );
};

export default Switch;
