import React, { useState, useRef, useEffect } from "react";
import styles from "./style/Select.module.scss";
import clsx from "clsx";
import Glass from "../glass/Glass.tsx";

export type SelectOption = {
    value: string;
    label: string;
};

export type SelectProps = {
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    enableClickAnimation?: boolean;
};

const Select: React.FC<SelectProps> = ({
    size = "medium",
    disabled,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    enableClickAnimation = true,
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (optionValue: string) => {
        if (onChange) {
            onChange(optionValue);
        }
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            ref={selectRef}
            className={clsx(
                styles.selectContainer,
                styles[size],
                disabled && styles.disabled
            )}
            {...props}
        >
            <Glass
                enableLiquidAnimation={enableClickAnimation}
                as="button"
                type="button"
                onClick={handleToggle}
                className={clsx(
                    styles.selectButton,
                    styles[size],
                    disabled && styles.disabled,
                    isOpen && styles.open
                )}
                rootClassName={styles.glassRoot}
                disabled={disabled}
            >
                <span className={clsx(styles.selectedValue, !selectedOption && styles.placeholder)}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={clsx(styles.arrow, isOpen && styles.arrowOpen)}
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 1L6 6L11 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Glass>

            {isOpen && !disabled && (
                <Glass
                    enableLiquidAnimation={false}
                    rootClassName={clsx(styles.dropdown, styles[size])}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={clsx(
                                styles.option,
                                styles[size],
                                option.value === value && styles.selected
                            )}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </Glass>
            )}
        </div>
    );
};

export default Select;
