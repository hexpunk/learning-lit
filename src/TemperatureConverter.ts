import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("temperature-converter")
export class TemperatureConverter extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    input {
      width: 80px;
    }
  `;

  @state() private celsius: string = "";
  @state() private fahrenheit: string = "";

  private handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (input.value === "") {
      this.celsius = "";
      this.fahrenheit = "";
    } else if (input.name === "celsius" && input.validity.valid) {
      this.celsius = value;
      this.fahrenheit = ((parseFloat(value) * 9) / 5 + 32).toString();
    } else if (input.name === "fahrenheit" && input.validity.valid) {
      this.fahrenheit = value;
      this.celsius = (((parseFloat(value) - 32) * 5) / 9).toString();
    }
  }

  render() {
    const parseFloatRegex =
      "/^[\t\n\r ]*[+-]?(?:Infinity|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/";

    return html`
      <input
        id="celsius"
        name="celsius"
        pattern=${parseFloatRegex}
        .value=${this.celsius}
        @input=${this.handleInput}
      />
      <label for="celsius">Celsius</label>
      <div>=</div>
      <input
        id="fahrenheit"
        name="fahrenheit"
        pattern=${parseFloatRegex}
        .value=${this.fahrenheit}
        @input=${this.handleInput}
      />
      <label for="fahrenheit">Fahrenheit</label>
    `;
  }
}
