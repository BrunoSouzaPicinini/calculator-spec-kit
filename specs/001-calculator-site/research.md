# Research: Vanilla JavaScript Calculator

**Feature**: Vanilla JavaScript Calculator  
**Created**: 2026-01-08  
**Status**: Complete

This document consolidates research findings to resolve all NEEDS CLARIFICATION items from the Technical Context and provides best practices for vanilla JavaScript calculator implementation.

## Research Questions

### 1. Testing Framework for Vanilla JavaScript

**Decision**: Jest for unit tests, Playwright for integration tests

**Rationale**:

- **Jest**: Industry standard for JavaScript testing, zero config, built-in coverage, fast execution
  - Works with vanilla JS (no transpilation needed for ES6+)
  - Excellent mocking capabilities for DOM testing
  - 90%+ npm ecosystem usage
- **Playwright**: Modern cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Real browser automation for integration tests
  - Fast and reliable (handles timing issues better than Selenium)
  - Supports keyboard event testing (critical for FR-011)

**Alternatives considered**:

- **Mocha + Chai**: More configuration needed, older tooling
- **Cypress**: Excellent but overkill for simple static site; Playwright lighter weight
- **Puppeteer**: Chrome-only, doesn't meet SC-008 (multi-browser requirement)

### 2. Code Quality Tools for Vanilla JavaScript

**Decision**: ESLint + Prettier

**Rationale**:

- **ESLint**: Standard JavaScript linter, catches bugs and enforces style
  - Use `eslint:recommended` config for vanilla JS
  - Add `eslint-plugin-html` to lint inline scripts in HTML
  - Catches common errors: undefined variables, unreachable code, etc.
- **Prettier**: Automatic code formatting, zero configuration
  - Eliminates style debates
  - Integrates with ESLint via `eslint-config-prettier`

**Configuration**:

```json
// .eslintrc.json
{
  "extends": ["eslint:recommended", "prettier"],
  "env": {
    "browser": true,
    "es2015": true
  },
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module"
  }
}
```

### 3. Calculator State Management Pattern

**Decision**: Single state object with pure functions

**Rationale**:

- **State Object Pattern**: Centralize all calculator state in one object
  ```javascript
  const state = {
    displayValue: "0",
    previousOperand: null,
    operator: null,
    waitingForOperand: false,
    calculationComplete: false,
  };
  ```
- **Pure Functions**: All operations return new state (easier to test, predictable)
- **No classes needed**: Simple enough for functional approach
- **Event-driven updates**: UI events trigger state updates, state changes trigger display updates

**Alternatives considered**:

- **Class-based**: More verbose, not needed for simple state machine
- **Redux-style reducer**: Overkill for single-page calculator
- **Direct DOM manipulation**: Harder to test, couples logic to UI

### 4. Decimal Precision Handling

**Decision**: Use JavaScript Number type with rounding for display

**Rationale**:

- **JavaScript Number**: IEEE 754 double precision (53-bit mantissa)
  - Handles most calculator use cases (15-17 significant digits)
  - Native arithmetic operations (fast)
- **Rounding Strategy**: Round to 10 decimal places for display (per SC-005)
  ```javascript
  const roundForDisplay = (num) => Math.round(num * 1e10) / 1e10;
  ```
- **Scientific Notation**: For very large/small numbers (> 12 digits)

**Known Limitations** (documented in spec assumptions):

- Floating point imprecision (e.g., 0.1 + 0.2 = 0.30000000000000004)
- Safe integer range: ±9,007,199,254,740,991
- Acceptable for general-purpose calculator

**Alternatives considered**:

- **Big.js / Decimal.js**: Violates FR-015 (no dependencies)
- **String arithmetic**: Complex to implement, error-prone
- **Integer-only**: Doesn't meet FR-008 (decimal support required)

### 5. Keyboard Event Handling

**Decision**: Global keydown listener with key mapping

**Rationale**:

- **Single global listener**: Better performance than per-element listeners
- **Key mapping object**: Maps keyboard keys to calculator actions
  ```javascript
  const keyMap = {
    "0-9": "inputNumber",
    "+": "inputOperator",
    Enter: "calculate",
    Escape: "clear",
  };
  ```
- **Prevent default**: Only for calculator keys (don't break browser shortcuts)
- **Focus management**: Calculator always "active" (no focus required on elements)

**Implementation Pattern**:

```javascript
document.addEventListener("keydown", (event) => {
  const action = keyMap[event.key];
  if (action) {
    event.preventDefault();
    handleAction(action, event.key);
  }
});
```

### 6. Responsive Design Strategy

**Decision**: CSS Grid for calculator layout + media queries

**Rationale**:

- **CSS Grid**: Perfect for button grid layout (4×5 buttons)
  - Two-dimensional layout control
  - Easy to reflow for mobile (3×6 grid)
- **Media Queries**: Breakpoints at 480px (mobile), 768px (tablet)
- **Viewport Units**: Use `vw` for button sizing on mobile
- **Touch Targets**: Minimum 44×44px buttons (iOS accessibility guideline)

**Layout Strategy**:

```css
.calculator {
  display: grid;
  grid-template-rows: auto 1fr;
  max-width: 400px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
}

@media (max-width: 480px) {
  .buttons {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 7. Error Handling for Division by Zero

**Decision**: Return "Error" string to display

**Rationale**:

- **Simple and Clear**: User-friendly message (constitution requirement)
- **State Reset**: Next number input clears error and starts fresh
- **No Exception Throwing**: Errors are expected user input, not exceptional
- **Visual Feedback**: Error state can trigger red text color

**Implementation**:

```javascript
function divide(a, b) {
  if (b === 0) {
    return { value: "Error", isError: true };
  }
  return { value: a / b, isError: false };
}
```

### 8. Performance Optimization Techniques

**Decision**: Minimal optimization needed for static calculator

**Rationale**:

- **No Build Step**: Serve raw HTML/CSS/JS (fastest possible load)
- **Inline Critical CSS**: Embed styles in `<head>` to avoid render-blocking
- **Defer Non-Critical JS**: Use `defer` attribute on script tags
- **Minification**: Optional for production (use Terser if needed)
- **Caching**: Set long cache headers (immutable files)

**Measured Performance** (expected):

- **HTML Size**: <5KB (simple structure)
- **CSS Size**: <3KB (minimal styling)
- **JS Size**: <8KB (simple logic)
- **Total**: <20KB uncompressed, <8KB gzipped
- **Load Time**: <100ms on 3G, <500ms on 2G (meets SC-002)

**Lighthouse Targets**:

- Performance: 95+ (static site is naturally fast)
- Accessibility: 100 (with proper ARIA labels)
- Best Practices: 100 (HTTPS + security headers)
- SEO: 100 (semantic HTML)

## Technology Stack Summary

| Category                  | Technology          | Justification                                             |
| ------------------------- | ------------------- | --------------------------------------------------------- |
| **Language**              | JavaScript ES6+     | Modern syntax, widely supported (Chrome 90+, Firefox 88+) |
| **HTML**                  | HTML5               | Semantic elements, accessibility features                 |
| **CSS**                   | CSS3 Grid + Flexbox | Layout, responsive design                                 |
| **Testing (Unit)**        | Jest                | Industry standard, zero config, fast                      |
| **Testing (Integration)** | Playwright          | Cross-browser, reliable, keyboard testing                 |
| **Linting**               | ESLint              | Bug detection, code quality                               |
| **Formatting**            | Prettier            | Consistent style, auto-format                             |
| **CI/CD**                 | GitHub Actions      | Free, integrated, supports Lighthouse audits              |

## Best Practices to Follow

### Code Organization

1. **Separation of Concerns**:
   - `calculator.js`: Pure calculation logic (state machine)
   - `ui.js`: DOM manipulation and event handling
   - `styles.css`: Presentation only

2. **Pure Functions**: All calculator operations should be pure (testable, predictable)

3. **Immutable State Updates**: Return new state objects instead of mutating

### Testing Strategy

1. **Test Pyramid**:
   - Many unit tests (calculator logic, input validation)
   - Fewer integration tests (UI + logic interaction)
   - Manual cross-browser testing (Playwright + BrowserStack)

2. **Test Coverage Targets**:
   - Calculator logic: 95%+ (all branches, edge cases)
   - UI handlers: 80%+ (user interactions)
   - Overall: 90%+ (constitution requirement)

3. **Edge Case Coverage**:
   - Division by zero (FR-009)
   - Multiple decimal points (FR-010)
   - Operator chaining (FR-013)
   - Large numbers (>12 digits)
   - Leading zeros
   - Empty operations ("==" with no input)

### Accessibility

1. **Keyboard Navigation**: All buttons accessible via Tab key
2. **ARIA Labels**: `aria-label` on all buttons for screen readers
3. **Semantic HTML**: `<button>` elements (not `<div>` with click handlers)
4. **Focus Indicators**: Visible focus outline (don't remove with CSS)
5. **Color Contrast**: WCAG AA minimum (4.5:1 for text)

### Performance

1. **Inline Critical CSS**: Eliminate render-blocking requests
2. **Defer JavaScript**: Use `<script defer>` for non-critical code
3. **Debounce Display Updates**: Only update DOM when value actually changes
4. **Avoid Layout Thrashing**: Batch DOM reads and writes

## Security Considerations

### Input Validation

- **Type Checking**: Validate all user inputs (buttons, keyboard)
- **Operator Validation**: Only accept valid operators (+, -, ×, ÷)
- **Number Validation**: Reject invalid number formats

### Snyk Scanning

- **Static Analysis**: Run Snyk Code on JavaScript files
- **No Dependencies**: Zero supply chain risk (no npm packages)
- **Content Security Policy**: Implement CSP headers to prevent XSS

### Safe Math Operations

- **No `eval()`**: Never use `eval()` or `Function()` constructor
- **Explicit Operations**: Use explicit arithmetic operators
- **Range Checking**: Validate results within safe integer range

## Implementation Readiness

✅ **All NEEDS CLARIFICATION items resolved**

**Next Steps**:

1. Proceed to Phase 1: Design (data-model.md, contracts/, quickstart.md)
2. Define calculator state machine in data-model.md
3. Document UI contract in contracts/ui-spec.md
4. Create quickstart guide for development setup

**Research Completed**: 2026-01-08
