export const initialState = {
  displayValue: "0",
  previousOperand: null,
  operator: null,
  waitingForOperand: false,
  calculationComplete: false,
  isError: false,
};

export function resetState() {
  return { ...initialState };
}

export function inputNumber(state, digit) {
  if (state.isError) return resetStateWithDigit(digit);
  if (state.calculationComplete) return resetStateWithDigit(digit);
  if (state.waitingForOperand) {
    return {
      ...state,
      displayValue: String(digit),
      waitingForOperand: false,
    };
  }
  if (state.displayValue === "0") {
    return { ...state, displayValue: String(digit) };
  }
  return { ...state, displayValue: state.displayValue + String(digit) };
}

export function inputDecimal(state) {
  if (state.isError || state.calculationComplete) {
    return { ...resetState(), displayValue: "0." };
  }
  if (state.waitingForOperand) {
    return { ...state, displayValue: "0.", waitingForOperand: false };
  }
  if (state.displayValue.includes(".")) return state;
  return { ...state, displayValue: `${state.displayValue}.` };
}

export function inputOperator(state, operator) {
  if (state.isError) return state;
  if (
    state.previousOperand !== null &&
    state.operator &&
    !state.waitingForOperand
  ) {
    const calculated = calculate(state);
    return {
      ...calculated,
      previousOperand: parseFloat(calculated.displayValue),
      operator,
      waitingForOperand: true,
      calculationComplete: false,
    };
  }
  return {
    ...state,
    previousOperand: parseFloat(state.displayValue),
    operator,
    waitingForOperand: true,
    calculationComplete: false,
  };
}

export function exponentiate(base, exponent) {
  /**
   * Calculate base raised to the power of exponent.
   * Uses JavaScript's native Math.pow() which handles:
   * - 0^0 = 1 (JavaScript convention)
   * - Overflow = Infinity
   * - Complex numbers (negative base + non-integer exponent) = NaN
   */
  return Math.pow(base, exponent);
}

export function calculate(state) {
  if (state.isError) return state;
  if (state.previousOperand === null || state.operator === null) return state;

  const a = state.previousOperand;
  const b = parseFloat(state.displayValue);
  let result = state.displayValue;
  let isError = false;

  switch (state.operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "×":
    case "*":
      result = a * b;
      break;
    case "÷":
    case "/":
      if (b === 0) {
        result = "Error";
        isError = true;
      } else {
        result = a / b;
      }
      break;
    case "^":
      result = exponentiate(a, b);
      break;
    default:
      return state;
  }

  const formatted = isError ? "Error" : formatResult(result);

  return {
    ...state,
    displayValue: formatted,
    previousOperand: null,
    operator: null,
    waitingForOperand: false,
    calculationComplete: !isError,
    isError,
  };
}

export function clear(state) {
  return {
    ...state,
    displayValue: "0",
    isError: false,
    calculationComplete: false,
    waitingForOperand: state.waitingForOperand,
  };
}

export function clearAll() {
  return resetState();
}

function formatResult(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Invalid operation";
  }
  if (!Number.isFinite(value)) {
    return "Result too large";
  }

  // For very small numbers, use scientific notation BEFORE rounding
  if (Math.abs(value) < 0.00001 && value !== 0) {
    return value.toExponential(4);
  }

  // Format to 8 decimal places
  const rounded = Math.round(value * 1e8) / 1e8;

  const asString = String(rounded);
  if (asString.replace(".", "").length > 12) {
    return rounded.toExponential(6);
  }
  return asString;
}

function resetStateWithDigit(digit) {
  return {
    ...resetState(),
    displayValue: String(digit),
  };
}
