---
name: "Frontend UI Quality Standards"
description:
  "Use when implementing or reviewing UI components, styles, layouts, design-system composition,
  visual states, responsive behavior, and accessibility."
applyTo:
  - "src/**/*.{tsx,jsx,vue,svelte,astro,css,scss,less}"
  - "components/**/*.{tsx,jsx,vue,svelte,css,scss,less}"
  - "app/**/*.{tsx,jsx,css,scss,less}"
  - "pages/**/*.{tsx,jsx,css,scss,less}"
---

# Frontend UI Quality Standards

Apply these rules to visible frontend UI.

## Design System

- Reuse existing components from `src/components/`, tokens, utilities, and icon libraries before
  creating new primitives.
- Keep visual changes consistent with the product's current density, spacing, radius, color, and
  typography.
- Do not add decorative complexity unless it directly supports the requested experience.

## Accessibility

- Use semantic HTML for structure and accessibility, but do not hand-code raw HTML controls such as
  `button`, `select`, `input`, `textarea`, `checkbox`, or `radio` in feature UI when matching
  shared components exist in `src/components/`.
- Ensure all interactive elements are keyboard accessible and have visible focus states.
- Give icon-only buttons accessible names.
- Connect form labels, descriptions, and errors to their controls.
- Give dialogs and major overlays clear titles and focus behavior.

## Responsive Quality

- Verify layout at mobile and desktop widths.
- Prevent text, buttons, controls, and overlays from overlapping or overflowing.
- Use stable sizing constraints for repeated UI, media, tables, toolbars, and cards.
- Include loading, empty, disabled, selected, hover, focus, and error states when relevant.

