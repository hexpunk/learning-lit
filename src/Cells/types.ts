import { COLUMNS } from "./constants";

export abstract class Formula {
  abstract toString(): string;
}

export class Env {
  private store = new Map<number, Cell>();

  constructor(
    private numColumns: number,
    private numRows: number,
  ) {
    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        this.store.set(this.coordToKey(col, row), new Cell(col, row));
      }
    }
  }

  private coordToKey(col: number, row: number): number {
    return row * this.numColumns + col;
  }

  get(col: number, row: number): Cell {
    return this.store.get(this.coordToKey(col, row)) as Cell;
  }

  set(col: number, row: number, cell: Cell) {
    this.store.set(this.coordToKey(col, row), cell);
  }
}

export class Coord extends Formula {
  constructor(
    public readonly row: number,
    public readonly column: number,
  ) {
    super();
  }

  toString() {
    return `${COLUMNS[this.column]}${this.row}`;
  }
}

export class Range extends Formula {
  constructor(
    public readonly start: Coord,
    public readonly end: Coord,
  ) {
    super();
  }

  toString() {
    return `${this.start.toString()}:${this.end.toString()}`;
  }
}

export class Number extends Formula {
  constructor(public readonly value: number) {
    super();
  }

  toString() {
    return this.value.toString();
  }
}

export class Textual extends Formula {
  constructor(public readonly value: string) {
    super();
  }

  toString() {
    return this.value;
  }
}

export class Application extends Formula {
  constructor(
    public readonly func: string,
    public readonly args: Formula[],
  ) {
    super();
  }

  toString() {
    return `${this.func}(${this.args.map((arg) => arg.toString()).join(",")})`;
  }
}

export class Empty extends Textual {
  constructor() {
    super("");
  }
}

export class Cell {
  constructor(
    public readonly column: number,
    public readonly row: number,
    public formula: Formula = new Empty(),
  ) {}

  toString() {
    return this.formula.toString();
  }
}
