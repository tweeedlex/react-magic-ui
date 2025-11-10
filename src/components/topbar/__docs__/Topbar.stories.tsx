import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Topbar",
  component: Example,
};

export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    size: "compact",
    subtitle: "Today",
    actions: [
      { id: "notify", label: "Alerts", variant: "link" },
      { id: "new", label: "New", variant: "default" },
    ],
  },
};

export const Spacious: Story = {
  args: {
    size: "spacious",
    title: "Glass Workspace",
    subtitle: "Analytics Overview",
    actions: [
      { id: "teams", label: "Teams", variant: "link" },
      { id: "share", label: "Share", variant: "link" },
      { id: "create", label: "Create", variant: "default" },
    ],
  },
};

export const Flat: Story = {
  args: {
    elevated: false,
    actions: [
      { id: "help", label: "Help", variant: "link" },
      { id: "upgrade", label: "Upgrade", variant: "default" },
    ],
  },
};


