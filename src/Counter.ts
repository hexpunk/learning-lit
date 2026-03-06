import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("counter-element")
export class Counter extends LitElement {
  static styles = css`
    :host {
      display: flex;
    }

    div {
      margin: 0.5em;
    }

    .count {
      min-width: 2em;
    }
  `;

  @property({ type: Number }) count = 0;

  render() {
    return html`
      <div class="count">${this.count}</div>
      <div>
        <button @click=${() => this.count++}>Count</button>
      </div>
    `;
  }
}
