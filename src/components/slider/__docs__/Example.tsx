import { FC, useState } from "react";
import Slider, { SliderProps } from "../Slider";

const Example: FC<Omit<SliderProps, 'value' | 'onChange'>> = ({
    disabled = false,
    size = "medium",
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    enableClickAnimation = true,
}) => {
    const [value, setValue] = useState(50);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: "40px",
                padding: "20px",
                width: "100%",
                maxWidth: "400px",
                margin: "0 auto",
            }}
        >
            <div style={{ width: "100%" }}>
                <Slider
                    size={size}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={setValue}
                    showValue={showValue}
                    enableClickAnimation={enableClickAnimation}
                />
            </div>
        </div>
    );
};

export default Example;
