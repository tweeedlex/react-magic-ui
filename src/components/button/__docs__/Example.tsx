import { FC } from "react";
import Button, { ButtonProps } from "../Button";

const Example: FC<ButtonProps> = ({
                                    disabled = false,
                                    onClick = () => {},
                                    variant = "glass",
                                    destructive = false,
                                    tint,
                                    size = "small",
                                    text = "Button",
                                    rounded = false
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
      <Button
        size={size}
        text={text}
        disabled={disabled}
        onClick={onClick}
        variant={variant}
        destructive={destructive}
        tint={tint}
        rounded={rounded}
      />
    </div>
  );
};

export default Example;