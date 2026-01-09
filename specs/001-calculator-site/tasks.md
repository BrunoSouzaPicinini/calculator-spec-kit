---
description: "Task list for Vanilla JavaScript Calculator"
---

# Tasks: Vanilla JavaScript Calculator

**Input**: Design documents from `/specs/001-calculator-site/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: TDD required; include test tasks per user story.

## Format: `[ID] [P?] [Story] Description`

- [P]: Can run in parallel (different files, no unmet dependencies)
- [Story]: US1, US2, US3, US4 from spec.md priorities
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

Purpose: Project initialization and scaffolding.

- [x] T001 Create project folders calculator-site/, tests/unit/, tests/integration/, config/, .github/workflows/
- [x] T002 [P] Scaffold calculator-shell in calculator-site/index.html with calculator container, display placeholder, and script/style tags
- [x] T003 [P] Add base styling variables and layout shell in calculator-site/styles.css
- [x] T004 [P] Stub calculator-site/calculator.js and calculator-site/ui.js with exported placeholders for state and UI hooks

---

## Phase 2: Foundational (Blocking Prerequisites)

Purpose: Core infrastructure that must exist before any user story.

- [x] T005 Initialize package.json at repository root with scripts for jest, playwright, lint, format, coverage, lighthouse
- [x] T006 [P] Add devDependencies in package.json for jest, @playwright/test, eslint, prettier, lighthouse, @testing-library/jest-dom
- [x] T007 [P] Create ESLint config in config/.eslintrc.json matching plan rules
- [x] T008 [P] Create Prettier config in config/.prettierrc.json
- [x] T009 [P] Create Jest config in config/jest.config.js with 90% coverage thresholds
- [x] T010 [P] Create CI workflow in .github/workflows/ci.yml to run lint, unit, integration, coverage, lighthouse

Checkpoint: Foundation ready; user story work can begin.

---

## Phase 3: User Story 1 - Basic Arithmetic Operations (Priority: P1) 🎯 MVP

Goal: Users perform addition, subtraction, multiplication, division via buttons.
Independent Test: Click 5, +, 3, = and display shows 8 using UI only.

### Tests for User Story 1 (required for TDD)

- [x] T011 [P] [US1] Add unit tests for inputNumber, inputOperator, calculate basic flows in tests/unit/calculator.test.js
- [x] T012 [P] [US1] Add integration test for button flow 5 + 3 = 8 in tests/integration/ui-interactions.test.js

### Implementation for User Story 1

- [x] T013 [US1] Implement core state machine operations (inputNumber, inputOperator, calculate, clear, clearAll) in calculator-site/calculator.js
- [x] T014 [P] [US1] Build calculator layout with display and 4×5 button grid in calculator-site/index.html per contracts/ui-spec.md
- [x] T015 [P] [US1] Apply base styling (grid layout, typography, colors) in calculator-site/styles.css per contracts/ui-spec.md
- [x] T016 [US1] Wire button click handlers to state functions and display updates in calculator-site/ui.js
- [x] T017 [US1] Add display formatting helper (max 12 digits, scientific notation overflow) in calculator-site/ui.js
- [x] T018 [US1] Document basic usage and button map in calculator-site/README.md

Checkpoint: User Story 1 independently testable via UI buttons.

---

## Phase 4: User Story 2 - Clear and Reset Functions (Priority: P2)

Goal: Users clear current input or reset calculator state.
Independent Test: Enter 123, press C → display shows 0; press AC → display resets and state clears.

### Tests for User Story 2

- [x] T019 [P] [US2] Add unit tests for clear and clearAll behaviors in tests/unit/calculator.test.js
- [x] T020 [P] [US2] Add integration tests for C and AC buttons in tests/integration/ui-interactions.test.js

### Implementation for User Story 2

- [x] T021 [US2] Implement clear and clearAll logic with state flags in calculator-site/calculator.js
- [x] T022 [US2] Wire C/AC buttons and display reset handling in calculator-site/ui.js and calculator-site/index.html

Checkpoint: User Story 2 independently testable after basic arithmetic.

---

## Phase 5: User Story 3 - Decimal Number Support (Priority: P3)

Goal: Users perform calculations with decimal numbers.
Independent Test: Click 3 . 5 + 1 . 2 = shows 4.7 and blocks extra decimals.

### Tests for User Story 3

- [x] T023 [P] [US3] Add unit tests for decimal input and duplicate decimal prevention in tests/unit/calculator.test.js
- [x] T024 [P] [US3] Add integration test for decimal flow 3.5 + 1.2 = 4.7 in tests/integration/ui-interactions.test.js

### Implementation for User Story 3

- [x] T025 [US3] Implement inputDecimal and rounding to 10 decimal places in calculator-site/calculator.js
- [x] T026 [US3] Update decimal button handling and display formatting to ignore multiple decimals in calculator-site/ui.js and calculator-site/index.html

Checkpoint: User Story 3 independently testable with decimal inputs.

---

## Phase 6: User Story 4 - Keyboard Input Support (Priority: P4)

Goal: Users operate calculator via keyboard shortcuts.
Independent Test: Typing 5 + 3 Enter shows 8; Escape clears display.

### Tests for User Story 4

- [x] T027 [P] [US4] Add integration test for keyboard flow 5+3= using Playwright in tests/integration/ui-interactions.test.js
- [x] T028 [P] [US4] Add unit tests for key mapping helper in tests/unit/ui-keyboard.test.js

### Implementation for User Story 4

- [x] T029 [US4] Implement global keydown mapping and action dispatch in calculator-site/ui.js (prevent default for mapped keys)
- [x] T030 [US4] Ensure keyboard accessibility (aria-live display, focus outline, key labels) in calculator-site/index.html and calculator-site/styles.css

Checkpoint: User Story 4 independently testable with keyboard-only interaction.

---

## Phase 7: Polish & Cross-Cutting Concerns

Purpose: Hardening, performance, documentation.

- [x] T031 [P] Update specs/001-calculator-site/quickstart.md and calculator-site/README.md with final shortcuts, test commands, and deployment notes
- [x] T032 [P] Run Lighthouse audit and save report to calculator-site/lighthouse-report.html
- [~] T033 [P] Run Snyk code scan on calculator-site/\*.js and resolve any high/critical findings (BLOCKED: Snyk CLI download fails with TLS certificate error UNABLE_TO_GET_ISSUER_CERT_LOCALLY - requires corporate proxy/CA configuration via NODE_EXTRA_CA_CERTS or HTTP_PROXY environment variables)
- [x] T034 Final refactor, format, and ensure lint/unit/integration suites pass before merge from repository root

---

## Dependencies & Execution Order

- Setup (Phase 1) → Foundational (Phase 2) → User Stories (Phases 3-6) → Polish (Phase 7)
- User story priority order: P1 (US1) → P2 (US2) → P3 (US3) → P4 (US4)
- Each story is independently testable after its phase checkpoint.

## Parallel Opportunities (examples)

- Phase 1: T002, T003, T004 in parallel after T001 completes
- Phase 2: T006-T010 in parallel after T005
- US1 tests can run in parallel: T011 and T012
- US1 layout and styling can run in parallel: T014 and T015
- US2 test tasks T019/T020 in parallel; US3 test tasks T023/T024 in parallel; US4 test tasks T027/T028 in parallel

## Implementation Strategy

- MVP first: Complete Phases 1-3 to deliver a fully working basic arithmetic calculator.
- Incremental: Add clear/reset (Phase 4), decimals (Phase 5), keyboard (Phase 6) sequentially, validating each independently.
- Quality gates: Maintain 90%+ coverage, lint clean, Snyk clean before merging each story; run Lighthouse after Phase 6.
