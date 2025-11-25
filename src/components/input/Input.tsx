import React, { ChangeEventHandler } from "react";
import { cn } from "../../func.ts";
import Glass from "../glass/Glass.tsx";
import styles from "./style/Input.module.scss";

export type InputProps = {
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  enableClickAnimation?: boolean;
};

const Input: React.FC<InputProps> = ({
  size = "medium",
  disabled,
  onChange,
  placeholder,
  enableClickAnimation = true,
  ...props
}) => {
  return (
    <Glass enableLiquidAnimation={enableClickAnimation}>
      <input
        type="text"
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          styles.input,
          styles[size],
          disabled ? styles.disabled : ""
        )}
        {...props}
      />
    </Glass>
  );
};

export default Input;
