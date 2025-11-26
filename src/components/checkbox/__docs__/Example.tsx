import { FC, useState } from "react";
import Checkbox, { CheckboxProps } from "../Checkbox";

const Example: FC<Omit<CheckboxProps, 'checked' | 'onChange'>> = ({
    disabled = false,
    size = "medium",
    label = "Check me!",
    enableClickAnimation = true,
}) => {
    const [checked, setChecked] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <Checkbox
                size={size}
                disabled={disabled}
                label={label}
                checked={checked}
                onChange={setChecked}
                enableClickAnimation={enableClickAnimation}
            />
        </div>
    );
};

export default Example;
