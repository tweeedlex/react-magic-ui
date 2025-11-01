import React, { ChangeEventHandler } from "react";
import styled from "styled-components";

export type InputProps = {
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const StyledInput = styled.input<InputProps>`
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.2); 
    background: rgba(255, 255, 255, 0.1); 
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px); 
    line-height: 1;
    font-size: ${props => {
        switch (props.size) {
            case 'small':
                return '12px';
            case 'medium':
                return '15px';
            default:
                return '18px';
        }
    }};
    font-weight: 400;
    font-family: 'Arial', sans-serif;
    display: inline-block;
    color: #fff;
    padding: ${props => {
        switch (props.size) {
            case 'small':
                return '7px 15px 8px';
            case 'medium':
                return '9px 20px 11px';
            default:
                return '14px 20px 16px';
        }
    }};
    opacity: ${props => props.disabled ? 0.5 : 1};
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: rgba(255, 255, 255, 0.75)
    }
`;

const Input: React.FC<InputProps> = ({
                                         size,
                                         disabled,
                                         onChange,
                                         placeholder,
                                         ...props
                                       }) => {
  return (
    <StyledInput
      type="input"
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      size={size}
      {...props}
    />
  );
};

export default Input;