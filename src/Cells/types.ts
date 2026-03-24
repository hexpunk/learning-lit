import { COLUMNS } from "./constants";

export abstract class Formula {
  abstract toString(): string;
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
