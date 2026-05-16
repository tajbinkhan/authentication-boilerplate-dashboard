---
name: "Frontend Testing Standards"
description:
  "Use when implementing or reviewing frontend tests and when selecting frontend verification
  commands for source, UI, routing, data, forms, and configuration changes."
applyTo:
  - "src/**/*.{test,spec}.{ts,tsx,js,jsx}"
  - "tests/**/*.{ts,tsx,js,jsx}"
  - "e2e/**/*.{ts,tsx,js,jsx}"
  - "src/**/*.{ts,tsx,js,jsx,vue,svelte,astro}"
  - "app/**/*.{ts,tsx,js,jsx}"
  - "pages/**/*.{ts,tsx,js,jsx}"
---

# Frontend Testing Standards

Apply these rules when testing or validating frontend work.

## Test Selection

- Inspect available scripts and test tooling before choosing commands.
- Use unit tests for pure logic, mappers, reducers, validators, and utilities.
- Use component tests for UI states, accessibility labels, interactions, and conditional rendering.
- Use integration tests for form submission, API state, routing, and cache invalidation flows.
- Use end-to-end tests for critical user journeys and browser-only behavior.

## Test Quality

- Test behavior users depend on, not implementation details.
- Cover loading, empty, error, unauthorized, validation, and success states when they are part of
  the change.
- Keep fixtures small and local unless shared factories already exist.
- Avoid brittle snapshots unless the project already uses them intentionally.

## Verification

- Run lint, typecheck, tests, and build when scripts exist and the change warrants them.
- For docs-only or agent-only changes, validate file structure and frontmatter instead of running
  app checks.
- Report commands run, failures, skipped checks, and residual risk clearly.
