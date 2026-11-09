import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Button",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

const base = { text: "Button", disabled: false, size: "medium", onClick: () => console.log("Button") } as const;

export const Glass: Story = { args: { ...base, variant: "glass" } };

export const Prominent: Story = { args: { ...base, text: "Done", variant: "prominent" } };

export const Destructive: Story = { args: { ...base, text: "Delete", destructive: true } };

export const DestructiveProminent: Story = { args: { ...base, text: "Delete", variant: "prominent", destructive: true } };

export const Tinted: Story = { args: { ...base, text: "Answer", variant: "prominent", tint: "var(--rmu-green)" } };

export const Rounded: Story = { args: { ...base, text: "+", rounded: true } };
