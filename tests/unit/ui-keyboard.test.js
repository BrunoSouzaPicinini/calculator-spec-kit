import { mapKeyToAction } from "../../calculator-site/ui.js";

describe("keyboard mapping", () => {
  test("maps digit keys to number action", () => {
    expect(mapKeyToAction("5")).toEqual({ action: "number", value: "5" });
  });

  test("maps decimal keys to decimal action", () => {
    expect(mapKeyToAction(".")).toEqual({ action: "decimal" });
    expect(mapKeyToAction("Decimal")).toEqual({ action: "decimal" });
  });

  test("maps arithmetic operator keys", () => {
    expect(mapKeyToAction("+")).toEqual({ action: "operator", value: "+" });
    expect(mapKeyToAction("-")).toEqual({ action: "operator", value: "-" });
    expect(mapKeyToAction("*")).toEqual({ action: "operator", value: "×" });
    expect(mapKeyToAction("x")).toEqual({ action: "operator", value: "×" });
    expect(mapKeyToAction("/")).toEqual({ action: "operator", value: "÷" });
  });

  test("maps equals and enter keys", () => {
    expect(mapKeyToAction("=")).toEqual({ action: "equals" });
    expect(mapKeyToAction("Enter")).toEqual({ action: "equals" });
  });

  test("maps escape and delete keys to clear actions", () => {
    expect(mapKeyToAction("Escape")).toEqual({ action: "clear" });
    expect(mapKeyToAction("Esc")).toEqual({ action: "clear" });
    expect(mapKeyToAction("Delete")).toEqual({ action: "clearAll" });
  });

  test("ignores unrelated or modified key presses", () => {
    expect(mapKeyToAction("a")).toBeNull();
    expect(mapKeyToAction("5", { metaKey: true })).toBeNull();
    expect(mapKeyToAction("5", { ctrlKey: true })).toBeNull();
    expect(mapKeyToAction("5", { altKey: true })).toBeNull();
  });
});
