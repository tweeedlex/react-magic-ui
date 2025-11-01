import { FC } from "react";
import Input, { InputProps } from "../Input";

const Example: FC<InputProps> = ({
                                    disabled = false,
                                    onChange = () => {},
                                    size = "small",
                                    placeholder = "Type something...",
                                  }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Input
        size={size}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Example;