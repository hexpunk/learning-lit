import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import { COLUMNS, ROWS } from "./constants";
import { Cell, Env } from "./types";
import { parse } from "./parse";

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

  render() {
    return html`
      <div class="cells-root">
        <div class="corner"></div>
        ${map(range(COLUMNS.length), (col) => html`<div class="col-header">${COLUMNS[col].toUpperCase()}</div>`)}
        ${map(
          range(ROWS.length),
          (row) => html`
            <div class="row-header">${row}</div>
            ${map(
              range(COLUMNS.length),
              (col) =>
                html` <input
                  class="cell"
                  type="text"
                  .value=${this.data.get(col, row).toString()}
                  @input=${(e: Event) => {
                    this.data.set(col, row, new Cell(col, row, parse((e.target as HTMLInputElement).value)));
                    this.requestUpdate();
                  }}
                />`,
            )}
          `,
        )}
      </div>
    `;
  }
}
