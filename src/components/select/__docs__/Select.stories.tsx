import type { Meta, StoryObj } from "@storybook/react-vite";
import Example from "./Example";

const meta: Meta<typeof Example> = {
    title: "Select",
    component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

const sampleOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
    { value: "option5", label: "Option 5" },
];

export const Default: Story = {
    args: {
        disabled: false,
        size: "medium",
        options: sampleOptions,
        placeholder: "Select an option",
        enableClickAnimation: true,
    },
};

export const Small: Story = {
    args: {
        disabled: false,
        size: "small",
        options: sampleOptions,
        placeholder: "Select an option",
        enableClickAnimation: true,
    },
};

export const Large: Story = {
    args: {
        disabled: false,
        size: "large",
        options: sampleOptions,
        placeholder: "Select an option",
        enableClickAnimation: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        size: "medium",
        options: sampleOptions,
        placeholder: "Select an option",
        enableClickAnimation: true,
    },
};

export const ManyOptions: Story = {
    args: {
        disabled: false,
        size: "medium",
        options: Array.from({ length: 20 }, (_, i) => ({
            value: `option${i + 1}`,
            label: `Option ${i + 1}`,
        })),
        placeholder: "Select from many options",
        enableClickAnimation: true,
    },
};
