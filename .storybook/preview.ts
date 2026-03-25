import type { Preview } from "@storybook/web-components-vite";
import addonPerformancePanel from "@github-ui/storybook-addon-performance-panel/universal";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    addons: [addonPerformancePanel()],
  },
};

export default preview;
