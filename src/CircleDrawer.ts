import { css, html, svg, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { createRef, ref } from "lit/directives/ref.js";

interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
}

interface Action {
  type: "add" | "edit";
  circle: Circle;
}

@customElement("circle-drawer")
export class CircleDrawer extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 400px;
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .row {
      display: flex;
      flex-direction: row;
      gap: 8px;
      justify-content: center;
    }

    svg {
      border: 1px solid black;
      height: 400px;
      width: 400px;
    }

    circle:hover,
    circle.selected {
      fill: #eee;
    }

    dialog > .column {
      align-items: flex-end;
    }

    dialog::backdrop {
      background-color: transparent;
    }

    input[type="range"] {
      width: 100%;
    }
  `;

  @state() private nextId = 1;
  @state() private selectedCircleId: string | null = null;
  @state() private circles: Circle[] = [{ id: "0", x: 50, y: 50, radius: 20 }];
  @state() private undoStack: Action[] = [];
  @state() private redoStack: Action[] = [];

  @state() private dialogRef = createRef<HTMLDialogElement>();

  handleUndo() {
    const lastAction = this.undoStack.pop()!;
    if (lastAction.type === "add") {
      this.circles = this.circles.filter((circle) => circle.id !== lastAction.circle.id);
      this.redoStack = [...this.redoStack, lastAction];
    } else if (lastAction.type === "edit") {
      const oldCircle = this.circles.find((circle) => circle.id === lastAction.circle.id)!;
      this.circles = this.circles.map((circle) =>
        circle.id === lastAction.circle.id ? lastAction.circle : circle,
      );
      this.redoStack = [...this.redoStack, { type: "edit", circle: oldCircle }];
    }
  }

  handleRedo() {
    const lastUndoneAction = this.redoStack.pop()!;
    if (lastUndoneAction.type === "add") {
      this.circles = [...this.circles, lastUndoneAction.circle];
      this.undoStack = [...this.undoStack, lastUndoneAction];
    } else if (lastUndoneAction.type === "edit") {
      const oldCircle = this.circles.find((circle) => circle.id === lastUndoneAction.circle.id)!;
      this.circles = this.circles.map((circle) =>
        circle.id === lastUndoneAction.circle.id ? lastUndoneAction.circle : circle,
      );
      this.undoStack = [...this.undoStack, { type: "edit", circle: oldCircle }];
    }
  }

  addCircle(event: MouseEvent) {
    const newCircle: Circle = {
      id: String(this.nextId++),
      x: event.offsetX,
      y: event.offsetY,
      radius: 20,
    };
    this.circles = [...this.circles, newCircle];
    this.undoStack = [...this.undoStack, { type: "add", circle: newCircle }];
    this.redoStack = [];
  }

  editCircle(event: MouseEvent) {
    event.stopPropagation();

    const target = event.target as SVGCircleElement;
    const circleId = target.getAttribute("data-id");
    if (circleId) {
      this.selectedCircleId = circleId;
    }

    this.dialogRef.value?.showModal();
  }

  editRadius(event: Event) {
    const input = event.target as HTMLInputElement;
    const newRadius = Number(input.value);
    const oldCircle = this.circles.find((circle) => circle.id === this.selectedCircleId)!;

    this.circles = this.circles.map((circle) =>
      circle.id === this.selectedCircleId ? { ...circle, radius: newRadius } : circle,
    );

    this.undoStack = [
      ...this.undoStack,
      {
        type: "edit",
        circle: oldCircle,
      },
    ];
    this.redoStack = [];
  }

  closeDialog() {
    this.selectedCircleId = null;
    this.dialogRef.value?.close();
  }

  render() {
    const selectedCircle = this.circles.find((circle) => circle.id === this.selectedCircleId);

    return html`
      <dialog ${ref(this.dialogRef)}>
        <div class="column">
          <button @click=${this.closeDialog}>x</button>
          <p>Adjust diameter of circle at (${selectedCircle?.x}, ${selectedCircle?.y}).</p>
          <input
            type="range"
            min="10"
            max="100"
            .value=${String(selectedCircle?.radius)}
            @change=${this.editRadius}
          />
        </div>
      </dialog>
      <div class="column">
        <div class="row">
          <button .disabled=${this.undoStack.length === 0} @click=${this.handleUndo}>Undo</button>
          <button .disabled=${this.redoStack.length === 0} @click=${this.handleRedo}>Redo</button>
        </div>
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" @click=${this.addCircle}>
          ${map(
            this.circles,
            (circle) => svg`
            <circle
              class=${circle.id === this.selectedCircleId ? "selected" : ""}
              @click=${this.editCircle}
              data-id="${circle.id}"
              cx="${circle.x}"
              cy="${circle.y}"
              r="${circle.radius}"
              stroke="black"
              fill="transparent"
            ></circle>
          `,
          )}
        </svg>
      </div>
    `;
  }
}
