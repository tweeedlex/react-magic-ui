import { FC, useState } from "react";
import Switch, { SwitchProps } from "../Switch";

const Example: FC<SwitchProps> = ({
                                    disabled = false,
                                    size = "small",
                                  }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Switch
        size={size}
        disabled={disabled}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    </div>
  );
};

export default Example;