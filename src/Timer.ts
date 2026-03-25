import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { cache } from "lit/directives/cache.js";

@customElement("timer-element")
export default class Timer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;

      width: 300px;
    }

    div {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    progress,
    input[type="range"] {
      flex-grow: 1;
    }
  `;

  @state() private start = Date.now();
  @state() private duration = "15";

  connectedCallback(): void {
    super.connectedCallback();
    setInterval(() => this.requestUpdate(), 100);
  }

  render() {
    const elapsed = Math.min(Number(this.duration), (Date.now() - this.start) / 1000);

    return cache(html`
      <div>
        <label>Elapsed Time:</label>
        <progress max="30" .value=${elapsed}></progress>
      </div>
      <div>${elapsed.toFixed(1)}s</div>
      <div>
        <label>Duration:</label>
        <input
          type="range"
          min="0"
          max="30"
          .value=${this.duration}
          @input=${(e: Event) => (this.duration = (e.target as HTMLInputElement).value)}
        />
      </div>
      <button @click=${() => (this.start = Date.now())}>Reset</button>
    `);
  }
}
