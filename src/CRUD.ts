import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

@customElement("crud-element")
export class CRUD extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;

      max-width: 400px;
    }

    .rows {
      display: flex;
      flex-direction: row;
      gap: 8px;
    }

    .columns {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    select {
      flex-grow: 1;
    }
  `;

  @state() private items: Array<{
    id: number;
    firstName: string;
    lastName: string;
  }> = [
    { id: 0, firstName: "Hans", lastName: "Emil" },
    { id: 1, firstName: "Max", lastName: "Mustermann" },
    { id: 2, firstName: "Roman", lastName: "Tisch" },
  ];

  @state() private nextId = 3;
  @state() private filterPrefix = "";
  @state() private selectedId: number | null = null;
  @state() private firstName = "";
  @state() private lastName = "";

  handleSelectedItemChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedId = Number(select.value);
    const selectedItem = this.items.find((item) => item.id === this.selectedId);
    if (selectedItem) {
      this.firstName = selectedItem.firstName;
      this.lastName = selectedItem.lastName;
    }
  }

  handleCreate() {
    this.items = [
      ...this.items,
      { id: this.nextId, firstName: "", lastName: "" },
    ];
    this.nextId++;
  }

  handleUpdate() {
    if (this.selectedId !== null) {
      this.items = this.items.map((item) =>
        item.id === this.selectedId
          ? { ...item, firstName: this.firstName, lastName: this.lastName }
          : item,
      );
    }
  }

  handleDelete() {
    if (this.selectedId !== null) {
      this.items = this.items.filter((item) => item.id !== this.selectedId);
      this.selectedId = null;
    }
  }

  render() {
    return html`
      <div class="columns">
        <div class="rows">
          <label for="filterPrefix">Filter prefix:</label>
          <input
            id="filterPrefix"
            type="text"
            .value=${this.filterPrefix}
            @input=${(e: Event) =>
              (this.filterPrefix = (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="rows">
          <select size="4" @change=${this.handleSelectedItemChange}>
            ${map(
              this.filterPrefix
                ? this.items.filter((item) =>
                    item.lastName.startsWith(this.filterPrefix),
                  )
                : this.items,
              (item) =>
                html`<option
                  value=${item.id}
                  .selected=${item.id === this.selectedId}
                >
                  ${item.lastName}, ${item.firstName}
                </option>`,
            )}
          </select>
          <div class="columns" style="align-items: flex-end">
            <div class="rows">
              <label for="firstName">Name:</label>
              <input
                id="firstName"
                type="text"
                .value=${this.firstName}
                @input=${(e: Event) =>
                  (this.firstName = (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="rows">
              <label for="lastName">Surname:</label>
              <input
                id="lastName"
                type="text"
                .value=${this.lastName}
                @input=${(e: Event) =>
                  (this.lastName = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="rows">
        <button @click=${this.handleCreate}>Create</button>
        <button @click=${this.handleUpdate}>Update</button>
        <button @click=${this.handleDelete}>Delete</button>
      </div>
    `;
  }
}
