import React from "react";
import "./style/Button.scss";
import { cn } from "../../func.ts";
import Glass from "../glass/Glass.tsx";

export type ButtonProps = {
  text?: string;
  disabled?: boolean;
  variant?: "default" | "danger" | "link";
  size?: "small" | "medium" | "large";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const sizeStyles = {
  small: "small text-sm",
  medium: "medium text-lg",
  large: "large text-md",
};

const Button: React.FC<ButtonProps> = ({
  size = "medium",
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

  return (
    <Glass>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "btn",
          variant ? `bg-${variant}` : "bg-default",
          sizeStyles[size],
          disabled ? "opacity-50 cursor-not-allowed" : "",
          "hover:bg-white/30 active:bg-white/40",
        )}
        disabled={disabled}
        {...props}
      >
        {text}
      </button>
    </Glass>
  );
};

export default Button;
