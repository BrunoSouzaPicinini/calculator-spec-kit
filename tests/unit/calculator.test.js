import {
  initialState,
  inputNumber,
  inputOperator,
  calculate,
  clear,
  clearAll,
  inputDecimal,
  exponentiate,
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

  test("formatResult handles very small decimals with scientific notation", () => {
    const state = baseState({
      previousOperand: 0.1,
      operator: "^",
      displayValue: "10",
    });
    const result = calculate(state);
    // 0.1^10 = 1e-10, should use scientific notation
    expect(result.displayValue).toContain("e-");
  });

  test("calculate handles square root (2^0.5) with proper decimal precision", () => {
    const state = baseState({
      previousOperand: 2,
      operator: "^",
      displayValue: "0.5",
    });
    const result = calculate(state);
    const value = parseFloat(result.displayValue);
    expect(value).toBeCloseTo(1.41421356, 5);
  });

  test("calculate handles cube root (8^(1/3)) with proper decimal precision", () => {
    const state = baseState({
      previousOperand: 8,
      operator: "^",
      displayValue: String(1 / 3),
    });
    const result = calculate(state);
    const value = parseFloat(result.displayValue);
    expect(value).toBeCloseTo(2, 5);
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

describe("exponentiate function - basic operations", () => {
  test("should calculate 2^3 = 8", () => {
    expect(exponentiate(2, 3)).toBe(8);
  });

  test("should calculate 10^2 = 100", () => {
    expect(exponentiate(10, 2)).toBe(100);
  });

  test("should calculate 5^1 = 5", () => {
    expect(exponentiate(5, 1)).toBe(5);
  });

  test("should calculate 5^0 = 1", () => {
    expect(exponentiate(5, 0)).toBe(1);
  });
});

describe("exponentiate function - negative exponents", () => {
  test("should calculate 2^-1 = 0.5", () => {
    expect(exponentiate(2, -1)).toBe(0.5);
  });

  test("should calculate 2^-2 = 0.25", () => {
    expect(exponentiate(2, -2)).toBe(0.25);
  });

  test("should calculate 10^-2 = 0.01", () => {
    expect(exponentiate(10, -2)).toBe(0.01);
  });
});

describe("exponentiate function - zero base", () => {
  test("should return 0 for 0^5", () => {
    expect(exponentiate(0, 5)).toBe(0);
  });

  test("should return 1 for 0^0 (JavaScript convention)", () => {
    expect(exponentiate(0, 0)).toBe(1);
  });

  test("should return Infinity for 0^-1", () => {
    expect(exponentiate(0, -1)).toBe(Infinity);
  });
});

describe("exponentiate function - decimal exponents", () => {
  test("should calculate 2^0.5 ≈ 1.41421356 (square root)", () => {
    expect(exponentiate(2, 0.5)).toBeCloseTo(1.41421356, 5);
  });

  test("should calculate 8^(1/3) ≈ 2 (cube root)", () => {
    expect(exponentiate(8, 1 / 3)).toBeCloseTo(2, 5);
  });

  test("should calculate 10^0.5 ≈ 3.16227766", () => {
    expect(exponentiate(10, 0.5)).toBeCloseTo(3.16227766, 5);
  });

  test("should calculate 2.5^2 = 6.25", () => {
    expect(exponentiate(2.5, 2)).toBeCloseTo(6.25, 5);
  });

  test("should calculate 4^0.5 = 2", () => {
    expect(exponentiate(4, 0.5)).toBe(2);
  });

  test("should handle very small decimal result 0.1^10 ≈ 1e-10", () => {
    const result = exponentiate(0.1, 10);
    expect(result).toBeCloseTo(1e-10, 12);
  });

  test("should handle decimal base and exponent 2.5^1.5 ≈ 3.95", () => {
    expect(exponentiate(2.5, 1.5)).toBeCloseTo(3.95, 2);
  });
});

describe("exponentiate function - edge cases", () => {
  test("should return Infinity for overflow (999^999)", () => {
    expect(exponentiate(999, 999)).toBe(Infinity);
  });

  test("should return NaN for negative base with non-integer exponent (-2^0.5)", () => {
    expect(isNaN(exponentiate(-2, 0.5))).toBe(true);
  });

  test("should return NaN for negative base with non-integer exponent (-8^(1/3))", () => {
    expect(isNaN(exponentiate(-8, 1 / 3))).toBe(true);
  });

  test("should calculate (-2)^3 = -8 (negative base with integer exponent)", () => {
    expect(exponentiate(-2, 3)).toBe(-8);
  });

  test("should calculate (-5)^2 = 25 (negative base with even exponent)", () => {
    expect(exponentiate(-5, 2)).toBe(25);
  });

  test("should return 1 for 1^any exponent", () => {
    expect(exponentiate(1, 100)).toBe(1);
    expect(exponentiate(1, -5)).toBe(1);
    expect(exponentiate(1, 0.5)).toBe(1);
  });

  test("should return Infinity for 0^-1 (1/0)", () => {
    expect(exponentiate(0, -1)).toBe(Infinity);
  });

  test("should return Infinity for 0^-0.5 (1/sqrt(0))", () => {
    expect(exponentiate(0, -0.5)).toBe(Infinity);
  });

  test("should handle very large base with small exponent (100^10)", () => {
    const result = exponentiate(100, 10);
    // 100^10 = 1e20, which is representable but close to overflow
    expect(result).toBeGreaterThan(1e19);
  });

  test("should handle very small base with negative exponent (0.001^-3 ≈ 1e9)", () => {
    expect(exponentiate(0.001, -3)).toBeCloseTo(1000000000, -6);
  });
});

describe("calculator state machine - exponentiation operator", () => {
  test("calculate handles exponentiation (2^3=8)", () => {
    const state = baseState({
      previousOperand: 2,
      operator: "^",
      displayValue: "3",
      waitingForOperand: false,
    });
    const next = calculate(state);
    expect(next.displayValue).toBe("8");
    expect(next.previousOperand).toBe(null);
    expect(next.operator).toBe(null);
  });

  test("calculate handles decimal exponentiation (2^0.5)", () => {
    const state = baseState({
      previousOperand: 2,
      operator: "^",
      displayValue: "0.5",
      waitingForOperand: false,
    });
    const next = calculate(state);
    expect(parseFloat(next.displayValue)).toBeCloseTo(1.41421356, 2);
  });

  test("calculate handles 0^0 = 1", () => {
    const state = baseState({
      previousOperand: 0,
      operator: "^",
      displayValue: "0",
      waitingForOperand: false,
    });
    const next = calculate(state);
    expect(next.displayValue).toBe("1");
  });

  test("calculate displays 'Result too large' for overflow (999^999)", () => {
    const state = baseState({
      previousOperand: 999,
      operator: "^",
      displayValue: "999",
      waitingForOperand: false,
    });
    const next = calculate(state);
    expect(next.displayValue).toBe("Result too large");
  });

  test("calculate displays 'Invalid operation' for negative base with non-integer exponent", () => {
    const state = baseState({
      previousOperand: -2,
      operator: "^",
      displayValue: "0.5",
      waitingForOperand: false,
    });
    const next = calculate(state);
    expect(next.displayValue).toBe("Invalid operation");
  });

  test("inputOperator sets exponentiation operator", () => {
    const state = baseState({ displayValue: "2" });
    const next = inputOperator(state, "^");
    expect(next.previousOperand).toBe(2);
    expect(next.operator).toBe("^");
    expect(next.waitingForOperand).toBe(true);
  });
});
