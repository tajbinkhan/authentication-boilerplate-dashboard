---
name: frontend-discovery-planning
description:
  Discover frontend stack, project constraints, existing patterns, feature scope, and quality gates
  before implementation. Use before non-trivial frontend work, reviews, migrations, or bug fixes
  where framework, architecture, dependencies, tests, or product intent need to be grounded in the
  repo.
---

# Frontend Discovery Planning

Use this skill to ground frontend work before editing.

## Workflow

1. Inspect the environment first: `package.json`, lockfile, source tree, framework config,
   TypeScript config, styling config, tests, and local agent or instruction files.
2. Identify the actual stack: framework, router, rendering model, styling system, component library,
   data layer, form library, validation library, state tools, and test runner.
3. Find nearby examples for the same kind of change before inventing new structure.
4. Separate discoverable facts from product preferences. Ask only for product intent that cannot be
   inferred safely.
5. Define success criteria: user-visible behavior, accessibility expectations, responsive states,
   data contract, and checks to run.
6. Keep the implementation path small and aligned to existing conventions.

## Output Guidance

- State the detected stack and important local conventions when they affect the work.
- Mention unknowns only when they block implementation or materially change the solution.
- Prefer a short implementation plan for medium or large changes; proceed directly for small
  changes.
