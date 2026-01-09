# Vanilla Calculator

A lightweight, client-side calculator implemented with HTML, CSS, and JavaScript.

## Run locally

```bash
npm install
npm run serve
# open http://localhost:8080
```

You can also open `calculator-site/index.html` directly in a browser.

## Buttons and actions

- Numbers: `0-9` — append digits to the current entry
- Operators: `+`, `-`, `×`, `÷`, `^` — set the pending operation (chained ops supported)
  - `+` and `-` — add or subtract
  - `×` and `÷` — multiply or divide
  - `^` — raise to the power of (exponentiation, e.g., 2^3 = 8, 2^0.5 ≈ 1.41)
- Decimal: `.` — add a decimal point (blocks duplicates)
- Equals: `=` — calculate the result
- Clear: `C` — reset current entry, keep pending operator/operand
- Clear All: `AC` — reset the entire calculator state

## Keyboard shortcuts

- Digits: `0-9`
- Operators: `+`, `-`, `*`/`x` → multiply, `/` → divide, `^` → exponentiate
- Decimal: `.`
- Equals: `Enter` or `=`
- Clear entry: `Escape`
- Clear all: `Delete`

## Tests

```bash
npm run test:unit         # Jest unit tests for calculator state machine
npm run test:integration  # Playwright UI flows (buttons, decimals, keyboard)
npm run test:coverage     # Coverage report (90%+ target)
npm run lighthouse        # Generate lighthouse-report.html (requires http-server)
```
