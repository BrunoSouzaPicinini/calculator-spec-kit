import {
  initialState,
  inputNumber,
  inputDecimal,
  inputOperator,
  calculate,
  clear,
  clearAll,
} from "./calculator.js";

let state = { ...initialState };

export function getState() {
  return state;
}

export function setState(newState) {
  state = { ...newState };
  updateDisplay();
}

export function mapKeyToAction(key, modifiers = {}) {
  const { ctrlKey, metaKey, altKey } = modifiers;
  if (ctrlKey || metaKey || altKey) return null;

  if (/^[0-9]$/.test(key)) {
    return { action: "number", value: key };
  }

  if (key === "." || key === "Decimal") {
    return { action: "decimal" };
  }

  if (key === "+" || key === "-") {
    return { action: "operator", value: key };
  }

  if (key === "*" || key === "×" || key.toLowerCase() === "x") {
    return { action: "operator", value: "×" };
  }

  if (key === "/" || key === "÷") {
    return { action: "operator", value: "÷" };
  }

  if (key === "Enter" || key === "=") {
    return { action: "equals" };
  }

  if (key === "Escape" || key === "Esc") {
    return { action: "clear" };
  }

  if (key === "Delete") {
    return { action: "clearAll" };
  }

  return null;
}

function formatDisplay(value) {
  if (value === "Error") return value;
  const str = String(value);
  if (str.length > 12 && !str.includes("e")) {
    const num = Number(str);
    if (!Number.isNaN(num)) return num.toExponential(6);
  }
  return str;
}

export function updateDisplay() {
  const display = document.getElementById("display");
  if (!display) return;
  display.textContent = formatDisplay(state.displayValue);
}

export function attachEventHandlers() {
  const buttons = document.querySelectorAll("[data-action], [data-value]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => handleButton(btn));
  });

  window.addEventListener("keydown", handleKeydown);
}

function handleButton(button) {
  const { action, value } = button.dataset;
  const resolvedAction = resolveButtonAction(button, action, value);
  if (!resolvedAction) return;
  handleAction(resolvedAction.action, resolvedAction.value);
}

function resolveButtonAction(button, action, value) {
  if (action === "decimal") return { action: "decimal" };
  if (action === "equals") return { action: "equals" };
  if (action === "clear") return { action: "clear" };
  if (action === "clearAll") return { action: "clearAll" };
  if (button.classList.contains("operator") && value) {
    return { action: "operator", value };
  }
  if (value !== undefined) return { action: "number", value };
  return null;
}

function handleAction(action, value) {
  switch (action) {
    case "decimal":
      state = inputDecimal(state);
      break;
    case "operator":
      if (!value) return;
      state = inputOperator(state, value);
      break;
    case "equals":
      state = calculate(state);
      break;
    case "clear":
      state = clear(state);
      break;
    case "clearAll":
      state = clearAll();
      break;
    case "number":
      state = inputNumber(state, value);
      break;
    default:
      return;
  }
  updateDisplay();
}

function handleKeydown(event) {
  const mapping = mapKeyToAction(event.key, event);
  if (!mapping) return;
  event.preventDefault();
  handleAction(mapping.action, mapping.value);
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
    attachEventHandlers();
  });
}
