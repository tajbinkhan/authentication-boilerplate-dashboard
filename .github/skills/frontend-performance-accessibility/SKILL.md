---
name: frontend-performance-accessibility
description:
  Enforce frontend keyboard support, semantic HTML, responsive layout, bundle awareness, rendering
  performance, and Core Web Vitals-friendly choices. Use when building visible UI, optimizing
  performance, reviewing accessibility, or adding heavy components/assets.
---

# Frontend Performance Accessibility

Use this skill when UX quality, speed, or accessibility matters.

## Workflow

1. Prefer semantic HTML for structure and accessibility, and prefer shared controls from
   `src/components/` over raw native controls in feature UI when matching components exist.
2. Verify keyboard navigation, focus management, visible focus, accessible names, roles, labels, and
   announcements for dynamic feedback.
3. Keep layout responsive with stable dimensions and avoid content overlap at mobile and desktop
   widths.
4. Avoid unnecessary client-side JavaScript, large dependencies, and broad re-renders.
5. Use framework-supported image, font, code-splitting, prefetch, streaming, or lazy-loading
   features when present.
6. Memoize only when it addresses measurable re-render cost or follows a local pattern.
7. Check heavy lists, media, charts, maps, editors, and animations for loading strategy and fallback
   UI.

## Review Checks

- The initial route should not ship code for hidden features unnecessarily.
- Dynamic UI should remain usable with keyboard and assistive tech.
- Performance improvements should preserve correctness and accessibility.

