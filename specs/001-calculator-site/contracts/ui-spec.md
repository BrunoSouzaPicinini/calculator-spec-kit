# UI Contract: Calculator Interface

**Feature**: Vanilla JavaScript Calculator  
**Created**: 2026-01-08  
**Contract Type**: User Interface Specification

This document defines the visual structure, interactive elements, and behavior contracts for the calculator web interface.

## HTML Structure Contract

### DOM Hierarchy

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Calculator</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="calculator" role="application" aria-label="Calculator">
      <!-- Display Area -->
      <div class="display">
        <div class="display-value" id="display" aria-live="polite">0</div>
      </div>

      <!-- Button Grid -->
      <div class="buttons">
        <!-- Row 1: Clear and operators -->
        <button
          class="button function"
          data-action="clearAll"
          aria-label="Clear all"
        >
          AC
        </button>
        <button class="button function" data-action="clear" aria-label="Clear">
          C
        </button>
        <button class="button operator" data-value="÷" aria-label="Divide">
          ÷
        </button>
        <button class="button operator" data-value="×" aria-label="Multiply">
          ×
        </button>

        <!-- Row 2: Numbers 7-9 and subtract -->
        <button class="button number" data-value="7" aria-label="7">7</button>
        <button class="button number" data-value="8" aria-label="8">8</button>
        <button class="button number" data-value="9" aria-label="9">9</button>
        <button class="button operator" data-value="-" aria-label="Subtract">
          -
        </button>

        <!-- Row 3: Numbers 4-6 and add -->
        <button class="button number" data-value="4" aria-label="4">4</button>
        <button class="button number" data-value="5" aria-label="5">5</button>
        <button class="button number" data-value="6" aria-label="6">6</button>
        <button class="button operator" data-value="+" aria-label="Add">
          +
        </button>

        <!-- Row 4: Numbers 1-3 and equals (spans 2 rows) -->
        <button class="button number" data-value="1" aria-label="1">1</button>
        <button class="button number" data-value="2" aria-label="2">2</button>
        <button class="button number" data-value="3" aria-label="3">3</button>
        <button
          class="button equals"
          data-action="equals"
          aria-label="Equals"
          style="grid-row: span 2"
        >
          =
        </button>

        <!-- Row 5: Zero (spans 2 cols) and decimal -->
        <button
          class="button number zero"
          data-value="0"
          aria-label="0"
          style="grid-column: span 2"
        >
          0
        </button>
        <button
          class="button decimal"
          data-action="decimal"
          aria-label="Decimal point"
        >
          .
        </button>
      </div>
    </div>

    <script src="calculator.js" defer></script>
    <script src="ui.js" defer></script>
  </body>
</html>
```

### Element IDs and Classes

| Element              | ID/Class      | Purpose                              |
| -------------------- | ------------- | ------------------------------------ |
| Calculator Container | `.calculator` | Main wrapper for grid layout         |
| Display              | `#display`    | Shows current value/result           |
| Display Container    | `.display`    | Styling wrapper for display area     |
| Button               | `.button`     | Base class for all buttons           |
| Number Button        | `.number`     | Number buttons (0-9)                 |
| Operator Button      | `.operator`   | Operator buttons (+, -, ×, ÷)        |
| Function Button      | `.function`   | Clear buttons (C, AC)                |
| Equals Button        | `.equals`     | Equals button (=)                    |
| Decimal Button       | `.decimal`    | Decimal point button (.)             |
| Zero Button          | `.zero`       | Special styling for wide zero button |

## Visual Design Contract

### Layout Specifications

**Desktop (>768px)**:

- Calculator width: 400px maximum
- Display height: 80px
- Button size: 80×60px
- Grid gap: 1px
- Grid: 4 columns × 5 rows

**Tablet (480px-768px)**:

- Calculator width: 100% (max 400px)
- Display height: 70px
- Button size: Flexible (grid)
- Grid gap: 1px
- Grid: 4 columns × 5 rows

**Mobile (<480px)**:

- Calculator width: 100vw - 20px
- Display height: 60px
- Button size: Min 44×44px (touch target)
- Grid gap: 1px
- Grid: 4 columns × 5 rows

### Color Scheme

```css
:root {
  /* Display */
  --display-bg: #222;
  --display-text: #fff;
  --display-error: #ff5252;

  /* Buttons */
  --button-bg: #505050;
  --button-text: #fff;
  --button-hover: #606060;
  --button-active: #707070;

  --operator-bg: #ff9500;
  --operator-hover: #ffac33;

  --function-bg: #a0a0a0;
  --function-hover: #b0b0b0;

  --equals-bg: #4caf50;
  --equals-hover: #66bb6a;

  /* Focus */
  --focus-outline: #2196f3;
}
```

### Typography

- **Display Font**: `'Courier New', monospace` (monospaced for number alignment)
- **Display Size**: 32px (desktop), 28px (tablet), 24px (mobile)
- **Button Font**: `'Segoe UI', Tahoma, sans-serif`
- **Button Size**: 18px (desktop), 16px (mobile)
- **Font Weight**: 600 (buttons), 400 (display)

### Accessibility Requirements

**WCAG AA Compliance**:

- Color contrast: 4.5:1 minimum (text to background)
- Focus indicators: 2px solid outline, distinct color
- Touch targets: 44×44px minimum
- ARIA labels: All buttons have descriptive labels
- Keyboard navigation: Full support (see Keyboard Contract below)

## Event Contract

### Button Click Events

All buttons emit events with standardized data attributes:

```javascript
// Number buttons
button.dataset.value = "0-9";
button.classList.contains("number") === true;

// Operator buttons
((button.dataset.value = "+"), "-", "×", "÷");
button.classList.contains("operator") === true;

// Decimal button
button.dataset.action = "decimal";
button.classList.contains("decimal") === true;

// Equals button
button.dataset.action = "equals";
button.classList.contains("equals") === true;

// Clear buttons
button.dataset.action = "clear" | "clearAll";
button.classList.contains("function") === true;
```

### Event Handler Contract

```javascript
// UI event handler signature
function handleButtonClick(event: MouseEvent): void {
  const button = event.target;
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (button.classList.contains('number')) {
    // Handle number input
  } else if (button.classList.contains('operator')) {
    // Handle operator input
  } else if (action) {
    // Handle special actions (clear, decimal, equals)
  }
}
```

## Keyboard Contract

### Key Mappings

| Key            | Action                    | Calculator Button Equivalent |
| -------------- | ------------------------- | ---------------------------- |
| `0-9`          | Input number              | Number buttons 0-9           |
| `.`            | Input decimal             | Decimal point button         |
| `+`            | Input operator (add)      | + button                     |
| `-`            | Input operator (subtract) | - button                     |
| `*`            | Input operator (multiply) | × button                     |
| `/`            | Input operator (divide)   | ÷ button                     |
| `Enter` / `=`  | Calculate                 | = button                     |
| `Escape` / `c` | Clear current             | C button                     |
| `Backspace`    | Clear current             | C button (alternative)       |

### Keyboard Event Contract

```javascript
// Keyboard event handler signature
function handleKeyDown(event: KeyboardEvent): void {
  const key = event.key;

  // Prevent default for calculator keys only
  if (isCalculatorKey(key)) {
    event.preventDefault();
  }

  // Map key to calculator action
  const action = keyToAction(key);

  // Dispatch to appropriate handler
  handleAction(action, key);
}
```

### Focus Management

**Requirements**:

- Calculator doesn't require focus on specific elements (global keyboard listener)
- Focus indicators MUST be visible for keyboard navigation
- Tab order: Top to bottom, left to right
- Focus trap: Not required (single component)

## Display Update Contract

### Display Value Format

```javascript
// Display value rules
const formatDisplay = (value, isError) => {
  if (isError) {
    return "Error";
  }

  if (typeof value === "number") {
    // Round to 10 decimals
    value = Math.round(value * 1e10) / 1e10;

    // Scientific notation for large numbers
    if (Math.abs(value) > 999999999999) {
      return value.toExponential(5);
    }

    return value.toString();
  }

  return value; // Already a string
};
```

### Display Update Timing

- **Update Trigger**: Every state change
- **Update Method**: `textContent` assignment (not `innerHTML`)
- **Animation**: None (instant update for <50ms requirement)
- **Live Region**: Display has `aria-live="polite"` for screen reader announcements

### Display States

| State   | Display Value      | Text Color | Example |
| ------- | ------------------ | ---------- | ------- |
| Initial | `"0"`              | White      | `0`     |
| Input   | Current entry      | White      | `123`   |
| Result  | Calculation result | White      | `8`     |
| Error   | `"Error"`          | Red        | `Error` |

## Button Interaction Contract

### Button States

| State   | Visual Feedback    | CSS Class        |
| ------- | ------------------ | ---------------- |
| Default | Base colors        | `.button`        |
| Hover   | Lighter background | `.button:hover`  |
| Active  | Pressed effect     | `.button:active` |
| Focus   | Blue outline       | `.button:focus`  |

### Haptic Feedback

Not applicable (web application). For future mobile app:

- Light haptic on button press
- Distinct haptic on equals press
- Error vibration on error state

## Responsive Behavior Contract

### Breakpoints

```css
/* Mobile first approach */

/* Small mobile: 320px-479px */
@media (max-width: 479px) {
  .calculator {
    max-width: 100%;
    margin: 10px;
  }
  .button {
    min-height: 44px; /* Touch target */
    font-size: 16px;
  }
  .display-value {
    font-size: 24px;
  }
}

/* Large mobile / Small tablet: 480px-767px */
@media (min-width: 480px) and (max-width: 767px) {
  .calculator {
    max-width: 400px;
    margin: 20px auto;
  }
  .button {
    font-size: 17px;
  }
  .display-value {
    font-size: 28px;
  }
}

/* Tablet and desktop: 768px+ */
@media (min-width: 768px) {
  .calculator {
    max-width: 400px;
    margin: 40px auto;
  }
  .button {
    font-size: 18px;
  }
  .display-value {
    font-size: 32px;
  }
}
```

### Orientation Support

- Portrait: Standard 4×5 grid
- Landscape: Same layout (calculator is compact enough)
- No landscape-specific layout needed

## Performance Contract

### Rendering Performance

- **Button Click Response**: <16ms (1 frame at 60fps)
- **Display Update**: <50ms (per SC-003)
- **Layout Reflow**: Minimize (use transform for animations if added later)
- **Paint Operations**: Single paint per interaction

### Initial Load Performance

- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Resource Size**: <20KB total (HTML + CSS + JS)
- **Render-Blocking**: Inline critical CSS, defer JS

## Error State Contract

### Error Display

```javascript
// Error state rendering
when (state.isError === true) {
  display.textContent = "Error";
  display.style.color = "var(--display-error)";
  display.setAttribute('aria-label', 'Error: Invalid operation');
}

when (state.isError === false) {
  display.style.color = "var(--display-text)";
  display.setAttribute('aria-label', display.textContent);
}
```

### Error Recovery

- **User Action**: Any number input clears error and resets
- **Visual Reset**: Color returns to white, display shows new number
- **State Reset**: `isError=false`, calculator state resets to initial

## Testing Contract

### Visual Regression Tests

- Screenshot comparison for each button state
- Display rendering for various number formats
- Error state display
- Responsive layouts (mobile, tablet, desktop)

### Interaction Tests

- Button click produces expected visual feedback
- Display updates immediately after button press
- Keyboard input matches button input
- Focus indicators visible during keyboard navigation

### Accessibility Tests

- ARIA labels present and accurate
- Color contrast meets WCAG AA
- Keyboard navigation functional
- Screen reader announcements appropriate

**UI Contract Completed**: 2026-01-08
