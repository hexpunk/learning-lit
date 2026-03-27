import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  framework: "@storybook/web-components-vite",
  addons: ["@github-ui/storybook-addon-performance-panel/universal"],
  core: {
    disableTelemetry: true,
  },
};
export default config;
