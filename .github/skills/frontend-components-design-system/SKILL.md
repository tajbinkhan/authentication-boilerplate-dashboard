---
name: frontend-components-design-system
description:
  Build accessible reusable frontend UI with existing component libraries, design tokens, local
  styling conventions, and polished interaction states. Use when creating or refactoring components,
  composing design-system primitives, styling layouts, or improving UI quality.
---

# Frontend Components Design System

Use this skill for UI composition and styling decisions.

## Workflow

1. Inspect existing components in `src/components/`, design tokens, CSS utilities, theme files, and
   component-library setup.
2. Reuse local primitives before adding new abstractions or dependencies. Do not hand-code raw HTML
   controls such as `button`, `select`, `input`, `textarea`, `checkbox`, or `radio` in feature UI
   when a shared component exists.
3. Compose components around clear responsibilities: container, reusable UI pieces, field controls,
   lists, tables, and empty/error states.
4. Make interaction states explicit: hover, focus, active, disabled, loading, selected, error, and
   empty.
5. Ensure icon-only controls have accessible names and tooltips where needed.
6. Keep responsive layout stable with explicit constraints such as grid tracks, min/max widths,
   aspect ratios, and sensible wrapping.
7. Avoid nested cards, decorative clutter, and text that can overflow or overlap.

## Quality Bar

- UI should be keyboard accessible and screen-reader understandable.
- Visual changes should fit the existing product tone instead of imposing a new style.
- Components should be easy to test and reuse without dragging in unrelated feature logic.


