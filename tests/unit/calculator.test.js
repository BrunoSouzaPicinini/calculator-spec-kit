import {
  initialState,
  inputNumber,
  inputOperator,
  calculate,
  clear,
  clearAll,
  inputDecimal,
} from "../../calculator-site/calculator.js";

function baseState(overrides = {}) {
  return { ...initialState, ...overrides };
}

describe("calculator state machine - basic arithmetic", () => {
  test("inputNumber replaces initial zero", () => {
    const state = baseState();
    const next = inputNumber(state, "5");
    expect(next.displayValue).toBe("5");
    expect(next.waitingForOperand).toBe(false);
  });

  test("inputNumber appends when already typing", () => {
    const state = baseState({ displayValue: "5" });
    const next = inputNumber(state, "3");
    expect(next.displayValue).toBe("53");
  });

  test("inputDecimal appends decimal when absent", () => {
    const state = baseState({ displayValue: "3" });
    const next = inputDecimal(state);
    expect(next.displayValue).toBe("3.");
    expect(next.waitingForOperand).toBe(false);
  });

  test("inputDecimal ignores duplicate decimal", () => {
    const state = baseState({ displayValue: "3.1" });
    const next = inputDecimal(state);
    expect(next.displayValue).toBe("3.1");
  });

  test("inputDecimal starts with 0. after error state", () => {
    const state = baseState({ displayValue: "Error", isError: true });
    const next = inputDecimal(state);
    expect(next.displayValue).toBe("0.");
    expect(next.isError).toBe(false);
  });

  test("inputDecimal starts with 0. after calculation complete", () => {
    const state = baseState({ displayValue: "42", calculationComplete: true });
    const next = inputDecimal(state);
    expect(next.displayValue).toBe("0.");
    expect(next.calculationComplete).toBe(false);
  });

  test("calculate handles unsupported operator gracefully", () => {
    const state = baseState({
      previousOperand: 5,
      operator: "%",
      displayValue: "2",
    });
    const result = calculate(state);
    expect(result).toEqual(state);
  });

  test("formatResult handles NaN by returning Error", () => {
    const state = baseState({
      previousOperand: 0,
      operator: "÷",
      displayValue: "0",
    });
    const result = calculate(state);
    expect(result.displayValue).toBe("Error");
    expect(result.isError).toBe(true);
  });

  test("inputDecimal starts with 0. when waiting for operand", () => {
    const state = baseState({
      displayValue: "5",
      previousOperand: 5,
      operator: "+",
      waitingForOperand: true,
    });
    const next = inputDecimal(state);
    expect(next.displayValue).toBe("0.");
    expect(next.waitingForOperand).toBe(false);
  });

  test("inputOperator returns state unchanged when in error state", () => {
    const state = baseState({ displayValue: "Error", isError: true });
    const next = inputOperator(state, "+");
    expect(next).toEqual(state);
  });

  test("calculate handles alternate multiplication syntax (*)", () => {
    const state = baseState({
      previousOperand: 4,
      operator: "*",
      displayValue: "3",
    });
    const result = calculate(state);
    expect(result.displayValue).toBe("12");
  });

  test("calculate handles alternate division syntax (/)", () => {
    const state = baseState({
      previousOperand: 15,
      operator: "/",
      displayValue: "3",
    });
    const result = calculate(state);
    expect(result.displayValue).toBe("5");
  });

  test("calculate handles division by zero with / operator", () => {
    const state = baseState({
      previousOperand: 10,
      operator: "/",
      displayValue: "0",
    });
    const result = calculate(state);
    expect(result.displayValue).toBe("Error");
    expect(result.isError).toBe(true);
  });

  test("formatResult uses exponential notation for very large numbers", () => {
    const state = baseState({
      previousOperand: 123456789012,
      operator: "×",
      displayValue: "123456789012",
    });
    const result = calculate(state);
    expect(result.displayValue).toContain("e+");
  });

  test("calculate rounds decimal results to 10 places", () => {
    const state = baseState({
      previousOperand: 0.1,
      operator: "+",
      displayValue: "0.2",
    });
    const result = calculate(state);
    expect(result.displayValue).toBe("0.3");
  });
  test("inputNumber starts new entry after operator selection", () => {
    const state = baseState({ displayValue: "7", waitingForOperand: true });
    const next = inputNumber(state, "2");
    expect(next.displayValue).toBe("2");
    expect(next.waitingForOperand).toBe(false);
  });

  test("calculate adds two operands", () => {
    const state = baseState({
      previousOperand: 5,
      operator: "+",
      displayValue: "3",
    });
    const result = calculate(state);
    expect(result.displayValue).toBe("8");
    expect(result.calculationComplete).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.operator).toBeNull();
  });

  test("calculate handles division by zero with error state", () => {
    const state = baseState({
      previousOperand: 5,
      operator: "÷",
      displayValue: "0",
    });
    const result = calculate(state);
    expect(result.displayValue).toBe("Error");
    expect(result.isError).toBe(true);
    expect(result.calculationComplete).toBe(false);
  });

  test("inputOperator performs chained calculation before setting new operator", () => {
    const state = baseState({
      previousOperand: 5,
      operator: "+",
      displayValue: "3",
      waitingForOperand: false,
    });
    const next = inputOperator(state, "-");
    expect(next.displayValue).toBe("8");
    expect(next.previousOperand).toBe(8);
    expect(next.operator).toBe("-");
    expect(next.waitingForOperand).toBe(true);
    expect(next.calculationComplete).toBe(false);
  });

  test("clear resets current entry but preserves pending operator context", () => {
    const state = baseState({
      previousOperand: 9,
      operator: "×",
      displayValue: "12",
    });
    const next = clear(state);
    expect(next.displayValue).toBe("0");
    expect(next.previousOperand).toBe(9);
    expect(next.operator).toBe("×");
    expect(next.isError).toBe(false);
  });

  test("clear keeps waitingForOperand flag when awaiting second operand", () => {
    const state = baseState({
      previousOperand: 5,
      operator: "+",
      displayValue: "0",
      waitingForOperand: true,
    });
    const next = clear(state);
    expect(next.displayValue).toBe("0");
    expect(next.waitingForOperand).toBe(true);
    expect(next.operator).toBe("+");
  });

  test("clearAll resets entire state to initial", () => {
    // clearAll() ignores current state and always returns initialState
    const next = clearAll();
    expect(next).toEqual(initialState);
  });
});
