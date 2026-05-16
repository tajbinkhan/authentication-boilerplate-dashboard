---
name: frontend-url-state-navigation
description:
  Manage frontend filters, tabs, search, pagination, sorting, selected views, and deep-linkable UI
  state through router or URL utilities available in the stack. Use when adding shareable state,
  preserving navigation behavior, or fixing query-param and history bugs.
---

# Frontend URL State Navigation

Use this skill for shareable or navigation-sensitive UI state.

## Workflow

1. Identify the router and any URL-state helper already used by the project.
2. Put durable, shareable, or reload-safe state in the URL; keep ephemeral UI state local.
3. Define parameter names, defaults, parsing, serialization, invalid-value handling, and reset
   behavior.
4. Preserve browser history expectations: push for meaningful navigation, replace for noisy updates.
5. Keep pagination, filters, sorting, tabs, and search synchronized with data-fetching keys where
   relevant.
6. Avoid breaking existing links when renaming parameters; support old names only when compatibility
   is required.

## Review Checks

- URLs should remain readable and stable.
- Back/forward navigation should restore the visible state.
- Invalid or missing params should fall back gracefully without throwing in normal navigation.
