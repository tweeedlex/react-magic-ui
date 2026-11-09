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

  // vite.config.ts is for the library build: its type rollup reads dist/index.d.ts,
  // which doesn't exist on a clean checkout, so Storybook drops those plugins
  viteFinal(config) {
    const libraryOnly = new Set(["vite:dts", "remove-demo-assets"]);
    config.plugins = (config.plugins ?? [])
      .flat(Infinity)
      .filter((plugin) => !(plugin && typeof plugin === "object" && "name" in plugin && libraryOnly.has(plugin.name)));
    return config;
  },
};
export default config;
