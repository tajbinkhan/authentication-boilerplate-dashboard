---
name: frontend-local-components
description: Require use of shared frontend components from src/components instead of raw HTML control primitives in feature UI. Use when building or reviewing buttons, inputs, selects, radio groups, checkboxes, dialogs, menus, tables, tabs, forms, and other reusable UI so local design-system components are imported and composed consistently.
---

# Frontend Local Components

Use this skill whenever a feature needs UI controls or reusable interface primitives.

## Workflow

1. Inspect `src/components/` before creating or hand-coding UI controls.
2. Import matching local components for common primitives such as buttons, inputs, textareas, selects, radio groups, checkboxes, switches, dialogs, popovers, dropdowns, tables, tabs, pagination, alerts, skeletons, spinners, badges, and cards.
3. Do not use raw HTML controls such as `button`, `select`, `input`, `textarea`, `checkbox`, or `radio` directly in feature UI when a shared component exists.
4. Use raw semantic HTML for document structure and accessibility landmarks such as `main`, `section`, `header`, `nav`, `ul`, `li`, `p`, and headings.
5. Use raw control elements only inside shared component implementations or when no local component exists; if the primitive will be reused, create or extend a component under `src/components/` first.
6. Preserve the local component API and styling conventions instead of wrapping components in feature-specific one-off abstractions.

## Review Checks

- Feature files should import shared controls instead of creating raw control markup.
- Form fields should compose local field, label, input, select, checkbox, radio, and error components when available.
- New shared components should remain generic enough for reuse and should keep accessibility behavior built in.
