import { parse } from "./parse";
import { Application, Empty, Coord, Formula, Number, Range, Textual } from "./types";

const OPERATIONS: Record<string, ([a, b]: number[]) => number> = {
  add: ([a, b]: number[]) => a + b,
  sub: ([a, b]: number[]) => a - b,
  mul: ([a, b]: number[]) => a * b,
  div: ([a, b]: number[]) => a / b,
  sum: (args: number[]) => args.reduce((a, b) => a + b, 0),
  prod: (args: number[]) => args.reduce((a, b) => a * b, 1),
};

function references(formula: Formula, env: Env): Cell[] {
  if (formula instanceof Coord) {
    const cell = env.get(formula.column, formula.row);
    return cell ? [cell] : [];
  } else if (formula instanceof Range) {
    const cells: Cell[] = [];
    for (let col = formula.start.column; col <= formula.end.column; col++) {
      for (let row = formula.start.row; row <= formula.end.row; row++) {
        const cell = env.get(col, row);
        if (cell) {
          cells.push(cell);
        }
      }
    }
    return cells;
  } else if (formula instanceof Application) {
    return formula.args.flatMap((arg) => references(arg, env));
  }

  return [];
}

function evalArray(formula: Formula, env: Env): number[] {
  if (formula instanceof Range) {
    return references(formula, env).map((cell) => evaluate(cell.formula, env));
  }

  return [evaluate(formula, env)];
}

export function evaluate(forumla: Formula, env: Env): number {
  if (forumla instanceof Coord) {
    const cell = env.get(forumla.column, forumla.row);
    if (!cell) {
      throw new Error(`Cell not found at ${forumla.column}, ${forumla.row}`);
    }

    return evaluate(cell.formula, env);
  } else if (forumla instanceof Number) {
    return forumla.value;
  } else if (forumla instanceof Textual) {
    return 0;
  } else if (forumla instanceof Application) {
    const op = OPERATIONS[forumla.func.toLowerCase()];
    if (!op) {
      throw new Error(`Unknown function: ${forumla.func}`);
    }
    const argValues = forumla.args.map((arg) => evalArray(arg, env)).flat();
    return op(argValues);
  }

  debugger;
  throw new Error("Unknown formula type");
}

export class Cell {
  private v: number | undefined;
  private f: Formula;

  constructor(
    private readonly env: Env,
    public readonly column: number,
    public readonly row: number,
    formula: Formula = new Empty(),
  ) {
    this.f = formula;

    env.addEventListener("cell-updated", (e: Event) => {
      const { column, row } = (e as CustomEvent).detail;
      if (references(this.f, env).some((cell) => cell.column === column && cell.row === row)) {
        this.recompute();
      }
    });
  }

  get value(): string {
    if (this.f instanceof Textual) {
      return this.f.value;
    }

    if (this.v === undefined) {
      this.recompute();
    }

    return this.v?.toString() ?? "";
  }

  set formula(f: Formula) {
    this.f = f;
    this.recompute();
  }

  get formula(): Formula {
    return this.f;
  }

  recompute() {
    this.v = evaluate(this.f, this.env);
    this.env.dispatchEvent(
      new CustomEvent("cell-updated", { detail: { column: this.column, row: this.row } }),
    );
  }

  toString() {
    return this.f.toString();
  }
}

export class Env extends EventTarget {
  private store = new Map<number, Cell>();

  constructor(
    private numColumns: number,
    private numRows: number,
  ) {
    super();

    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        this.store.set(this.coordToKey(col, row), new Cell(this, col, row));
      }
    }
  }

  private coordToKey(col: number, row: number): number {
    return row * this.numColumns + col;
  }

  get(col: number, row: number): Cell {
    return this.store.get(this.coordToKey(col, row)) as Cell;
  }

  set(col: number, row: number, input: string) {
    const cell = this.store.get(this.coordToKey(col, row)) as Cell;
    cell.formula = parse(input);

    this.dispatchEvent(new CustomEvent("cell-updated", { detail: { column: col, row } }));
  }
}
