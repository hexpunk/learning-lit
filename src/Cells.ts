import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

const COLUMNS = "abcdefghijklmnopqrstuvwxyz".split("");
const ROWS = Array.from({ length: 100 }, (_, i) => i);

@customElement("cells-element")
export class Cells extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-height: 400px;
      max-width: 600px;
      overflow: scroll;
    }

    table {
      border-collapse: collapse;
    }

    thead > tr > th {
      background: linear-gradient(#eee, #888);
    }

    thead > tr > :first-child {
      background: white;
    }

    thead th {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    tbody th {
      position: sticky;
      left: 0;
      z-index: 1;
    }

    td,
    th {
      padding: 0;
    }

    input[type="text"] {
      border: 0px;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      width: 7em;
      height: 100%;
      margin: 0;
      padding: 0;
      vertical-align: top;
      line-height: 1;
      font-family: inherit;
      font-size: inherit;
    }

    input[type="text"]:focus {
      outline: 1px solid cornflowerblue;
      outline-offset: -1px;
    }
  `;

  @state() private data = new Map<string, string>(
    COLUMNS.flatMap((column) => ROWS.map((row) => [`${column}${row}`, ""])),
  );

  handleInput(event: InputEvent) {
    const target = event.target as HTMLElement;
    const id = target.id;
    this.data.set(id, target.textContent || "");
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            <th></th>
            ${map(COLUMNS, (column) => html`<th>${column.toUpperCase()}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${map(
            ROWS,
            (row) => html`
              <tr>
                <th>${row}</th>
                ${map(COLUMNS, (column) => {
                  const cellId = `${column}${row}`;
                  return html`
                    <td>
                      <input
                        type="text"
                        id=${cellId}
                        value=${this.data.get(cellId)!}
                        @input=${this.handleInput}
                      />
                    </td>
                  `;
                })}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}
