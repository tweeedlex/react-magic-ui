import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "GlassText",
  component: Example,
  globals: { wallpaper: "blobs" },
  argTypes: {
    tone: { control: "inline-radio", options: ["auto", "light", "dark"] },
    tint: { control: "color" },
    as: { control: "select", options: ["span", "h1", "h2", "p"] },
    fontSize: { control: { type: "range", min: 24, max: 280, step: 2 } },
    fontWeight: { control: { type: "range", min: 300, max: 900, step: 100 } },
  },
  args: { text: "9:41", fontSize: 180, fontWeight: 700, tone: "auto", as: "span" },
};

export default meta;
type Story = StoryObj<typeof Example>;

/** The lock screen clock. On a dark wallpaper the glass brightens. */
export const Clock: Story = {};

/** Over a light wallpaper the glass darkens instead, so the glyphs still read. */
export const OnLight: Story = {
  globals: { wallpaper: "aurora" },
  args: { text: "Hello", fontSize: 150 },
};

export const Tinted: Story = {
  args: { text: "Liquid", fontSize: 140, tint: "var(--rmu-blue)" },
};

export const Title: Story = {
  args: { text: "Good morning", as: "h1", fontSize: 72, fontWeight: 700 },
};
