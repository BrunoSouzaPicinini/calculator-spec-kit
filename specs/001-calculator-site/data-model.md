# Data Model: Vanilla JavaScript Calculator

**Feature**: Vanilla JavaScript Calculator  
**Created**: 2026-01-08  
**Status**: Complete

This document defines the data structures and state machine for the calculator application.

## Overview

The calculator uses a **finite state machine** approach with a single centralized state object. All operations are pure functions that take current state and return new state, making the logic testable and predictable.

## Core Entities

### 1. Calculator State

The main state object that represents the current state of the calculator.

```typescript
// TypeScript-style type definition for clarity (implementation is vanilla JS)
type CalculatorState = {
  // Display
  displayValue: string; // Current value shown in display

  // Calculation context
  previousOperand: number | null; // First operand in binary operation
  operator: Operator | null; // Selected operator (+, -, ×, ÷)

  // State flags
  waitingForOperand: boolean; // True after operator pressed
  calculationComplete: boolean; // True after "=" pressed

  // Error state
  isError: boolean; // True when error displayed (e.g., division by zero)
};
```

**Field Descriptions**:

- **`displayValue`**: String representation of what's shown to user
  - Always starts as "0"
  - Updates with each number/decimal input
  - Shows result after calculation
  - Shows "Error" for invalid operations

- **`previousOperand`**: Number stored when operator is pressed
  - `null` when no operator selected
  - Set when user presses operator button
  - Used as first operand in calculation

- **`operator`**: The selected arithmetic operation
  - `null` when no operation in progress
  - One of: `'+'`, `'-'`, `'×'`, `'÷'`
  - Replaced if user presses different operator

- **`waitingForOperand`**: Flag for input handling
  - `true` after operator pressed (next digit starts new number)
  - `false` during number entry
  - Controls whether new digit appends or replaces display

- **`calculationComplete`**: Flag for result state
  - `true` after "=" pressed
  - `false` during input or after clear
  - Next number input resets calculator

- **`isError`**: Flag for error display
  - `true` when error displayed
  - `false` during normal operation
  - Next input clears error and resets

**Initial State**:

```javascript
const initialState = {
  displayValue: "0",
  previousOperand: null,
  operator: null,
  waitingForOperand: false,
  calculationComplete: false,
  isError: false,
};
```

### 2. Operator Type

```typescript
type Operator = "+" | "-" | "×" | "÷";
```

Represents the four supported arithmetic operations. Using Unicode × and ÷ symbols for display (matched in operator button values).

### 3. Button Type

```typescript
type ButtonType =
  | "number" // 0-9
  | "operator" // +, -, ×, ÷
  | "decimal" // .
  | "equals" // =
  | "clear" // C (clear current)
  | "clearAll"; // AC (clear all)
```

Categorizes all calculator buttons for event handling.

## State Machine

### State Transitions

The calculator state machine has the following transitions:

```
[Initial] → (number) → [Entering First Operand]
          → (operator) → [Operator Selected]
          → (number) → [Entering Second Operand]
          → (equals) → [Result Displayed]
          → (clear) → [Initial]

[Error State] → (any input) → [Initial]
```

### Transition Diagrams

#### 1. Number Input

```
Current State → Number Input → New State

displayValue="0", waiting=false
  → digit="5"
  → displayValue="5", waiting=false

displayValue="5", waiting=false
  → digit="3"
  → displayValue="53", waiting=false

displayValue="8", waiting=true (after operator)
  → digit="2"
  → displayValue="2", waiting=false
```

#### 2. Operator Input

```
Current State → Operator → New State

displayValue="5", previousOperand=null, operator=null
  → operator="+"
  → displayValue="5", previousOperand=5, operator="+", waiting=true

displayValue="3", previousOperand=5, operator="+"
  → operator="-" (changing operator)
  → displayValue="3", previousOperand=5, operator="-", waiting=true
```

#### 3. Equals / Calculate

```
Current State → Equals → New State

displayValue="3", previousOperand=5, operator="+"
  → equals
  → displayValue="8", previousOperand=null, operator=null,
     waiting=false, calculationComplete=true
```

#### 4. Clear Operations

```
Clear (C): Clears current input only
  displayValue="123" → C → displayValue="0"

Clear All (AC): Resets to initial state
  Any State → AC → Initial State
```

## Business Logic Functions

### Core Operations

#### 1. `inputNumber(state, digit)`

Handles number button press (0-9).

**Logic**:

- If `isError`: Reset to initial state, set display to digit
- If `calculationComplete`: Reset state, set display to digit
- If `waitingForOperand`: Set display to digit, set `waitingForOperand=false`
- If `displayValue === "0"`: Replace with digit (handle leading zeros)
- Else: Append digit to display

**Returns**: New state object

#### 2. `inputDecimal(state)`

Handles decimal point button press.

**Logic**:

- If `isError`: Reset to initial state, set display to "0."
- If `calculationComplete`: Reset state, set display to "0."
- If `waitingForOperand`: Set display to "0.", set `waitingForOperand=false`
- If display already contains ".": Do nothing (FR-010: prevent multiple decimals)
- Else: Append "." to display

**Returns**: New state object

#### 3. `inputOperator(state, operator)`

Handles operator button press (+, -, ×, ÷).

**Logic**:

- If `isError`: Do nothing (error must be cleared first)
- If `previousOperand !== null` and `operator !== null` and `!waitingForOperand`:
  - Perform calculation with current operands (chained operations - FR-013)
  - Set result as new `previousOperand`
- Else:
  - Set `previousOperand` to current display value (parsed as number)
- Set new `operator`
- Set `waitingForOperand=true`
- Set `calculationComplete=false`

**Returns**: New state object

#### 4. `calculate(state)`

Handles equals button press (=).

**Logic**:

- If `isError`: Do nothing
- If `previousOperand === null` or `operator === null`: Do nothing (no operation to perform)
- Get `secondOperand` from current `displayValue`
- Perform operation based on `operator`:
  - `+`: previousOperand + secondOperand
  - `-`: previousOperand - secondOperand
  - `×`: previousOperand × secondOperand
  - `÷`:
    - If secondOperand === 0: Set `displayValue="Error"`, `isError=true`
    - Else: previousOperand ÷ secondOperand
- Set `displayValue` to result (rounded to 10 decimals)
- Set `previousOperand=null`, `operator=null`
- Set `calculationComplete=true`, `waitingForOperand=false`

**Returns**: New state object

#### 5. `clear(state)`

Handles Clear (C) button press.

**Logic**:

- Set `displayValue="0"`
- Keep `previousOperand`, `operator` unchanged (allows resuming operation)
- Set `isError=false`, `calculationComplete=false`, `waitingForOperand=false`

**Returns**: New state object

#### 6. `clearAll(state)`

Handles Clear All (AC) button press.

**Logic**:

- Reset to `initialState`

**Returns**: Initial state object

## Validation Rules

### Number Validation

- **Leading Zeros**: "007" → "7" (handled in `inputNumber`)
- **Decimal Format**: Only one decimal point per number
- **Empty Display**: Never empty, minimum "0"

### Operator Validation

- **Valid Operators**: Only +, -, ×, ÷ accepted
- **Multiple Operators**: Last one wins (5+*3 → treats as 5*3)

### Result Validation

- **Division by Zero**: Returns "Error" state
- **Rounding**: Results rounded to 10 decimal places (SC-005)
- **Large Numbers**: Display in scientific notation if >12 digits
- **Safe Range**: JavaScript Number safe integer range (±9,007,199,254,740,991)

## Data Flow

```
User Input (Button/Keyboard)
  ↓
Event Handler (ui.js)
  ↓
State Update Function (calculator.js)
  ↓
New State
  ↓
Display Update (ui.js)
  ↓
DOM Render
```

**Key Principles**:

1. **Unidirectional Flow**: Data flows one direction (input → state → display)
2. **Pure Functions**: All state updates are pure (no side effects)
3. **Single Source of Truth**: State object is the only source of truth
4. **Immutability**: State updates return new objects (no mutation)

## Example State Evolution

### Calculation: 5 + 3 = 8

```javascript
// Step 1: User clicks "5"
inputNumber(state, "5");
// { displayValue: "5", previousOperand: null, operator: null,
//   waitingForOperand: false, calculationComplete: false, isError: false }

// Step 2: User clicks "+"
inputOperator(state, "+");
// { displayValue: "5", previousOperand: 5, operator: "+",
//   waitingForOperand: true, calculationComplete: false, isError: false }

// Step 3: User clicks "3"
inputNumber(state, "3");
// { displayValue: "3", previousOperand: 5, operator: "+",
//   waitingForOperand: false, calculationComplete: false, isError: false }

// Step 4: User clicks "="
calculate(state);
// { displayValue: "8", previousOperand: null, operator: null,
//   waitingForOperand: false, calculationComplete: true, isError: false }
```

### Chained Calculation: 5 + 3 + 2 = 10

```javascript
// Steps 1-3: Same as above, state ends with displayValue="3"

// Step 4: User clicks "+" (triggers calculation + new operator)
inputOperator(state, "+");
// Calculates 5+3=8, then:
// { displayValue: "8", previousOperand: 8, operator: "+",
//   waitingForOperand: true, calculationComplete: false, isError: false }

// Step 5: User clicks "2"
inputNumber(state, "2");
// { displayValue: "2", previousOperand: 8, operator: "+",
//   waitingForOperand: false, calculationComplete: false, isError: false }

// Step 6: User clicks "="
calculate(state);
// { displayValue: "10", previousOperand: null, operator: null,
//   waitingForOperand: false, calculationComplete: true, isError: false }
```

## Testing Considerations

### Unit Test Coverage

**State Functions** (100% coverage required):

- `inputNumber`: All branches (leading zero, append, replace, error reset)
- `inputDecimal`: All branches (duplicate decimal prevention, error reset)
- `inputOperator`: Chained operations, operator replacement
- `calculate`: All operators, division by zero, rounding
- `clear` / `clearAll`: State reset logic

**Edge Cases** (from spec):

- Division by zero → `isError: true`
- Multiple decimals → Ignore subsequent
- Multiple operators → Last wins
- Large numbers → Scientific notation
- Leading zeros → Strip zeros
- Empty operations → No-op

### Integration Test Coverage

**User Flows**:

- Basic arithmetic (P1 user story)
- Clear/reset functions (P2 user story)
- Decimal support (P3 user story)
- Keyboard input (P4 user story)

## Implementation Notes

1. **No Mutation**: Always return new state objects

   ```javascript
   return { ...state, displayValue: newValue };
   ```

2. **Type Coercion**: Be explicit when converting strings to numbers

   ```javascript
   const num = parseFloat(state.displayValue);
   ```

3. **Rounding**: Use helper function for consistent precision

   ```javascript
   const roundForDisplay = (num) => Math.round(num * 1e10) / 1e10;
   ```

4. **Error Handling**: Always check for division by zero before dividing

**Data Model Completed**: 2026-01-08
