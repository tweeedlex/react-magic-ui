import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Button",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    text: "Button",
    variant: "default",
    disabled: false,
    size: "medium",
    onClick: () => console.log("Button"),
  },
};

export const Positive: Story = {
  args: {
    text: "Button",
    variant: "positive",
    disabled: false,
    size: "medium",
    onClick: () => console.log("Button"),
  },
};

export const Negative: Story = {
  args: {
    text: "Button",
    variant: "negative",
    disabled: false,
    size: "medium",
    onClick: () => console.log("Button"),
  },
};

export const Warning: Story = {
  args: {
    text: "Button",
    variant: "warning",
    disabled: false,
    size: "medium",
    onClick: () => console.log("Button"),
  },
};

export const Rounded: Story = {
  args: {
    text: "+",
    variant: "positive",
    disabled: false,
    size: "medium",
    rounded: true,
    onClick: () => console.log("Rounded Button"),
  },
};
