# API Contract: Exponential Operation

**Format**: OpenAPI 3.0 (adapted for JavaScript functions)  
**Feature**: Exponential Operation for Calculator  
**Version**: 1.0.0  
**Date**: January 9, 2026

---

## Function Contract: exponentiate

### Signature

```typescript
function exponentiate(base: number, exponent: number): number
```

### Description

Raises a base number to the power of an exponent value using mathematical exponentiation.

**Example**: `exponentiate(2, 3)` returns `8` (2³ = 8)

---

## Input Parameters

### Parameter: base

| Property | Value |
|----------|-------|
| **Name** | `base` |
| **Type** | `number` |
| **Required** | Yes |
| **Description** | The base value to be raised to a power |
| **Valid Range** | Any IEEE 754 number (including negatives, zero, decimals) |
| **Example** | `2`, `-5`, `0.5`, `0` |

**Validation Rules**:
- Must be a valid JavaScript number
- Cannot be `null` or `undefined`
- Cannot be `NaN`

---

### Parameter: exponent

| Property | Value |
|----------|-------|
| **Name** | `exponent` |
| **Type** | `number` |
| **Required** | Yes |
| **Description** | The exponent (power) to raise the base to |
| **Valid Range** | Any IEEE 754 number |
| **Example** | `3`, `-2`, `0.5`, `0` |

**Validation Rules**:
- Must be a valid JavaScript number
- Cannot be `null` or `undefined`
- Cannot be `NaN`
- Special constraint: If `base < 0`, then `exponent` must be an integer (to avoid complex numbers)

---

## Output

### Success Response

| Property | Value |
|----------|-------|
| **Type** | `number` |
| **Description** | The calculated result of base^exponent |
| **Valid Values** | Any IEEE 754 number (including `Infinity`, `-Infinity`, `0`, negative numbers, decimals) |
| **Range** | -1.79e+308 to 1.79e+308 (JavaScript limit) |

**Examples**:
- `exponentiate(2, 3)` → `8`
- `exponentiate(2, -1)` → `0.5`
- `exponentiate(2, 0)` → `1`
- `exponentiate(0, 0)` → `1` (JavaScript convention)
- `exponentiate(2, 0.5)` → `1.4142135623730951` (√2)

---

### Error/Edge Case Response

| Condition | Result | UI Display |
|-----------|--------|-----------|
| `base < 0` AND `exponent` is non-integer | `NaN` | "Invalid operation" |
| `base = 0` AND `exponent < 0` | `Infinity` | "Result too large" |
| `base ≠ 0` AND result exceeds 1.79e308 | `Infinity` | "Result too large" |
| `base ≠ 0` AND result exceeds -1.79e308 | `-Infinity` | "Result too large" |

---

## Usage Contract

### Caller Responsibilities

1. **Input Validation**: Ensure `base` and `exponent` are valid numbers before calling
2. **Type Checking**: Use `typeof` or `Number.isFinite()` to validate inputs
3. **Error Handling**: Check result for `Infinity` or `NaN` before display
4. **UI Formatting**: Call formatter to convert result to display string

### Implementation Responsibilities

1. **Calculation**: Use native `Math.pow()` for IEEE 754-compliant calculation
2. **Consistency**: Always return JavaScript number type
3. **No Side Effects**: Pure function with no state modification
4. **Performance**: Execute within <1ms for typical calculations

---

## Error Handling

### Input Validation Errors

```javascript
// Invalid type
exponentiate("2", 3)           // TypeError: caller should validate first
exponentiate(null, 3)           // Caller should validate
exponentiate(undefined, 3)      // Caller should validate

// These are caught by input validation layer (ui.js), NOT this function
```

### Calculation Errors

```javascript
// Complex number (negative base, non-integer exponent)
exponentiate(-2, 0.5)          // Returns NaN
exponentiate(-8, 1/3)          // Returns NaN

// Division by zero
exponentiate(0, -1)            // Returns Infinity

// Overflow
exponentiate(999, 999)         // Returns Infinity
exponentiate(10, 308)          // Returns Infinity

// Special JavaScript cases
exponentiate(0, 0)             // Returns 1 (JavaScript convention, not mathematically undefined)
```

---

## Integration Contract

### Expected Caller: ui.js Button Handler

```javascript
// In ui.js: Button handler for ^ button
function handleExponentiateButton() {
  const base = getCurrentDisplayValue();    // Get user-entered base
  const exponent = getNextInputValue();     // Get user-entered exponent
  
  // Validation layer
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    display.textContent = "Invalid input";
    return;
  }
  
  // Call exponentiation contract
  const result = Calculator.exponentiate(base, exponent);
  
  // Error handling
  if (isNaN(result)) {
    display.textContent = "Invalid operation";
  } else if (!isFinite(result)) {
    display.textContent = "Result too large";
  } else {
    display.textContent = formatNumber(result);
  }
}
```

### Expected Caller: calculator.test.js Unit Tests

```javascript
describe('exponentiate', () => {
  it('should calculate 2^3 = 8', () => {
    expect(exponentiate(2, 3)).toBe(8);
  });
  
  it('should calculate 2^0.5 ≈ 1.41421356', () => {
    expect(exponentiate(2, 0.5)).toBeCloseTo(1.41421356, 5);
  });
  
  it('should return 1 for 0^0', () => {
    expect(exponentiate(0, 0)).toBe(1);
  });
  
  it('should return NaN for negative base with non-integer exponent', () => {
    expect(isNaN(exponentiate(-2, 0.5))).toBe(true);
  });
});
```

---

## Performance Contract

| Metric | Target | Verification |
|--------|--------|--------------|
| **Calculation Time (p50)** | < 0.1 ms | Benchmark: 1000 iterations |
| **Calculation Time (p95)** | < 1 ms | Benchmark: 1000 iterations |
| **Memory Allocation** | 0 bytes | Pure function, no allocation |
| **Side Effects** | None | Pure function contract |

---

## Backward Compatibility

**Status**: New feature - no breaking changes to existing calculator functions.

**Impact**:
- ✅ No changes to existing function signatures
- ✅ No changes to existing operation handlers
- ✅ Additive only: `exponentiate()` is a new function
- ✅ Safe to deploy alongside existing features

---

## Acceptance Criteria

- ✅ Function returns correct result for basic exponentiation (2^3 = 8)
- ✅ Function handles decimal exponents (2^0.5 ≈ 1.41421356)
- ✅ Function handles zero exponent (any^0 = 1)
- ✅ Function handles zero base (0^positive = 0, 0^negative = Infinity)
- ✅ Function handles 0^0 = 1 (JavaScript convention)
- ✅ Function returns NaN for negative base with non-integer exponent
- ✅ Function returns Infinity for overflow cases
- ✅ Function executes within <1ms for typical inputs (p95)
- ✅ Function is pure (no side effects)
- ✅ All unit tests pass (90%+ coverage)
- ✅ All integration tests pass (UI interactions work correctly)
