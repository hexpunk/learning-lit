import { Application, Cell, Coord, Env, Formula, Number, Range, Textual } from "./types";

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
