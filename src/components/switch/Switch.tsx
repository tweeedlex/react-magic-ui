import clsx from 'clsx';

import React from "react";
import "./styles/Switch.scss";

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
    <button
      onClick={handleClick}
      className={clsx("switch glass", size, isActive ? "active" : "", disabled ? "disabled" : "")}
      disabled={disabled}
      {...props}
    />
  );
};

export default Switch;
