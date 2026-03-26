import { css, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";

import "./Item";
import { classMap } from "lit/directives/class-map.js";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

@customElement("todo-mvc")
export class Todo extends LitElement {
  static styles = css`
    :host {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .todo-container {
      background-color: white;
      width: 50%;
      min-width: 400px;

      box-shadow:
        0 2px 4px 0 rgba(0, 0, 0, 0.2),
        0 25px 50px 0 rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      padding: 5px;
    }

    .header:focus-within {
      outline: #b83f45 solid 2px;
    }

    .header > input {
      border: none;
      outline: none;

      flex-grow: 1;
    }

    h1 {
      color: #b83f45;
      text-align: center;
    }

    .hidden {
      visibility: hidden;
    }

    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
    }

    button {
      border: none;
      background: none;
      border-radius: 5px;
    }

    button:hover {
      background-color: #ededed;
    }

    button:disabled {
      border: 1px solid #b83f45;
    }

    todo-item {
      padding-top: 5px;
      padding-bottom: 5px;
      padding-right: 5px;
      border-bottom: 1px solid #ededed;
    }
  `;

  @state() private nextId = 0;
  @state() private items: TodoItem[] = [];
  @state() private text = "";
  @state() private filter: Filter = "all";

  render() {
    return html`
      <h1>todos</h1>
      <div class="todo-container">
        <div class="header">
          <button
            class=${classMap({ hidden: this.items.length === 0 })}
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
            html`<footer>
              <div>${this.items.length} item${this.items.length > 1 ? "s" : ""} left!</div>
              <div>
                <button @click=${() => (this.filter = "all")} .disabled=${this.filter === "all"}>
                  All
                </button>
                <button
                  @click=${() => (this.filter = "active")}
                  .disabled=${this.filter === "active"}
                >
                  Active
                </button>
                <button
                  @click=${() => (this.filter = "completed")}
                  .disabled=${this.filter === "completed"}
                >
                  Completed
                </button>
              </div>
              <button
                @click=${() => {
                  this.items = this.items.filter((item) => !item.completed);
                }}
              >
                Clear completed
              </button>
            </footer>`,
        )}
      </div>
    `;
  }
}
