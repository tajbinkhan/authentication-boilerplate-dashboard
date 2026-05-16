---
name: frontend-error-feedback
description:
  Standardize frontend loading, empty, error, unauthorized, retry, toast, inline validation, and
  error-boundary behavior. Use when implementing user feedback, handling failed API calls, adding
  mutation responses, or reviewing unhappy-path UX.
---

# Frontend Error Feedback

Use this skill for user-visible feedback and failure modes.

## Workflow

1. Identify existing feedback primitives: toast, alert, banner, inline error, skeleton, spinner,
   empty state, boundary, or route-level error file.
2. Match feedback placement to the failure: field errors near fields, form errors near submit, page
   errors near content, global failures in global surfaces.
3. Provide actionable recovery when possible: retry, refresh, sign in, request access, undo, or edit
   invalid fields.
4. Keep error messages specific enough to help without exposing secrets, stack traces, or internal
   implementation details.
5. Handle loading and empty states intentionally instead of leaving blank content.
6. Ensure feedback is accessible to keyboard and assistive technology users.

## Review Checks

- Mutations should show fast feedback and clear final status.
- Unauthorized and forbidden states should not look like generic crashes.
- Error boundaries should protect meaningful UI regions without hiding recoverable inline errors.
