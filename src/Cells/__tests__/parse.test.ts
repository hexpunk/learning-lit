import { describe, expect, test } from "vitest";
import { parse } from "../parse";
import { Application, Coord, Number, Range, Textual } from "../types";

describe("parse", () => {
  test("parses empty string as Textual", () => {
    const result = parse("");
    expect(result).toBeInstanceOf(Textual);
  });

  test("parses a non-empty string as Textual", () => {
    const result = parse("Hello, world!");
    expect(result).toBeInstanceOf(Textual);
    expect((result as Textual).value).toBe("Hello, world!");
  });

  test("parses a coordinate string", () => {
    const result = parse("=A1");
    expect(result).toBeInstanceOf(Coord);
    expect((result as Coord).column).toBe(0);
    expect((result as Coord).row).toBe(1);
  });

  test("parses a range string", () => {
    const result = parse("=A1:B2");
    expect(result).toBeInstanceOf(Range);
    expect((result as Range).start.column).toBe(0);
    expect((result as Range).start.row).toBe(1);
    expect((result as Range).end.column).toBe(1);
    expect((result as Range).end.row).toBe(2);
  });

  test("parses a number string", () => {
    let result = parse("42");
    expect(result).toBeInstanceOf(Number);
    expect((result as Number).value).toBe(42);

    result = parse("-3.14");
    expect(result).toBeInstanceOf(Number);
    expect((result as Number).value).toBe(-3.14);
  });

  test("parses a function application string", () => {
    let result = parse("=SUM(A1, B2)");
    expect(result).toBeInstanceOf(Application);
    expect((result as Application).func).toBe("SUM");
    expect((result as Application).args.length).toBe(2);
    expect((result as Application).args[0]).toBeInstanceOf(Coord);
    expect((result as Application).args[1]).toBeInstanceOf(Coord);

    result = parse("=SUM(-50, A10)");
    expect(result).toBeInstanceOf(Application);
    expect((result as Application).func).toBe("SUM");
    expect((result as Application).args.length).toBe(2);
    expect((result as Application).args[0]).toBeInstanceOf(Number);
    expect((result as Application).args[1]).toBeInstanceOf(Coord);

    result = parse("=SUM(A1, SUM(B1, C1), D1)");
    expect(result).toBeInstanceOf(Application);
    expect((result as Application).func).toBe("SUM");
    expect((result as Application).args.length).toBe(3);
    expect((result as Application).args[0]).toBeInstanceOf(Coord);
    expect((result as Application).args[1]).toBeInstanceOf(Application);
    expect((result as Application).args[2]).toBeInstanceOf(Coord);

    result = parse("=NULL()");
    expect(result).toBeInstanceOf(Application);
    expect((result as Application).func).toBe("NULL");
    expect((result as Application).args.length).toBe(0);
  });
});
