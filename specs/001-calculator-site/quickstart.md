# Quickstart Guide: Vanilla JavaScript Calculator

**Feature**: Vanilla JavaScript Calculator  
**Created**: 2026-01-08  
**Audience**: Developers

This guide provides step-by-step instructions for setting up, developing, testing, and deploying the calculator application.

## Prerequisites

- **Node.js**: 18+ (for testing tools only, not required for runtime)
- **npm**: 9+ (for installing dev dependencies)
- **Git**: For version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Code Editor**: VS Code recommended (with ESLint + Prettier extensions)

## Quick Start (3 Steps)

### 1. Clone and Install

```bash
# Navigate to project directory
cd /Users/bruno.picinini/projects/picpay/spike/calculator-spec-kit

# Checkout feature branch
git checkout 001-calculator-site

# Install dev dependencies (testing and linting tools)
npm install --save-dev jest @testing-library/jest-dom \
  playwright @playwright/test \
  eslint prettier eslint-config-prettier \
  lighthouse
```

### 2. Run Tests (TDD Workflow)

```bash
# Run unit tests (watch mode for development)
npm run test:watch

# Run all tests once
npm test

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage

# Generate Lighthouse report (headless, uses http-server)
npm run lighthouse
```

### 3. Open in Browser

```bash
# Option 1: Simple HTTP server
npx http-server . -p 8080

# Option 2: Python (if installed)
python3 -m http.server 8080

# Open browser to http://localhost:8080
```

## Keyboard Shortcuts (P4)

- Digits: `0-9`
- Operators: `+`, `-`, `*`/`x`, `/`
- Decimal: `.`
- Equals: `Enter` or `=`
- Clear entry: `Escape`
- Clear all: `Delete`

## Project Structure

```
calculator-site/
├── index.html              # Main HTML file
├── styles.css              # Calculator styles
├── calculator.js           # Calculator logic (state machine)
├── ui.js                   # UI event handlers
├── README.md               # Project documentation
│
├── tests/
│   ├── unit/
│   │   ├── calculator.test.js     # Calculator logic tests
│   │   └── validation.test.js     # Input validation tests
│   └── integration/
│       └── ui-interactions.test.js # UI integration tests
│
├── config/
│   ├── .eslintrc.json      # ESLint configuration
│   ├── .prettierrc.json    # Prettier configuration
│   └── jest.config.js      # Jest test configuration
│
├── package.json            # Dev dependencies and scripts
└── .github/
    └── workflows/
        └── ci.yml          # GitHub Actions CI/CD
```

## Development Workflow

### TDD Cycle (Constitution Requirement)

**IMPORTANT**: Follow Test-Driven Development strictly per constitution.

```bash
# Step 1: Write a failing test
vim tests/unit/calculator.test.js

# Step 2: Run test (verify it fails)
npm run test:watch

# Step 3: Write minimal code to pass
vim calculator.js

# Step 4: Test passes → Refactor if needed
# Step 5: Repeat for next feature
```

**Example TDD Iteration**:

```javascript
// 1. Write failing test (tests/unit/calculator.test.js)
test("inputNumber should append digit to display", () => {
  const state = { displayValue: "5", waitingForOperand: false };
  const newState = inputNumber(state, "3");
  expect(newState.displayValue).toBe("53");
});

// 2. Run test → FAIL (function doesn't exist)
// 3. Implement function (calculator.js)
function inputNumber(state, digit) {
  return {
    ...state,
    displayValue: state.displayValue + digit,
  };
}

// 4. Run test → PASS
// 5. Refactor if needed (handle edge cases)
```

### Development Commands

```bash
# Linting
npm run lint              # Check for errors
npm run lint:fix          # Auto-fix errors
npm run format            # Format code with Prettier

# Testing
npm test                  # Run all tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage     # Coverage report
npm run test:watch        # Watch mode (TDD)

# Performance
npm run lighthouse        # Run Lighthouse audit

# Security
npx snyk code test .      # Snyk security scan (constitution requirement)
```

## Configuration Files

### package.json

```json
{
  "name": "vanilla-calculator",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit",
    "test:integration": "playwright test",
    "test:coverage": "jest --coverage",
    "lint": "eslint *.js tests/**/*.js",
    "lint:fix": "eslint --fix *.js tests/**/*.js",
    "format": "prettier --write \"**/*.{js,html,css}\"",
    "lighthouse": "lighthouse http://localhost:8080 --output html --output-path ./lighthouse-report.html"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "@testing-library/jest-dom": "^6.1.5",
    "playwright": "^1.40.1",
    "@playwright/test": "^1.40.1",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1",
    "eslint-config-prettier": "^9.1.0",
    "lighthouse": "^11.4.0"
  }
}
```

### config/.eslintrc.json

```json
{
  "extends": ["eslint:recommended", "prettier"],
  "env": {
    "browser": true,
    "es2015": true,
    "jest": true
  },
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### config/.prettierrc.json

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### config/jest.config.js

```javascript
module.exports = {
  testEnvironment: "jsdom",
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  collectCoverageFrom: ["*.js", "!jest.config.js", "!tests/**"],
};
```

## Testing Guide

### Unit Testing (Jest)

**Test Structure**:

```javascript
// tests/unit/calculator.test.js
import { inputNumber, inputOperator, calculate } from "../../calculator.js";

describe("Calculator State Management", () => {
  describe("inputNumber", () => {
    test('should set display to digit when display is "0"', () => {
      const state = { displayValue: "0", waitingForOperand: false };
      const newState = inputNumber(state, "5");
      expect(newState.displayValue).toBe("5");
    });

    test("should append digit when display has value", () => {
      const state = { displayValue: "5", waitingForOperand: false };
      const newState = inputNumber(state, "3");
      expect(newState.displayValue).toBe("53");
    });

    // More tests...
  });

  describe("calculate", () => {
    test("should return error for division by zero", () => {
      const state = {
        displayValue: "0",
        previousOperand: 5,
        operator: "÷",
        waitingForOperand: false,
      };
      const newState = calculate(state);
      expect(newState.isError).toBe(true);
      expect(newState.displayValue).toBe("Error");
    });
  });
});
```

**Run Tests**:

```bash
npm run test:watch  # Watch mode for TDD
npm run test:coverage  # Generate coverage report
```

### Integration Testing (Playwright)

**Test Structure**:

```javascript
// tests/integration/ui-interactions.test.js
const { test, expect } = require("@playwright/test");

test.describe("Calculator UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080");
  });

  test("should perform basic calculation: 5 + 3 = 8", async ({ page }) => {
    await page.click('button[data-value="5"]');
    await page.click('button[data-value="+"]');
    await page.click('button[data-value="3"]');
    await page.click('button[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("8");
  });

  test("should support keyboard input", async ({ page }) => {
    await page.keyboard.press("5");
    await page.keyboard.press("+");
    await page.keyboard.press("3");
    await page.keyboard.press("Enter");

    const display = await page.textContent("#display");
    expect(display).toBe("8");
  });
});
```

**Run Integration Tests**:

```bash
# Start local server first
npx http-server . -p 8080 &

# Run tests
npm run test:integration

# Stop server
pkill -f http-server
```

## Code Quality Checks

### Pre-Commit Checklist

Before committing code, ensure:

```bash
# 1. Linting passes
npm run lint

# 2. Tests pass
npm test

# 3. Coverage meets threshold (90%)
npm run test:coverage

# 4. Code formatted
npm run format

# 5. Security scan clean
npx snyk code test .
```

### Constitution Compliance

**Before Merge** (per constitution):

- [ ] All tests passing (unit + integration)
- [ ] Code coverage ≥90% (business logic)
- [ ] ESLint: zero errors
- [ ] Snyk scan: zero critical/high issues
- [ ] Code review approved
- [ ] Lighthouse score: Performance 95+, Accessibility 100

## Debugging Tips

### Browser DevTools

```javascript
// Add breakpoints in code
function calculate(state) {
  debugger; // Execution pauses here
  // ...
}

// Log state changes
console.log("State before:", state);
const newState = calculate(state);
console.log("State after:", newState);
```

### Jest Debugging

```bash
# Run single test file
npm test -- tests/unit/calculator.test.js

# Run single test case
npm test -- -t "should return error for division by zero"

# Debug mode (Chrome DevTools)
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Debugging

```bash
# Headed mode (see browser)
npx playwright test --headed

# Debug mode (step through)
npx playwright test --debug

# Trace viewer (after failure)
npx playwright show-trace trace.zip
```

## Performance Testing

### Lighthouse Audit

```bash
# Start server
npx http-server . -p 8080 &

# Run Lighthouse
npm run lighthouse

# View report
open lighthouse-report.html

# Target scores:
# Performance: 95+
# Accessibility: 100
# Best Practices: 100
# SEO: 100
```

### Manual Performance Testing

**Display Update Latency** (SC-003: <50ms):

```javascript
// Add to ui.js for testing
function measureUpdateLatency() {
  const start = performance.now();
  updateDisplay(state);
  const end = performance.now();
  console.log(`Update latency: ${end - start}ms`);
}
```

## Deployment

### Static Hosting Options

**GitHub Pages** (Free):

```bash
# Push to gh-pages branch
git checkout -b gh-pages
git add index.html styles.css calculator.js ui.js
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Access at: https://[username].github.io/calculator-site/
```

**Netlify** (Free):

```bash
# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod

# Or connect GitHub repo in Netlify dashboard
```

**Vercel** (Free):

```bash
# Deploy via Vercel CLI
npm install -g vercel
vercel --prod
```

### Production Checklist

- [ ] Remove `console.log` statements
- [ ] Minify JavaScript (optional: use Terser)
- [ ] Minify CSS (optional: use cssnano)
- [ ] Enable gzip compression on server
- [ ] Set cache headers (1 year for static assets)
- [ ] Add Content-Security-Policy header
- [ ] Test on real devices (mobile, tablet)
- [ ] Run final Lighthouse audit

## Troubleshooting

### Common Issues

**1. Tests failing with "Cannot find module"**

```bash
# Ensure you're using ES6 modules correctly
# calculator.js:
export function inputNumber(state, digit) { /* ... */ }

# tests:
import { inputNumber } from '../../calculator.js';
```

**2. Display not updating**

```javascript
// Check event listeners are attached
console.log("Button clicked:", event.target);

// Verify state is updating
console.log("New state:", newState);
```

**3. Keyboard input not working**

```javascript
// Check event listener is on document, not specific element
document.addEventListener("keydown", handleKeyDown);

// Verify key mapping
console.log("Key pressed:", event.key);
```

**4. Lighthouse performance score low**

```bash
# Check resource sizes
ls -lh *.js *.css *.html

# Inline critical CSS (move styles to <head>)
# Defer JavaScript loading
```

## Additional Resources

- **MDN Web Docs**: https://developer.mozilla.org/
- **Jest Documentation**: https://jestjs.io/
- **Playwright Documentation**: https://playwright.dev/
- **ESLint Rules**: https://eslint.org/docs/rules/
- **Lighthouse Scoring**: https://web.dev/performance-scoring/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

## Next Steps

1. **Start with P1 User Story**: Implement basic arithmetic operations first
2. **Follow TDD**: Write tests before implementation
3. **Commit Often**: Small, focused commits with descriptive messages
4. **Run CI Locally**: Test everything before pushing
5. **Request Review**: Submit PR when user story complete

**Quickstart Guide Completed**: 2026-01-08
