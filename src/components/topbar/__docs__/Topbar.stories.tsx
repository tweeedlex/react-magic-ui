import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Topbar",
  component: Example,
  parameters: { stage: "wide" },
};

export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    size: "compact",
    subtitle: "Today",
    actions: [
      { id: "notify", label: "Alerts", variant: "glass" },
      { id: "new", label: "New", variant: "prominent" },
    ],
  },
};

export const Spacious: Story = {
  args: {
    size: "spacious",
    title: "Glass Workspace",
    subtitle: "Analytics Overview",
    actions: [
      { id: "teams", label: "Teams", variant: "glass" },
      { id: "share", label: "Share", variant: "glass" },
      { id: "create", label: "Create", variant: "prominent" },
    ],
  },
};

export const Flat: Story = {
  args: {
    elevated: false,
    actions: [
      { id: "help", label: "Help", variant: "glass" },
      { id: "upgrade", label: "Upgrade", variant: "prominent" },
    ],
  },
};


