import type { Meta, StoryObj } from "@storybook/web-components";

import "../Counter";

const meta: Meta = {
  title: "7GUIs/Counter",
  component: "counter-element",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    count: 0,
  },
};
