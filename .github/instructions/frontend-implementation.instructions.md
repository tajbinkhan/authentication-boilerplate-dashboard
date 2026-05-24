---
name: "Frontend Implementation Standards"
description:
  "Use when implementing or reviewing frontend source, routes, app files, framework config, build
  config, or TypeScript/JavaScript modules. Enforces stack discovery first, local conventions,
  strict typing where available, and careful framework-specific boundaries."
applyTo:
  - "src/**/*.{ts,tsx,js,jsx,vue,svelte,astro}"
  - "app/**/*.{ts,tsx,js,jsx,vue,svelte,astro}"
  - "pages/**/*.{ts,tsx,js,jsx}"
  - "components/**/*.{ts,tsx,js,jsx,vue,svelte}"
  - "*.{config.ts,config.js,config.mjs,config.cjs}"
---

# Frontend Implementation Standards

Apply these rules when creating or modifying frontend implementation files.

## Discovery First

- Inspect `package.json`, framework config, source layout, local docs, and nearby examples before
  non-trivial edits.
- Use the installed framework version and local docs for APIs that may have changed recently.
- Prefer existing dependencies, aliases, folder structure, and naming conventions.

## Architecture

- Keep routes/pages focused on routing, composition, metadata, loaders, and framework entry
  behavior.
- Move reusable UI, data adapters, mappers, hooks, and validation into feature or shared modules
  following local patterns.
- All business logic — including data fetching, state management, data transformations, API calls,
  and derived computations — must live in hooks under the feature's `hooks/` folder. Components
  should only consume hooks for data and behavior; they must not contain business logic directly.
- Break large feature components into smaller, focused components placed under the feature's
  `components/` folder. Each component should have a single responsibility and be small enough to
  read and understand without scrolling. This keeps larger features maintainable and testable.
- Respect server/client boundaries and do not import server-only modules into browser code.
- Keep public props, API adapter returns, and exported functions typed when TypeScript is available.

## Change Discipline

- Make the smallest change that satisfies the request.
- Avoid unrelated redesigns, dependency additions, global state, or folder restructures.
- Update local guidance only when a change creates or changes reusable conventions.
