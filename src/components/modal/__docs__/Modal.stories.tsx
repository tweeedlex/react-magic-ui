import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Modal",
  component: Example,
  argTypes: {
    footer: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    title: "Glass modal",
    description: "A translucent surface that keeps the focus on your content.",
    size: "md",
    closeOnOverlay: true,
    closeOnEsc: true,
    lockScroll: true,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const OverlayLocked: Story = {
  args: {
    closeOnOverlay: false,
  },
};


