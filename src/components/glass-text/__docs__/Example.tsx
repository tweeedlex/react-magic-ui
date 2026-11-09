import { FC } from "react";
import GlassText, { GlassTextProps } from "../GlassText";

type ExampleProps = Pick<GlassTextProps, "tone" | "tint" | "as"> & {
  text: string;
  /** px */
  fontSize: number;
  fontWeight: number;
};

const Example: FC<ExampleProps> = ({ text, fontSize, fontWeight, tone, tint, as }) => (
  <GlassText as={as} tone={tone} tint={tint} style={{ fontSize, fontWeight, letterSpacing: "-0.02em", margin: 0 }}>
    {text}
  </GlassText>
);

export default Example;
