import React from "react";
import "./styles/Switch.scss";

export type SwitchProps = {
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  isActive?: boolean;
  setIsActive?: (isActive: boolean) => void;
};

const Switch: React.FC<SwitchProps> = ({
                                         size,
                                         disabled,
                                         isActive,
                                         setIsActive,
                                         ...props
                                       }) => {

  const handleClick = () => {
    if (!disabled && setIsActive) {
      setIsActive(!isActive);
    }
  };

  const classList = [
    "switch",
    disabled ? "disabled" : "",
    isActive ? "active" : "",
    size
  ];

  return (
    <button
      onClick={handleClick}
      className={classList.join(" ")}
      {...props}
    ></button>
  );
};

export default Switch;