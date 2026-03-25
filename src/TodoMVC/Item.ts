import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("todo-item")
export class Item extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .label.checked {
      text-decoration: line-through;
    }

    .label {
      flex-grow: 1;
      margin-left: 8px;
      margin-right: 8px;
    }
  `;

  @property({ type: Boolean }) checked = false;

  private handleChange(event: Event) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: (event.target as HTMLInputElement).checked },
      }),
    );
  }

  private handleDelete() {
    this.dispatchEvent(new CustomEvent("delete"));
  }

  render() {
    return html`
      <input type="checkbox" .checked=${this.checked} @change=${this.handleChange} />
      <div class=${classMap({ label: true, checked: this.checked })}><slot></slot></div>
      <button @click=${this.handleDelete}>x</button>
    `;
  }
}
