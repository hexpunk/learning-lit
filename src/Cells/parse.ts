import { COLUMNS } from "./constants";
import { Application, Coord, Empty, Number, Range, Textual, type Formula } from "./types";

function cell(input: string): Coord | void {
  if (/^[A-Za-z]\d+$/.test(input)) {
    const column = COLUMNS.indexOf(input.charAt(0).toLowerCase());
    const row = parseInt(input.slice(1), 10);
    return new Coord(row, column);
  }
}

function range(input: string): Range | void {
  if (/^[A-Za-z]\d+:[A-Za-z]\d+$/.test(input)) {
    const [start, end] = input.split(":");
    const startCoord = cell(start);
    const endCoord = cell(end);

    if (startCoord && endCoord) {
      return new Range(startCoord, endCoord);
    }
  }
}

function number(input: string): Number | void {
  if (/^-?\d+(\.\d*)?$/.test(input)) {
    return new Number(parseFloat(input));
  }
}

function splitArgs(argsString: string): string[] {
  const args = [];
  let depth = 0;
  let current = "";

  for (const char of argsString) {
    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      args.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
}

function application(input: string): Application | void {
  if (/^[A-Za-z]+\(.*\)$/.test(input)) {
    const func = input.slice(0, input.indexOf("("));
    const argsString = input.slice(input.indexOf("(") + 1, -1);
    const args = splitArgs(argsString).map((arg) => expression(arg)!);
    return new Application(func, args);
  }
}

function textual(input: string): Textual | void {
  if (input.length === 0) {
    return new Empty();
  }

  if (/[^=].*/.test(input)) {
    return new Textual(input);
  }
}

function expression(input: string): Application | Range | Coord | Number | void {
  return application(input) || range(input) || cell(input) || number(input);
}

export function parse(input: string): Formula {
  return (input.startsWith("=") && expression(input.slice(1))) || number(input) || textual(input)!;
}
