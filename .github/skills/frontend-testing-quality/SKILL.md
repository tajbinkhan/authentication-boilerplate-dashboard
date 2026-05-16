---
name: frontend-testing-quality
description:
  Define and run frontend unit, component, integration, end-to-end, lint, typecheck, and build
  verification based on available scripts and risk. Use when adding tests, reviewing coverage,
  choosing validation commands, or preventing frontend regressions.
---

# Frontend Testing Quality

Use this skill to choose meaningful frontend verification.

## Workflow

1. Inspect available scripts and test tooling before proposing commands.
2. Match test level to risk: unit for pure logic, component for UI states, integration for data/form
   flows, end-to-end for critical user journeys.
3. Prefer regression tests near the behavior being changed.
4. Test accessibility-critical behavior such as labels, keyboard actions, focus, disabled state, and
   error messages when tooling supports it.
5. Avoid brittle tests that assert implementation details, styling internals, or exact markup
   without user value.
6. Run the smallest useful checks during development, then broader checks before handoff when
   feasible.
7. Report checks run, skipped checks, failures, and likely pre-existing issues clearly.

## Common Checks

- Lint for static correctness and project rules.
- Typecheck for contract and strict TypeScript issues.
- Unit/component/integration tests for behavior.
- Build for bundling, route, rendering, and framework errors.
