---
name: "Frontend Data And Forms Standards"
description:
  "Use when implementing or reviewing frontend API clients, loaders, hooks, mutations, cache
  behavior, forms, validators, URL state, and client/server state boundaries."
applyTo:
  - "src/**/*.{ts,tsx,js,jsx}"
  - "app/**/*.{ts,tsx,js,jsx}"
  - "pages/**/*.{ts,tsx,js,jsx}"
  - "components/**/*.{ts,tsx,js,jsx}"
---

# Frontend Data And Forms Standards

Apply these rules to data fetching, mutations, forms, and state.

## Data Boundaries

- Use the project's existing API client, loader/action, query, or server-function pattern.
- Keep API response parsing and mapping outside presentational components when the data shape is
  non-trivial.
- Separate server state from local UI state.
- Keep query keys, cache scopes, invalidation, and refetch behavior stable where a caching library
  is used.
- Handle loading, empty, error, unauthorized, retry, and success states explicitly.

## Forms

- Use the project's existing form and validation libraries when present.
- Keep form values, validation schema, and API payload mapping explicit.
- Provide defaults for all controlled fields.
- Disable duplicate submissions and surface submission state quickly.
- Map field-level server errors to fields and cross-field failures to a form-level message.
- Preserve user input after recoverable errors.

## URL State

- Store shareable filters, tabs, search terms, sorting, and pagination in the URL when users need
  reload, back/forward, or share behavior.
- Parse invalid params safely and fall back to documented defaults.
- Keep URL state synchronized with data-fetching keys when it affects fetched data.
