import { FC } from "react";
import Badge, { BadgeProps } from "../Badge";

type ExampleProps = BadgeProps & {
  text?: string;
};

const Example: FC<ExampleProps> = ({
  text = "Badge",
  variant = "default",
  leadingIcon,
  trailingIcon,
  ...props
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
      <Badge
        variant={variant}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        {...props}
      >
        {text}
      </Badge>
    </div>
  );
};

export default Example;

