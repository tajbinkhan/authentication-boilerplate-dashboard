---
name: frontend-data-fetching-state
description:
  Handle frontend API clients, server data, async state, cache invalidation, mutations, optimistic
  updates, and separation of client state from server state. Use when integrating APIs, adding
  hooks/loaders/actions, managing cache behavior, or fixing stale/loading data bugs.
---

# Frontend Data Fetching State

Use this skill for API and async state work.

## Workflow

1. Identify the existing data layer: framework loaders/actions, fetch wrappers, TanStack Query, SWR,
   Apollo, Redux Toolkit Query, custom hooks, or direct fetch.
2. Preserve typed boundaries between remote data, view models, form values, and component props.
3. Keep server state in the server-data tool already used by the app. Keep transient UI state local
   unless it must be shared.
4. Define loading, success, empty, error, unauthorized, and retry behavior for each user-visible
   data dependency.
5. For mutations, plan invalidation, optimistic updates, rollback, duplicate-submit prevention, and
   user feedback.
6. Do not leak secrets or privileged headers into browser code.
7. Prefer stable query keys, cache scopes, and adapter functions where the existing stack supports
   them.

## Review Checks

- Data fetching should not waterfall accidentally when parallel fetching is possible.
- Components should not parse unstable API shapes directly when a mapper or adapter exists.
- Cache invalidation should update every visible view affected by the mutation.
