import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { action } from "storybook/actions";

import "../TodoMVC/Item";

const meta: Meta = {
  title: "TodoMVC/Item",
  component: "todo-item",
  tags: ["autodocs"],
  argTypes: {
    slotContent: {
      name: "Slot Content",
      control: "text",
      description: "Content to place in the default slot",
    },
    onChange: { action: "change" },
    onDelete: { action: "delete" },
  },
  render: ({ checked, onChange, onDelete, slotContent }) =>
    html`<todo-item .checked=${checked} @change=${onChange} @delete=${onDelete}>
      ${slotContent}
    </todo-item>`,
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    checked: false,
    slotContent: "This is a todo item",
    onChange: (e: CustomEvent) => {
      action("change")(e.detail);
    },
    onDelete: (e: CustomEvent) => {
      action("delete")({});
    },
  },
};
