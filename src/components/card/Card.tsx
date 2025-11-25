import React from "react";
import { cn } from "../../func.ts";
import styles from "./style/Card.module.scss";
import Glass from "../glass/Glass.tsx";

export type CardProps = {
  children?: React.ReactNode | string;
  size?: "small" | "medium" | "large";
  direction?: "column" | "row";
  align?: "center" | "start" | "end";
  justify?: "center" | "start" | "end" | "space-between" | "space-around";
};

const Card: React.FC<CardProps> = ({
  children,
  size = "medium",
  direction = "col",
  align,
  justify,
  ...props
}) => {
  const alignClass = align ? styles[`items${align.charAt(0).toUpperCase() + align.slice(1)}`] : styles.itemsStart;
  const justifyClass = justify
    ? styles[`justify${justify === "space-between" ? "Between" : justify === "space-around" ? "Around" : justify.charAt(0).toUpperCase() + justify.slice(1)}`]
    : styles.justifyStart;

  const classNames = cn(
    styles.card,
    styles[size],
    direction === "row" ? styles.flexRow : styles.flexCol,
    alignClass,
    justifyClass,
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
