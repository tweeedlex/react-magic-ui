import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/Introduction.mdx", "../src/**/__docs__/*.mdx", "../src/**/__docs__/*.stories.tsx"],

  addons: ["@storybook/addon-links", "@chromatic-com/storybook", "@storybook/addon-docs"],

  staticDirs: ["./public"],

  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },

  features: {
    // the stage decorator in preview.tsx paints the wallpaper instead
    backgrounds: false,
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
