import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import { COLUMNS, ROWS } from "./constants";
import { Number, Textual } from "./types";
import { Env } from "./evaluate";

@customElement("cells-element")
export class CellsElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      overflow: auto;
      max-height: 300px;
      max-width: 800px;

      font-family: sans-serif;
    }

    .cells-root {
      display: grid;
      grid-template-columns: 2em repeat(26, 7em);
      grid-template-rows: repeat(101, 1.5em);
      width: max-content;
    }

    .corner {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 3;
      background-color: #eee;
      border: 1px solid #ccc;
      border-top-left-radius: 6px;
      box-shadow: -10px -10px 0 0 white;
    }

    .col-header {
      position: sticky;
      top: 0;
      z-index: 2;
      text-align: center;
      padding-top: 2px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      background-color: #eee;
    }

    .row-header {
      position: sticky;
      left: 0;
      z-index: 1;
      background: white;
      text-align: right;
      padding-right: 4px;
      padding-top: 2px;
      border-right: 1px solid #ccc;
      border-left: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      background-color: #eee;
    }

    .cell {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: none;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      text-align: right;
    }

    .cell:focus {
      outline-offset: -1px;
      outline: 1px solid #0078d4;
    }
  `;

  @state() private data = new Env(COLUMNS.length, ROWS.length);
  @state() private focusedCellId: string | null = null;
  @state() private focusedCellValue: string = "";

  render() {
    return html`
      <div class="cells-root">
        <div class="corner"></div>
        ${map(range(COLUMNS.length), (col) => html`<div class="col-header">${COLUMNS[col].toUpperCase()}</div>`)}
        ${map(
          range(ROWS.length),
          (row) => html`
            <div class="row-header">${row}</div>
            ${map(range(COLUMNS.length), (col) => {
              const cell = this.data.get(col, row);
              const isLiteral = cell.formula instanceof Textual || cell.formula instanceof Number;
              const dataId = `${col}-${row}`;
              const isFocused = this.focusedCellId === dataId;
              let value = isFocused ? this.focusedCellValue : isLiteral ? cell.toString() : cell.value;

              return html` <input
                class="cell"
                type="text"
                data-id="${dataId}"
                .value=${value}
                @input=${(e: Event) => {
                  this.focusedCellValue = (e.target as HTMLInputElement).value;
                }}
                @focus=${(e: Event) => {
                  this.focusedCellId = (e.target as HTMLInputElement).dataset.id || null;
                  this.focusedCellValue = isLiteral ? cell.toString() : "=" + cell.formula.toString();
                }}
                @blur=${(e: Event) => {
                  if (this.focusedCellId === (e.target as HTMLInputElement).dataset.id) {
                    this.data.set(col, row, this.focusedCellValue);
                    this.focusedCellId = null;
                    this.focusedCellValue = "";
                  }
                }}
              />`;
            })}
          `,
        )}
      </div>
    `;
  }
}
