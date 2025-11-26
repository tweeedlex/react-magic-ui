import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
    title: "Checkbox",
    component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {
    args: {
        disabled: false,
        size: "medium",
        label: "Check me!",
        enableClickAnimation: true,
    },
};

export const Small: Story = {
    args: {
        disabled: false,
        size: "small",
        label: "Small checkbox",
        enableClickAnimation: true,
    },
};

export const Large: Story = {
    args: {
        disabled: false,
        size: "large",
        label: "Large checkbox",
        enableClickAnimation: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        size: "medium",
        label: "Disabled checkbox",
        enableClickAnimation: true,
    },
};
