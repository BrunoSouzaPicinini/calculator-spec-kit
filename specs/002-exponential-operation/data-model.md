# Data Model: Exponential Operation

**Phase**: 1 - Design & Contracts  
**Feature**: Exponential Operation Implementation  
**Date**: January 9, 2026

---

## Entity: Calculation

Represents a single arithmetic calculation operation within the calculator.

### Properties

| Property | Type | Description | Constraints |
|----------|------|-------------|------------|
| `base` | `number` | The base value (e.g., 2 in 2^3) | Must be ≥ 0 or < 0; IEEE 754 compliant |
| `exponent` | `number` | The exponent value (e.g., 3 in 2^3) | Any valid JavaScript number |
| `operation` | `string` | The operation type | `"exponentiate"` for this feature |
| `result` | `number \| null` | Calculated result | `null` until calculated; may be `Infinity` or `NaN` |
| `timestamp` | `number` | When calculation was performed | Unix milliseconds (optional) |
| `displayValue` | `string` | Human-readable result for UI | Formatted number or error message |

### Relationships

```
Calculation
├── precedence → Operation Precedence Rules (order of operations)
├── validation → Input Validation Layer
└── formatting → Display Formatter (for displayValue)
```

---

## Operation: Exponentiation

### Definition

Exponentiation is the binary operation that raises a base to the power of an exponent.

**Mathematical Notation**: base^exponent or base ** exponent (JavaScript)

### Function Signature

```javascript
/**
 * Calculates base raised to the power of exponent
 * @param {number} base - The base value
 * @param {number} exponent - The exponent value
 * @returns {number} The result of base^exponent
 * 
 * Edge Cases:
 *   - base = 0, exponent = 0 → 1 (JavaScript convention)
 *   - result > 1.79e308 → Infinity (overflow)
 *   - base < 0 && exponent is non-integer → NaN (complex number)
 *   - base = 0, exponent < 0 → Infinity (division by zero)
 *   - base = 1, any exponent → 1 (identity)
 *   - any base, exponent = 0 → 1 (zero exponent)
 *   - any base, exponent = 1 → base (one exponent)
 */
function exponentiate(base, exponent) {
  return Math.pow(base, exponent);
}
```

### Input Validation Rules

| Condition | Validation Rule | Result |
|-----------|-----------------|--------|
| `base` is null/undefined | Reject | Error message: "Invalid base" |
| `base` is not a number | Reject | Error message: "Invalid base" |
| `exponent` is null/undefined | Reject | Error message: "Invalid exponent" |
| `exponent` is not a number | Reject | Error message: "Invalid exponent" |
| `base < 0` AND `exponent` is non-integer | Invalid operation | Return `NaN`, display: "Invalid operation" |
| `base = 0` AND `exponent < 0` | Division by zero | Return `Infinity`, display: "Result too large" |

### Output Constraints

| Result State | Handling | Display |
|---------|----------|---------|
| `Infinity` | Valid but out of range | "Result too large" |
| `-Infinity` | Valid but out of range | "Result too large" |
| `NaN` | Invalid operation | "Invalid operation" |
| Finite number | Valid | Format to 8 decimal places, remove trailing zeros |
| Very small decimal | Valid | Display scientific notation if < 0.00001 |

---

## State Transitions

### Operation Chaining

The calculator supports chaining operations: `5 + 2 ^ 3` should evaluate as `5 + (2 ^ 3) = 5 + 8 = 13` due to mathematical operator precedence.

```
State Diagram:
┌──────────────┐
│   IDLE       │ (No operation in progress)
└──────┬───────┘
       │ User enters number (e.g., "2")
       ▼
┌──────────────┐
│   VALUE      │ (Number entered: 2)
└──────┬───────┘
       │ User presses ^ button
       ▼
┌──────────────┐
│   OPERATOR   │ (Awaiting exponent)
└──────┬───────┘
       │ User enters exponent (e.g., "3")
       ▼
┌──────────────┐
│   VALUE      │ (Exponent entered: 3)
└──────┬───────┘
       │ User presses = button or another operator
       ▼
┌──────────────┐
│  CALCULATE   │ (Compute 2 ^ 3 = 8)
└──────┬───────┘
       │ Result displayed
       ▼
┌──────────────┐
│  RESULT      │ (8)
└──────┬───────┘
       │ User continues (e.g., + button)
       ▼
┌──────────────┐
│   OPERATOR   │ (Chain operation: 8 + ?)
└──────────────┘
```

### Precedence Rules

| Operator | Precedence | Comment |
|----------|-----------|---------|
| `^` (exponentiation) | 3 (highest) | Evaluated first in expression |
| `*`, `/` (multiply, divide) | 2 | Evaluated after exponentiation |
| `+`, `-` (add, subtract) | 1 (lowest) | Evaluated last |
| `=` (equals) | 0 (execute) | Triggers calculation |

---

## Validation Rules

### Pre-Calculation Validation

```javascript
function validateCalculation(base, exponent) {
  const errors = [];
  
  // Type validation
  if (typeof base !== 'number' || isNaN(base)) {
    errors.push("Invalid base");
  }
  if (typeof exponent !== 'number' || isNaN(exponent)) {
    errors.push("Invalid exponent");
  }
  
  // Complex number check
  if (base < 0 && !Number.isInteger(exponent)) {
    errors.push("Invalid operation (negative base with non-integer exponent)");
  }
  
  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
```

### Post-Calculation Validation

```javascript
function validateResult(result) {
  if (!isFinite(result) && result !== 0) {
    if (result === Infinity || result === -Infinity) {
      return { valid: true, status: "overflow" };
    } else {
      return { valid: false, status: "invalid_operation" };
    }
  }
  return { valid: true, status: "ok" };
}
```

---

## Display Formatting

### Result Formatting Rules

```javascript
function formatResult(result) {
  // Check for special cases
  if (!isFinite(result)) {
    if (result === Infinity || result === -Infinity) {
      return "Result too large";
    }
    return "Invalid operation";
  }
  
  // Format to 8 decimal places
  const formatted = parseFloat(result.toFixed(8));
  
  // Convert to string, removing trailing zeros
  const str = formatted.toString();
  
  // Handle very small numbers (use scientific notation)
  if (Math.abs(formatted) < 0.00001 && formatted !== 0) {
    return formatted.toExponential(4); // e.g., "1.2345e-8"
  }
  
  return str;
}
```

### Examples

| Input | Calculation | Result | Formatted |
|-------|-----------|--------|-----------|
| 2 ^ 3 | 8 | 8 | "8" |
| 2 ^ 0.5 | √2 | 1.4142135623730951 | "1.41421356" |
| 10 ^ 3 | 1000 | 1000 | "1000" |
| 0.5 ^ 2 | 0.25 | 0.25 | "0.25" |
| 999 ^ 999 | overflow | Infinity | "Result too large" |
| (-2) ^ 0.5 | √(-2) | NaN | "Invalid operation" |
| 0 ^ 0 | undefined (JS convention) | 1 | "1" |

---

## Integration Points

### Calculation Layer (calculator.js)

```javascript
// Existing structure in calculator.js
const Calculator = {
  add(a, b) { return a + b; },
  subtract(a, b) { return a - b; },
  multiply(a, b) { return a * b; },
  divide(a, b) { return a / b; },
  
  // NEW: Add exponentiation
  exponentiate(base, exponent) {
    // Implementation per research.md decisions
    return Math.pow(base, exponent);
  }
};
```

### UI Layer (ui.js)

```javascript
// Existing button handlers
const buttonHandlers = {
  '+': () => handleOperator('+'),
  '-': () => handleOperator('-'),
  '*': () => handleOperator('*'),
  '/': () => handleOperator('/'),
  
  // NEW: Add exponentiation button
  '^': () => handleOperator('^'),
  
  '=': () => executeCalculation(),
  'C': () => clearDisplay()
};
```

### Test Layer (calculator.test.js)

```javascript
describe('Calculator.exponentiate', () => {
  test('should calculate basic exponentiation', () => {
    expect(Calculator.exponentiate(2, 3)).toBe(8);
  });
  
  test('should handle decimal exponents', () => {
    expect(Calculator.exponentiate(2, 0.5)).toBeCloseTo(1.41421356, 5);
  });
  
  test('should handle 0^0 edge case', () => {
    expect(Calculator.exponentiate(0, 0)).toBe(1);
  });
  
  // Additional tests per research.md
});
```

---

## Summary

**Entity**: Calculation (with exponentiation operation)  
**Key Properties**: base, exponent, result, displayValue  
**Validation**: Three-tier (input → operation → output)  
**Edge Cases**: Overflow, complex numbers, division by zero  
**Formatting**: 8 decimal places, trailing zero removal, scientific notation for very small numbers  
**Integration**: Pure function in calculator.js, button handler in ui.js, tests in existing test suite
