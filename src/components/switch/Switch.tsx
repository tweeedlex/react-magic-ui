import React from "react";
import "./styles/Switch.scss";
import { cn } from "../../func.ts";
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
      className={cn("switch", size, isActive ? "active" : "", disabled ? "disabled" : "")}
      disabled={disabled}
      {...props}
    />
  );
};

export default Switch;
