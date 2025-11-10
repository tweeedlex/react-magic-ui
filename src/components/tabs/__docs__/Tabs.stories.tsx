import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Tabs",
  component: Example,
};

export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = {};


