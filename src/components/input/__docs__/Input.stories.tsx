import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Input",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    disabled: false,
    size: "medium",
    placeholder: "Type something...",
    onChange: () => console.log("onChange"),
  },
};
