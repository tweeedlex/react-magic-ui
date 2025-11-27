import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Glass",
  component: Example,
  argTypes: {
    enableLiquidAnimation: {
      control: "boolean",
      description: "Enable click-based liquid animation effect",
    },
    triggerAnimation: {
      control: "boolean",
      description: "Programmatically trigger liquid animation",
    },
    text: {
      control: "text",
      description: "Text to display inside the glass component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    text: "Glass Effect",
    enableLiquidAnimation: false,
    triggerAnimation: false,
  },
};

export const WithLiquidAnimation: Story = {
  args: {
    text: "Click Me!",
    enableLiquidAnimation: true,
    triggerAnimation: false,
  },
};

export const ProgrammaticAnimation: Story = {
  args: {
    text: "Auto Animation",
    enableLiquidAnimation: false,
    triggerAnimation: true,
  },
};

export const CustomContent: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "40px",
      }}
    >
      <Example
        text="Custom Glass Card"
        enableLiquidAnimation={true}
        rootStyle={{
          padding: "60px 80px",
          minWidth: "400px",
        }}
      />
    </div>
  ),
};

export const AsButton: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "40px",
      }}
    >
      <Example
        as="button"
        text="Glass Button"
        enableLiquidAnimation={true}
        rootStyle={{
          padding: "20px 40px",
          cursor: "pointer",
          border: "none",
          background: "transparent",
        }}
        onClick={() => console.log("Glass button clicked!")}
      />
    </div>
  ),
};
