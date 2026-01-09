# Quickstart: Exponential Operation Implementation

**Target**: JavaScript Developers  
**Time to Implement**: ~2-3 hours (including tests)  
**Complexity**: Low (pure function addition)  
**Date**: January 9, 2026

---

## Quick Overview

Add exponentiation (power) calculation to the calculator:
- **User enters**: `2`, press `^`, enter `3`, press `=`
- **Result displayed**: `8` (because 2³ = 8)

---

## Implementation Checklist

- [ ] Phase 1: Implement `exponentiate()` function
- [ ] Phase 2: Add UI button and keyboard binding
- [ ] Phase 3: Implement display formatter
- [ ] Phase 4: Add unit tests
- [ ] Phase 5: Add integration tests
- [ ] Phase 6: Verify performance (<1ms p95)
- [ ] Phase 7: Code review & merge

---

## Phase 1: Core Calculation Function

### File: `calculator-site/calculator.js`

**Task**: Add the `exponentiate()` function to the Calculator object.

```javascript
// Add to Calculator object in calculator.js

exponentiate(base, exponent) {
  /**
   * Calculate base raised to the power of exponent
   * Handles edge cases per specification:
   * - 0^0 returns 1 (JavaScript convention)
   * - Negative base + non-integer exponent returns NaN (avoids complex numbers)
   * - Overflow returns Infinity
   */
  return Math.pow(base, exponent);
}
```

**Why**: `Math.pow()` is:
- Native C++ implementation (fast, <0.1ms typical)
- IEEE 754 compliant
- Already handles all edge cases per JavaScript standard
- No external dependencies needed

**Testing Locally**:
```javascript
console.assert(Calculator.exponentiate(2, 3) === 8, "2^3 should be 8");
console.assert(Calculator.exponentiate(2, 0.5) > 1.41 && Calculator.exponentiate(2, 0.5) < 1.42, "2^0.5 should be ~1.414");
console.assert(Calculator.exponentiate(0, 0) === 1, "0^0 should be 1");
console.assert(isNaN(Calculator.exponentiate(-2, 0.5)), "-2^0.5 should be NaN");
console.assert(!isFinite(Calculator.exponentiate(999, 999)), "999^999 should be Infinity");
```

---

## Phase 2: UI Integration

### File: `calculator-site/ui.js`

**Task 1**: Add `^` button to HTML template (or verify it exists in `index.html`)

```html
<!-- In index.html <button> section -->
<button id="btn-exponentiate" data-op="^">^</button>
```

**Task 2**: Add button click handler in `ui.js`

```javascript
// In the button click event handler section of ui.js

// Add to existing button handler mapping
const buttonHandlers = {
  // ... existing handlers (+, -, *, /) ...
  '^': () => handleOperator('^'),  // Add this line
  '=': () => executeCalculation(),
  'C': () => clearDisplay()
};

// Wire up button if not already handled by generic handler
document.getElementById('btn-exponentiate')?.addEventListener('click', () => {
  handleOperator('^');
});
```

**Task 3**: Add keyboard binding for `^` button

```javascript
// Add to keyboard event listener in ui.js

document.addEventListener('keydown', (event) => {
  // Existing keyboard handling...
  
  // Add exponentiation shortcuts
  if (event.key === '^' || (event.shiftKey && event.key === '6')) {
    event.preventDefault();
    handleOperator('^');
  }
});
```

**Why Shift+6?**: ASCII 94 (^) is typically Shift+6 on most keyboards

---

## Phase 3: Display Formatting

### File: `calculator-site/calculator.js` (add new function)

**Task**: Create formatter for displaying results with proper decimal handling.

```javascript
// Add to calculator.js (can be in Calculator object or separate)

function formatCalculatorResult(result) {
  /**
   * Format calculation result for display
   * Rules:
   * - Infinity/NaN → user-friendly messages
   * - Numbers → 8 decimal places max, remove trailing zeros
   * - Very small numbers → scientific notation
   */
  
  // Check for special values
  if (!isFinite(result)) {
    return result === Infinity || result === -Infinity 
      ? "Result too large" 
      : "Invalid operation";
  }
  
  // Format to 8 decimal places
  const fixed = parseFloat(result.toFixed(8));
  
  // Scientific notation for very small numbers
  if (Math.abs(fixed) < 0.00001 && fixed !== 0) {
    return fixed.toExponential(4);
  }
  
  // Return string, JavaScript removes trailing zeros automatically
  return fixed.toString();
}
```

### Update: `ui.js` Display Function

Find the display update code and modify it:

```javascript
// Find this section in ui.js (may be called displayResult or similar)
function displayResult(result) {
  // OLD:
  // display.textContent = result;
  
  // NEW:
  const formattedResult = formatCalculatorResult(result);
  
  // Handle display states
  if (formattedResult === "Invalid operation") {
    display.textContent = "Invalid operation";
    display.style.color = "red";  // Optional: highlight error
  } else if (formattedResult === "Result too large") {
    display.textContent = "Result too large";
    display.style.color = "red";  // Optional: highlight error
  } else {
    display.textContent = formattedResult;
    display.style.color = "";  // Reset color
  }
}
```

---

## Phase 4: Unit Tests

### File: `tests/unit/calculator.test.js`

**Task**: Add comprehensive test cases for exponentiation.

```javascript
describe('Calculator.exponentiate', () => {
  
  describe('Basic Operations', () => {
    it('should calculate 2^3 = 8', () => {
      expect(Calculator.exponentiate(2, 3)).toBe(8);
    });
    
    it('should calculate 10^2 = 100', () => {
      expect(Calculator.exponentiate(10, 2)).toBe(100);
    });
    
    it('should calculate 5^1 = 5', () => {
      expect(Calculator.exponentiate(5, 1)).toBe(5);
    });
  });
  
  describe('Decimal Exponents', () => {
    it('should calculate 2^0.5 ≈ 1.41421356 (square root)', () => {
      expect(Calculator.exponentiate(2, 0.5)).toBeCloseTo(1.41421356, 5);
    });
    
    it('should calculate 8^(1/3) ≈ 2 (cube root)', () => {
      expect(Calculator.exponentiate(8, 1/3)).toBeCloseTo(2, 5);
    });
    
    it('should calculate 10^0.5 ≈ 3.16227766', () => {
      expect(Calculator.exponentiate(10, 0.5)).toBeCloseTo(3.16227766, 5);
    });
  });
  
  describe('Zero Exponent', () => {
    it('should return 1 for any number^0', () => {
      expect(Calculator.exponentiate(5, 0)).toBe(1);
      expect(Calculator.exponentiate(0.001, 0)).toBe(1);
      expect(Calculator.exponentiate(999, 0)).toBe(1);
    });
  });
  
  describe('Zero Base', () => {
    it('should return 0 for 0^positive', () => {
      expect(Calculator.exponentiate(0, 5)).toBe(0);
      expect(Calculator.exponentiate(0, 0.1)).toBe(0);
    });
    
    it('should return Infinity for 0^negative', () => {
      expect(Calculator.exponentiate(0, -1)).toBe(Infinity);
    });
    
    it('should return 1 for 0^0 (JavaScript convention)', () => {
      expect(Calculator.exponentiate(0, 0)).toBe(1);
    });
  });
  
  describe('Negative Exponents', () => {
    it('should calculate 2^-1 = 0.5', () => {
      expect(Calculator.exponentiate(2, -1)).toBe(0.5);
    });
    
    it('should calculate 10^-2 = 0.01', () => {
      expect(Calculator.exponentiate(10, -2)).toBe(0.01);
    });
  });
  
  describe('Edge Cases - Complex Numbers (NaN)', () => {
    it('should return NaN for negative base with non-integer exponent', () => {
      expect(isNaN(Calculator.exponentiate(-2, 0.5))).toBe(true);
      expect(isNaN(Calculator.exponentiate(-8, 1/3))).toBe(true);
    });
  });
  
  describe('Edge Cases - Overflow', () => {
    it('should return Infinity for overflow', () => {
      expect(Calculator.exponentiate(999, 999)).toBe(Infinity);
      expect(Calculator.exponentiate(10, 308)).toBe(Infinity);
    });
  });
  
  describe('Identity Cases', () => {
    it('should return 1 for 1^any', () => {
      expect(Calculator.exponentiate(1, 100)).toBe(1);
      expect(Calculator.exponentiate(1, -5)).toBe(1);
      expect(Calculator.exponentiate(1, 0.5)).toBe(1);
    });
  });
});

describe('formatCalculatorResult', () => {
  
  it('should format finite numbers', () => {
    expect(formatCalculatorResult(8)).toBe('8');
    expect(formatCalculatorResult(1.41421356)).toBe('1.41421356');
  });
  
  it('should remove trailing zeros', () => {
    expect(formatCalculatorResult(1.5)).toBe('1.5');
    expect(formatCalculatorResult(1.0)).toBe('1');
  });
  
  it('should use scientific notation for very small numbers', () => {
    expect(formatCalculatorResult(0.000001)).toContain('e');
  });
  
  it('should return "Result too large" for Infinity', () => {
    expect(formatCalculatorResult(Infinity)).toBe('Result too large');
    expect(formatCalculatorResult(-Infinity)).toBe('Result too large');
  });
  
  it('should return "Invalid operation" for NaN', () => {
    expect(formatCalculatorResult(NaN)).toBe('Invalid operation');
  });
});
```

**Run tests**:
```bash
npm test -- calculator.test.js
```

**Expected Output**:
```
PASS  tests/unit/calculator.test.js
  Calculator.exponentiate
    Basic Operations
      ✓ should calculate 2^3 = 8 (2 ms)
      ✓ should calculate 10^2 = 100 (1 ms)
      ... (all tests passing)
    
    formatCalculatorResult
      ✓ should format finite numbers (1 ms)
      ... (all tests passing)

Tests:       20 passed, 20 total
```

---

## Phase 5: Integration Tests

### File: `tests/integration/ui-interactions.test.js`

**Task**: Add user interaction tests (simulating button clicks, keyboard input).

```javascript
describe('Calculator UI - Exponentiation', () => {
  
  beforeEach(() => {
    // Reset calculator state before each test
    document.getElementById('display').textContent = '0';
    // Assuming global calculator state exists
    if (window.calculator) {
      window.calculator.clear();
    }
  });
  
  it('should calculate 2^3 = 8 via button clicks', () => {
    // User interaction: 2 ^ 3 =
    clickButton('2');
    clickButton('^');
    clickButton('3');
    clickButton('=');
    
    expect(getDisplay()).toBe('8');
  });
  
  it('should handle decimal exponentiation via keyboard', () => {
    // User interaction: 2 ^ 0.5 =
    typeNumber('2');
    typeKey('^');  // or Shift+6
    typeNumber('0.5');
    typeKey('Enter');  // or click =
    
    const result = parseFloat(getDisplay());
    expect(result).toBeCloseTo(1.41421356, 2);
  });
  
  it('should display "Invalid operation" for -2^0.5', () => {
    typeNumber('-2');
    typeKey('^');
    typeNumber('0.5');
    clickButton('=');
    
    expect(getDisplay()).toBe('Invalid operation');
  });
  
  it('should display "Result too large" for 999^999', () => {
    typeNumber('999');
    typeKey('^');
    typeNumber('999');
    clickButton('=');
    
    expect(getDisplay()).toBe('Result too large');
  });
  
  it('should chain operations: (5 + 2^3) should calculate as 5 + 8 = 13', () => {
    typeNumber('5');
    clickButton('+');
    typeNumber('2');
    typeKey('^');
    typeNumber('3');
    clickButton('=');
    
    expect(getDisplay()).toBe('13');
  });
});

// Helper functions (may already exist in test setup)
function clickButton(label) {
  const btn = document.querySelector(`[data-op="${label}"], button:contains("${label}")`);
  btn?.click();
}

function typeNumber(num) {
  num.split('').forEach(digit => {
    document.querySelector(`[data-num="${digit}"]`)?.click();
  });
}

function typeKey(key) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key }));
}

function getDisplay() {
  return document.getElementById('display')?.textContent || '';
}
```

**Run tests**:
```bash
npm test -- ui-interactions.test.js
```

---

## Phase 6: Performance Verification

### Command: Benchmark Calculation Speed

```bash
# Add to package.json scripts if not exists:
# "benchmark": "node scripts/benchmark.js"

npm run benchmark
```

**Benchmark Script** (`scripts/benchmark.js`):

```javascript
const { exponentiate } = require('../calculator-site/calculator.js');

function benchmark(name, fn, iterations = 10000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const duration = performance.now() - start;
  const avgTime = duration / iterations;
  
  console.log(`${name}: ${avgTime.toFixed(3)}ms (total: ${duration.toFixed(2)}ms)`);
  return avgTime;
}

console.log('Exponentiation Performance Benchmark');
console.log('====================================');

benchmark('Basic exponentiation (2^3)', () => exponentiate(2, 3));
benchmark('Decimal exponent (2^0.5)', () => exponentiate(2, 0.5));
benchmark('Large exponent (10^100)', () => exponentiate(10, 100));
benchmark('Negative base ((-5)^3)', () => exponentiate(-5, 3));
benchmark('Overflow case (999^999)', () => exponentiate(999, 999));

console.log('\nExpected Result: All tests should complete in < 1ms');
```

**Expected Output**:
```
Exponentiation Performance Benchmark
====================================
Basic exponentiation (2^3): 0.001ms (total: 10.23ms)
Decimal exponent (2^0.5): 0.001ms (total: 10.15ms)
Large exponent (10^100): 0.001ms (total: 10.18ms)
Negative base ((-5)^3): 0.001ms (total: 10.21ms)
Overflow case (999^999): 0.001ms (total: 10.19ms)

Expected Result: All tests should complete in < 1ms ✓
```

---

## Phase 7: Code Review Checklist

Before committing, verify:

- [ ] `Calculator.exponentiate()` returns correct results for all test cases
- [ ] `exponentiate()` is pure (no side effects, no global state modification)
- [ ] UI button/keyboard binding works for both `^` and `Shift+6`
- [ ] Display formatter handles all edge cases (Infinity, NaN, decimals)
- [ ] Unit tests pass (>90% coverage)
- [ ] Integration tests pass (UI interactions work correctly)
- [ ] Performance benchmark shows <1ms p95
- [ ] No console errors or warnings
- [ ] Code follows existing project style (indentation, naming, comments)
- [ ] No breaking changes to existing functionality

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Calculator.exponentiate is not defined` | Check function was added to Calculator object in calculator.js |
| `^ button doesn't work` | Verify button element in HTML has `data-op="^"` and event listener is attached |
| `Keyboard shortcut Shift+6 doesn't work` | Check keydown handler includes `(event.shiftKey && event.key === '6')` |
| `Display shows 1.414213562373095 instead of 1.41421356` | Verify `formatCalculatorResult()` function is being called |
| `Tests fail with precision issues` | Use `toBeCloseTo(expected, 5)` instead of `toBe()` for decimal results |
| `Performance benchmark shows >1ms` | Verify calculator.js is not doing extra work (should just call `Math.pow()`) |

---

## Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `calculator-site/calculator.js` | Add `exponentiate()` function + `formatCalculatorResult()` | P1 |
| `calculator-site/ui.js` | Add `^` button handler + keyboard binding | P1 |
| `calculator-site/index.html` | Add `<button>^</button>` element (if not exists) | P1 |
| `tests/unit/calculator.test.js` | Add exponentiation unit tests (20+ tests) | P1 |
| `tests/integration/ui-interactions.test.js` | Add UI interaction tests (5+ tests) | P2 |
| `scripts/benchmark.js` | Add performance verification script | P2 |

---

## Next Steps

1. **Implement Phase 1-3**: Core function + UI + formatter (1 hour)
2. **Run Phase 4-5**: Unit + integration tests (1 hour)
3. **Verify Phase 6**: Performance benchmark (15 minutes)
4. **Review Phase 7**: Code review checklist (30 minutes)
5. **Commit & Push**: `git commit -m "feat: add exponential operation (^) to calculator"`
6. **Create PR**: Link to CDTFGT-11 Jira ticket

---

## Reference Files

- **Data Model**: [data-model.md](data-model.md) - Full entity and operation definitions
- **API Contract**: [contracts/exponential-operation.md](contracts/exponential-operation.md) - Function signature and error handling
- **Feature Spec**: [spec.md](spec.md) - Complete user stories and requirements
- **Research**: [research.md](research.md) - Technical decisions and rationale
