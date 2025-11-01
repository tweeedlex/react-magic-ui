import { FC } from "react";
import Card, { CardProps } from "../Card";

const Example: FC<CardProps> = ({
                                    size = "small",
                                    direction = "column",
                                    align = "start",
                                    justify = "start"
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
      <Card
        size={size}
        direction={direction}
        align={align}
        justify={justify}
      >
        <h1>Title</h1>
        <h2>Subtitle</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          vehicula, sapien nec consectetur aliquam, turpis ex tincidunt
          turpis, sed facilisis eros libero a purus.
        </p>
      </Card>
    </div>
  );
};

export default Example;