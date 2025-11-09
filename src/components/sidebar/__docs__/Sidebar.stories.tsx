import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "Sidebar",
  component: Example,
};

export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    collapsible: true,
  },
};

export const Collapsed: Story = {
  args: {
    collapsible: true,
    collapsed: true,
  },
};

export const Large: Story = {
  args: {
    size: "large",
    collapsible: true,
  },
};

export const WithBadges: Story = {
  args: {
    collapsible: true,
    items: [
      { id: "inbox", label: "Inbox", badge: 7 },
      { id: "updates", label: "Updates", badge: 2 },
      { id: "archive", label: "Archive" },
    ],
    defaultActiveItemId: "updates",
  },
};

