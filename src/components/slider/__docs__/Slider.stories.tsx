import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
    title: "Slider",
    component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {
    args: {
        disabled: false,
        size: "medium",
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        enableClickAnimation: true,
    },
};

export const Small: Story = {
    args: {
        disabled: false,
        size: "small",
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        enableClickAnimation: true,
    },
};

export const Large: Story = {
    args: {
        disabled: false,
        size: "large",
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        enableClickAnimation: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        size: "medium",
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        enableClickAnimation: true,
    },
};

export const StepTen: Story = {
    args: {
        disabled: false,
        size: "medium",
        min: 0,
        max: 100,
        step: 10,
        showValue: true,
        enableClickAnimation: true,
    },
};
