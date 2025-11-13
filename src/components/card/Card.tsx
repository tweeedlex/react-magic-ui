import React from "react";
import { cn } from "../../func.ts";
import "./style/Card.scss";
import Glass from "../glass/Glass.tsx";

export type CardProps = {
  children?: React.ReactNode | string;
  size?: "small" | "medium" | "large";
  direction?: "column" | "row";
  align?: "center" | "start" | "end";
  justify?: "center" | "start" | "end" | "space-between" | "space-around";
};

const sizeStyles = {
  small: "small w-[200px]",
  medium: "medium w-[500px]",
  large: "large w-[350px]",
};

const Card: React.FC<CardProps> = ({
                                     children,
                                     size = "medium",
                                     direction = "col",
                                     align,
                                     justify,
                                     ...props
                                   }) => {
  const classNames = cn(
    "card flex bg-default",
    size,
    direction === "row" ? "flex-row" : "flex-col",
    align ? `items-${align}` : "items-start",
    justify ? `justify-${justify}` : "justify-start",
    sizeStyles[size],
    "p-5 gap-5 text-[15px] leading-none text-white"
  );


  return (
    <Glass
      className={classNames}
      {...props}
    >
      {children}
    </Glass>
  );
};

export default Card;
