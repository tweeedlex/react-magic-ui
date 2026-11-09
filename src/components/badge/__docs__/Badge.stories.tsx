import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Badge",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    text: "Beta",
    variant: "default",
  },
};

export const Tinted: Story = {
  args: {
    text: "New",
    tint: "var(--rmu-blue)",
  },
};

export const Notification: Story = {
  args: {
    text: "3",
    variant: "notification",
  },
};
