import type { Meta, StoryObj } from "@storybook/web-components";

import "../TodoMVC/Todo";

const meta: Meta = {
  title: "TodoMVC/Todo",
  component: "todo-mvc",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
