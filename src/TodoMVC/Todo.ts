import { html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";

import "./Item";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

@customElement("todo-mvc")
export class Todo extends LitElement {
  @state() private nextId = 0;
  @state() private items: TodoItem[] = [];
  @state() private text = "";
  @state() private filter: Filter = "all";

  render() {
    return html`
      <h1>todos</h1>
      <div>
        <button
          @click=${() => {
            const allCompleted = this.items.every((item) => item.completed);
            this.items = this.items.map((item) => ({ ...item, completed: !allCompleted }));
          }}
        >
          v
        </button>
        <input
          placeholder="What needs to be done?"
          .value=${this.text}
          @input=${(e: Event) => (this.text = (e.target as HTMLInputElement).value)}
          @keypress=${(e: KeyboardEvent) => {
            if (e.key === "Enter" && this.text.trim() !== "") {
              this.items = [
                ...this.items,
                { id: this.nextId, text: this.text.trim(), completed: false },
              ];
              this.nextId++;
              this.text = "";
            }
          }}
        />
      </div>
      <div>
        ${map(
          this.items.filter((item) => {
            if (this.filter === "active") {
              return !item.completed;
            } else if (this.filter === "completed") {
              return item.completed;
            }
            return true;
          }),
          (item) =>
            html`<todo-item
              .checked=${item.completed}
              @change=${(e: CustomEvent) => {
                const checked = e.detail.checked;
                this.items = this.items.map((i) =>
                  i.id === item.id ? { ...i, completed: checked } : i,
                );
              }}
              @delete=${() => {
                this.items = this.items.filter((i) => i.id !== item.id);
              }}
            >
              ${item.text}
            </todo-item>`,
        )}
      </div>
      ${when(
        this.items.length === 0,
        () => nothing,
        () =>
          html`<div>
            <span>${this.items.length} item${this.items.length > 1 ? "s" : ""} left</span>
            <button @click=${() => (this.filter = "all")} .disabled=${this.filter === "all"}>
              All
            </button>
            <button @click=${() => (this.filter = "active")} .disabled=${this.filter === "active"}>
              Active
            </button>
            <button
              @click=${() => (this.filter = "completed")}
              .disabled=${this.filter === "completed"}
            >
              Completed
            </button>
            <button
              @click=${() => {
                this.items = this.items.filter((item) => !item.completed);
              }}
            >
              Clear completed
            </button>
          </div>`,
      )}
    `;
  }
}
