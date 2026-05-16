---
name: frontend-forms-validation
description:
  Implement frontend forms with schema validation, accessible fields, default values, submission
  state, server error mapping, and user feedback. Use when building create/edit/search forms,
  validating inputs, integrating form libraries, or fixing form UX and error handling.
---

# Frontend Forms Validation

Use this skill for form-heavy UI.

## Workflow

1. Detect existing form and validation tools before choosing a pattern.
2. Model values separately from API payloads when the UI shape differs from the backend contract.
3. Define default values, validation timing, disabled/submitting state, cancel/reset behavior, and
   dirty-state expectations.
4. Use shared field and control components from `src/components/` when available, then connect every
   label, input, description, and error message accessibly.
5. Map server validation errors to fields when possible and show form-level errors for cross-field
   or unexpected failures.
6. Prevent duplicate submissions and preserve user-entered values after recoverable errors.
7. Add regression tests for validation, successful submission, server error display, and
   disabled/loading behavior when a test framework exists.

## Review Checks

- Required fields, optional fields, coercion, trimming, and date/number handling should be explicit.
- Client validation should improve UX but not replace server validation.
- Form components should not own unrelated data-fetching or routing concerns.

