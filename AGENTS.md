# AGENTS.md

## Project Overview

This is a Next.js project. AI agents should inspect the repository before making changes and follow
the existing patterns, folder structure, and coding style.

Keep changes focused, avoid unrelated refactors, and preserve user changes.

## General Rules

- Read `package.json` before assuming versions, scripts, or dependencies.
- Follow the existing App Router or Pages Router structure.
- Prefer small, safe changes over large rewrites.
- Do not introduce new libraries unless required.
- Do not change architecture without approval.
- Do not expose secrets or environment variables to the client.
- Never commit `.env` files.

## Next.js Rules

- Prefer Server Components by default.
- Use `"use client"` only when state, effects, browser APIs, event handlers, or client hooks are
  required.
- Keep client boundaries as small as possible.
- Do not import server-only code into Client Components.
- Use `app/api` Route Handlers only when an HTTP boundary is needed.
- Keep `page.tsx` and `layout.tsx` files thin.
- Move feature logic into components, hooks, services, actions, or utilities.
- Validate all external input at server boundaries.
- Do not trust client-side role checks for authorization.

## Folder Structure Guidelines

Common structure:

```text
src/
  app/                 routes, layouts, pages, route handlers
  components/          shared UI components
  features/            feature-based modules
  hooks/               shared hooks
  lib/                 shared utilities and clients
  providers/           app-level providers
  styles/              global styles
  types/               shared TypeScript types
  validators/          shared validation schemas
```

Prefer feature-based organization:

```text
features/
  users/
    components/
    hooks/
    actions/
    schemas/
    types/
    utils/
```

## Components

- Reuse existing components before creating new ones.
- Keep components focused and readable.
- Put business logic in hooks or feature utilities.
- Use accessible HTML and proper labels.
- Support loading, empty, error, and disabled states.
- Keep props typed.
- Avoid `any` unless absolutely necessary.

## Data Fetching

- Use the project’s existing data-fetching pattern.
- For server data, prefer Server Components where appropriate.
- For interactive client data, use the existing query/mutation library if present.
- Avoid unnecessary request waterfalls.
- Handle loading, error, unauthorized, and empty states clearly.
- Do not cache sensitive user-specific data without understanding the cache behavior.

## Forms and Validation

- Use the project’s existing form library and validation style.
- Prefer Zod or the existing schema system if already used.
- Validate on both client and server where applicable.
- Disable duplicate submissions.
- Show field-level errors when possible.
- Keep API payload mapping explicit.

## Authentication and Authorization

- Do not weaken auth, session, cookie, CSRF, redirect, or role-check logic.
- UI role checks are not security boundaries.
- Server-side authorization must still be enforced.
- Do not trust client-provided user or role data.
- Keep redirects safe and same-origin.

## Environment Variables

- Server-only secrets must not use `NEXT_PUBLIC_`.
- Only `NEXT_PUBLIC_` variables may be used in browser code.
- Do not log secrets, tokens, cookies, or credentials.
- Update env validation or documentation when adding new variables.

## Styling

- Follow the existing styling system.
- Use Tailwind utilities if the project uses Tailwind.
- Reuse design tokens and shared UI primitives.
- Do not introduce random colors, spacing, or typography.
- Preserve responsive behavior and dark/light mode support if present.

## TypeScript

- Keep exported functions, components, and API responses typed.
- Avoid `any`.
- Prefer inferred types from schemas when available.
- Do not ignore TypeScript errors without a clear reason.

## Commands

Use the commands defined in `package.json`.

Common examples:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm exec tsc --noEmit
```

If the project uses npm or yarn, use that package manager instead.

## Do Not Modify Without Approval

- Authentication/session logic
- Authorization and role logic
- Middleware/proxy logic
- Environment variable contracts
- CI/CD configuration
- Package manager lockfile
- Global styling/theme tokens
- Database schema or migrations
- Large folder restructures
- Generated files
- `.env` files

## Completion Checklist

Before finishing a task, verify:

- The change follows existing project patterns.
- Server and Client Component boundaries are correct.
- No secrets are exposed.
- Inputs are validated where needed.
- Loading, error, empty, and success states are handled.
- TypeScript types are safe.
- Lint/typecheck/build were run when appropriate.
- Only intended files were changed.
- Any skipped checks or assumptions are reported.
