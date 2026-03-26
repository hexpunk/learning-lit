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
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#ffffff" },
        { name: "light", value: "#f5f5f5" },
      ],
    },
  },
  initialGlobals: {
    backgrounds: { value: "white" },
  },
};

export default preview;
