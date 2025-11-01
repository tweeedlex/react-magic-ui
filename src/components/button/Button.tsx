import React from "react";
import "./style/Button.scss";

export type ButtonProps = {
  text?: string;
  disabled?: boolean;
  variant?: "default" | "danger" | "link";
  size?: "small" | "medium" | "large";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<ButtonProps> = ({
                                         size,
                                         variant,
                                         disabled,
                                         text,
                                         onClick,
                                         ...props
                                       }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const classList = [
    "button",
    disabled ? "disabled" : "",
    variant ? variant : "default",
    size ? size : "medium",
  ];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={classList.join(" ")}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
