# Implementation Plan: Vanilla JavaScript Calculator

**Branch**: `001-calculator-site` | **Date**: 2026-01-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-calculator-site/spec.md`

## Summary

Build a web-based calculator with vanilla HTML, CSS, and JavaScript supporting basic arithmetic operations (addition, subtraction, multiplication, division), decimal numbers, keyboard input, and clear functions. The calculator provides a visual button interface with real-time display updates and handles edge cases like division by zero and invalid input. This is a static, client-side application with no backend dependencies, prioritizing fast load times (<500ms) and responsive design (320px-1920px).

## Technical Context

**Language/Version**: JavaScript ES6+ (ECMAScript 2015+), HTML5, CSS3  
**Primary Dependencies**: None (vanilla implementation - no frameworks or libraries)  
**Storage**: N/A (no data persistence required)  
**Testing**: Jest for unit tests, Playwright or Cypress for integration tests  
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Single static web application  
**Performance Goals**:

- Page load <500ms (First Contentful Paint <1.5s, Time to Interactive <3.5s)
- Display updates <50ms after user input
- Calculator operations execute instantaneously (<10ms)

**Constraints**:

- Vanilla JavaScript only (no frameworks: React, Vue, Angular, etc.)
- No build tools required (no webpack, babel, etc.) for initial version
- Works offline after initial page load
- Responsive design (320px mobile to 1920px desktop)
- Keyboard accessible (WCAG AA standards)

**Scale/Scope**:

- Single HTML page with embedded CSS and JavaScript
- ~15 functional requirements
- 4 prioritized user stories (P1-P4)
- 20 interactive UI elements (10 number buttons + 4 operators + 6 function buttons)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Before Phase 0 Research

- [x] **User stories prioritized and independently testable**: ✅ 4 user stories (P1: Basic Arithmetic, P2: Clear Functions, P3: Decimals, P4: Keyboard) - each independently deliverable
- [x] **Performance requirements defined**: ✅ Defined in spec (SC-001 to SC-008) and Technical Context above
- [x] **Security requirements identified**: ✅ Input validation (FR-010), no external dependencies = minimal attack surface, Snyk scanning for vanilla JS

### Code Quality Principle Compliance

- **Zero Critical/High Security Issues**: Will run Snyk Code scan on JavaScript implementation
- **Linting & Formatting**: Will use ESLint (standard config) + Prettier for JavaScript/HTML/CSS
- **Code Review Required**: Standard PR review process applies
- **Idiomatic & Maintainable**: Vanilla JS best practices, clear function names, comments for calculation logic
- **Dependency Hygiene**: N/A - zero dependencies by design (FR-015)

### Testing Standards Compliance

- **Test-First Workflow**: TDD required - write tests for calculator operations before implementation
- **Coverage Requirements**: Target 90%+ (all calculation logic is business logic)
- **Test Types Required**:
  - Unit tests: Calculator state management, arithmetic operations, input validation
  - Integration tests: UI interactions (button clicks), keyboard events, display updates
  - Contract tests: N/A (no APIs in static site)
- **Test Quality**: Fast unit tests (<1s suite), deterministic, isolated
- **Edge Cases**: Tests for division by zero, multiple decimals, operator chaining, large numbers (per spec edge cases)

### UX Consistency Compliance

- [x] **User Stories Required**: ✅ 4 prioritized stories with clear priorities
- [x] **Acceptance Criteria**: ✅ Given-When-Then scenarios for all stories (16 acceptance scenarios total)
- **Error Handling**: Display "Error" message for division by zero (user-friendly, no technical jargon)
- **Response Times**: <50ms display updates (exceeds 200ms requirement)
- **Accessibility**: Keyboard navigation support (FR-011), semantic HTML for screen readers, ARIA labels
- [x] **Independent MVP Slices**: ✅ P1 story (Basic Arithmetic) is fully functional standalone calculator

### Performance Requirements Compliance

- **Response Time Targets**: N/A (no API endpoints - client-side only)
- **Resource Constraints**: Minimal (static HTML page, <100KB total size)
- **Scalability**: N/A (single-user client-side application)
- **Database Performance**: N/A (no database)
- **Frontend Performance**: ✅ Targets defined in spec (SC-002: <500ms load, SC-003: <50ms updates)
- **Performance Testing Required**: Lighthouse audits for FCP/TTI, manual testing for display update latency

**GATE STATUS**: ✅ **PASSED** - All constitution requirements satisfied for vanilla JavaScript calculator

## Project Structure

### Documentation (this feature)

```text
specs/001-calculator-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
calculator-site/
├── index.html           # Main HTML file with calculator UI
├── styles.css           # Styling for calculator layout and design
├── calculator.js        # Core calculator logic (state management, operations)
├── ui.js                # UI event handlers (button clicks, keyboard)
└── README.md            # Setup and usage instructions

tests/
├── unit/
│   ├── calculator.test.js      # Unit tests for calculation logic
│   └── validation.test.js      # Unit tests for input validation
└── integration/
    └── ui-interactions.test.js # Integration tests for UI + calculator logic

.github/
└── workflows/
    └── ci.yml           # GitHub Actions: ESLint, Prettier, Jest, Lighthouse

config/
├── .eslintrc.json       # ESLint configuration
├── .prettierrc.json     # Prettier configuration
└── jest.config.js       # Jest test configuration
```

**Structure Decision**: Single static web application structure selected. The calculator is a self-contained client-side app with no backend, so we use a simple flat structure with HTML, CSS, and JavaScript files in the root. Tests are separated by type (unit vs integration) to maintain clarity. Configuration files are grouped in a config/ directory to avoid root clutter.

**Rationale**:

- **No src/ directory needed**: Simple enough to keep source files at root level
- **Separation of concerns**: calculator.js (logic), ui.js (DOM interactions), styles.css (presentation)
- **Test organization**: Mirrors constitution requirements (unit + integration tests)
- **CI/CD ready**: GitHub Actions workflow for automated quality gates

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - constitution fully satisfied.

## Phase 0: Research & Technical Decisions

**Status**: ✅ Complete

**Output**: [research.md](research.md)

**Summary**: Resolved 8 technical questions covering testing frameworks (Jest + Playwright), code quality tools (ESLint + Prettier), state management pattern (pure functions with single state object), decimal handling (JavaScript Number with rounding), keyboard events (global keydown listener), responsive design (CSS Grid with breakpoints), error handling (display "Error" string), and performance optimization (no build step, inline critical CSS).

**Key Decisions**:

- **Testing**: Jest (unit) + Playwright (integration) for comprehensive coverage
- **Code Quality**: ESLint (eslint:recommended) + Prettier for consistency
- **State Management**: Finite state machine with pure functions (testable, predictable)
- **Performance**: No build tools initially, <20KB total size target

## Phase 1: Design & Contracts

**Status**: ✅ Complete

**Outputs**:

- [data-model.md](data-model.md) - Complete state machine definition
- [contracts/ui-spec.md](contracts/ui-spec.md) - UI/UX contract
- [quickstart.md](quickstart.md) - Development setup guide

### Data Model Summary

**State Structure**: CalculatorState type with 6 properties (displayValue, previousOperand, operator, waitingForOperand, calculationComplete, isError)

**Core Operations**: 6 pure functions

- `inputNumber(state, digit)` - Handle number input with leading zero logic
- `inputDecimal(state)` - Add decimal point (prevent duplicates)
- `inputOperator(state, operator)` - Select operator and enable chaining
- `calculate(state)` - Perform arithmetic with division-by-zero check
- `clear(state)` - Reset display only
- `clearAll(state)` - Reset to initial state

**State Machine**: 5 states with defined transitions

1. Initial → Entering First Operand (on number input)
2. Entering First Operand → Operator Selected (on operator input)
3. Operator Selected → Entering Second Operand (on number input)
4. Entering Second Operand → Result Displayed (on equals)
5. Result Displayed → Initial (on clear all)

**Validation Rules**:

- Strip leading zeros from integers
- Allow only one decimal point per number
- Division by zero returns "Error" state
- Maximum 12 digits display (scientific notation for overflow)

### UI Contract Summary

**HTML Structure**: Semantic markup with calculator container

- Display element (#display) with ARIA live region
- 4×5 button grid (20 buttons total)
- Button attributes: data-action, data-value for event handling

**Layout Specifications**:

- Desktop: 400px max width, 80×60px buttons
- Mobile: 100% width, 44×44px touch targets (WCAG AA)
- CSS Grid for responsive 4×5 button layout

**Visual Design**:

- Color scheme: Dark display (#222), orange operators (#ff9500), green equals (#4caf50)
- Typography: Courier New monospace for display, Segoe UI for buttons
- Responsive font sizes: 32px desktop, 24px mobile

**Event Contracts**:

- Click handlers: Read data-action/data-value attributes
- Keyboard handlers: Map keys to actions (0-9, +/-/\*/÷, Enter, Escape, Backspace)
- Display updates: <50ms latency, textContent (not innerHTML)

**Accessibility**:

- ARIA labels on all buttons
- aria-live="polite" on display for screen readers
- Keyboard navigation support (no mouse required)
- WCAG AA contrast ratios (4.5:1)

### Quickstart Guide Summary

**Development Environment**:

- Node.js 18+ (for testing tools only)
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- VS Code with ESLint + Prettier extensions recommended

**Quick Start Commands**:

```bash
npm install --save-dev jest playwright eslint prettier
npm run test:watch  # TDD workflow
npx http-server . -p 8080  # Local dev server
```

**TDD Workflow** (Constitution Requirement):

1. Write failing test
2. Run test (verify failure)
3. Write minimal code to pass
4. Test passes → Refactor
5. Repeat

**Pre-Commit Checklist**:

- [ ] `npm run lint` passes (zero errors)
- [ ] `npm test` passes (all tests green)
- [ ] `npm run test:coverage` meets 90%+ threshold
- [ ] `npx snyk code test .` clean (zero critical/high)
- [ ] Code review approved

**Deployment Options**: GitHub Pages, Netlify, or Vercel (all free for static sites)

## Phase 1: Constitution Check (Re-evaluation)

_GATE: Final check after design artifacts complete_

- [x] **Data model supports all FRs**: ✅ State machine handles all 15 functional requirements
- [x] **UI contract matches user stories**: ✅ All 4 user stories covered (Basic Arithmetic, Clear, Decimals, Keyboard)
- [x] **Performance contracts defined**: ✅ <50ms display updates, <20KB total size, <500ms FCP target
- [x] **Accessibility requirements met**: ✅ WCAG AA compliance (ARIA labels, keyboard navigation, contrast ratios, 44×44px touch targets)
- [x] **Testing strategy complete**: ✅ Jest unit tests (90%+ coverage), Playwright integration tests, TDD workflow documented
- [x] **Security considerations addressed**: ✅ Input validation in state machine, textContent (prevents XSS), zero dependencies = minimal attack surface

**GATE STATUS**: ✅ **PASSED** - All design artifacts satisfy constitution requirements

## Next Steps

**Command**: `/speckit.tasks` - Generate task breakdown

**Handoff Notes for Task Generation**:

1. **User Story Order**: Implement in priority order (P1 → P2 → P3 → P4)

- P1 (Basic Arithmetic): Highest priority - delivers core value
- P2 (Clear Functions): Essential functionality
- P3 (Decimal Support): Important for precision
- P4 (Keyboard Input): UX enhancement

2. **Task Breakdown Approach**:

- Per user story: Setup → Tests → Implementation → Review cycle
- Start with data model (calculator.js) before UI (ui.js)
- TDD workflow: Write test → Implement → Refactor

3. **Technical Foundation Tasks** (before P1):

- Project setup (npm init, install dev dependencies)
- Configuration files (ESLint, Prettier, Jest)
- CI/CD pipeline (GitHub Actions workflow)
- HTML/CSS skeleton (index.html, styles.css)

4. **Testing Milestones**:

- Unit tests: After each calculator.js function
- Integration tests: After each user story completes
- Performance tests: After P4 (full feature set)

5. **Constitution Gates**:

- Run Snyk scan before each PR merge
- Verify 90%+ coverage before user story completion
- Lighthouse audit after P4 (performance validation)

**Artifacts Ready**:

- ✅ research.md (8 technical decisions documented)
- ✅ data-model.md (state machine + 6 operations)
- ✅ contracts/ui-spec.md (HTML, CSS, event contracts)
- ✅ quickstart.md (dev setup + TDD workflow)

**Planning Phase Complete**: 2026-01-08
