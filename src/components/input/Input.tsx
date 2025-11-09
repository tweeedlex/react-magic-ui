import React, { ChangeEventHandler } from "react";
import clsx from "clsx";

export type InputProps = {
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const sizeStyles = {
  small: "text-[12px] py-[7px] px-[15px]",
  medium: "text-[15px] py-[9px] px-[20px]",
  large: "text-[18px] py-[14px] px-[20px]",
};

const Input: React.FC<InputProps> = ({
                                       size = "medium",
                                       disabled,
                                       onChange,
                                       placeholder,
                                       ...props
                                     }) => {
  return (
    <input
      type="text"
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={clsx(
        "glass bg-default text-white font-normal leading-none placeholder:text-white/75 focus:outline-none",
        sizeStyles[size],
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
      {...props}
    />
  );
};

export default Input;
