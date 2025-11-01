import React from "react";
import styled from "styled-components";
export type CardProps = {
  children?: React.ReactNode | string;
  size?: "small" | "medium" | "large";
  direction?: "column" | "row";
  align?: "center" | "start" | "end";
  justify?: "center" | "start" | "end" | "space-between" | "space-around";
};

const StyledCard = styled.div<CardProps>`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 20px;
    line-height: 1;
    font-size: 15px;
    color: rgb(255, 255, 255);
    display: flex;
    gap: 20px;
    flex-direction: ${props => props.direction || 'column'};
    align-items: ${props => props.align || 'start'};
    justify-content: ${props => props.justify || 'start'};
    width: ${props => {
        switch (props.size) {
            case 'small':
                return '200px';
            case 'medium':
                return '350px';
            default:
                return '500px';
        }
    }};
`;

const Card: React.FC<CardProps> = ({
                                         children,
                                         size,
                                         direction,
                                         align,
                                         justify,
                                         ...props
                                       }) => {
  return (
    <StyledCard
      size={size}
      direction={direction}
      align={align}
      justify={justify}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;