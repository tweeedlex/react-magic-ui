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
    text: "Default",
    variant: "default",
  },
};

export const Positive: Story = {
  args: {
    text: "Positive",
    variant: "positive",
  },
};

export const Negative: Story = {
  args: {
    text: "Negative",
    variant: "negative",
  },
};

export const Warning: Story = {
  args: {
    text: "Warning",
    variant: "warning",
  },
};

export const Info: Story = {
  args: {
    text: "Info",
    variant: "info",
  },
};

export const Neutral: Story = {
  args: {
    text: "Neutral",
    variant: "neutral",
  },
};

