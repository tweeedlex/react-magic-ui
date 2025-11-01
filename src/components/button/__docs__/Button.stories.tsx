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

export const Danger: Story = {
  args: {
    text: "Button",
    variant: "danger",
    disabled: false,
    size: "medium",
    onClick: () => console.log("Button"),
  },
};

export const Link: Story = {
  args: {
    text: "Button",
    variant: "link",
    disabled: false,
    size: "medium",
    onClick: () => console.log("Button"),
  },
};
