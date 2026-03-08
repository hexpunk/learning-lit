import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("flight-booker")
export class FlightBooker extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 200px;
    }

    input:invalid {
      background-color: red;
    }

    dialog > div {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
    }
  `;

  /** The type of flight: "1" for one-way, "2" for round-trip */
  @state() private flightType: "1" | "2" = "1";
  @state() private date1: string = "";
  @state() private date2: string = "";

  handleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.flightType = select.value as "1" | "2";

    if (this.flightType === "1") {
      this.date2 = this.date1;
    }
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.name === "date1") {
      this.date1 = input.value;

      if (this.flightType === "1") {
        this.date2 = input.value;
      }
    } else if (input.name === "date2") {
      this.date2 = input.value;
    }
  }

  render() {
    const regex = /\d{2}\.\d{2}\.\d{4}/;
    const bookDisabled =
      this.date1 === "" ||
      this.date2 === "" ||
      !regex.test(this.date1) ||
      !regex.test(this.date2);
    const resultMessage =
      this.flightType === "1"
        ? `You have booked a one-way flight on ${this.date1}`
        : `You have booked a round-trip flight that departs on ${this.date1} and returns on ${this.date2}`;

    return html`
      <select name="flight-type" @change=${this.handleChange}>
        <option value="1" ?selected=${this.flightType === "1"}>
          one-way flight
        </option>
        <option value="2" ?selected=${this.flightType === "2"}>
          return flight
        </option>
      </select>
      <input
        name="date1"
        pattern=${regex.source}
        .value=${this.date1}
        @input=${this.handleInput}
      />
      <input
        name="date2"
        pattern=${regex.source}
        .disabled=${this.flightType === "1"}
        .value=${this.date2}
        @input=${this.handleInput}
      />
      <button
        command="show-modal"
        commandfor="result"
        .disabled=${bookDisabled}
      >
        Book
      </button>
      <dialog id="result">
        <div>
          <p>${resultMessage}</p>
          <button command="close" commandfor="result">OK</button>
        </div>
      </dialog>
    `;
  }
}
