---
name: frontend-architecture-routing
description:
  Choose frontend route structure, server/client boundaries, feature organization, module ownership,
  and navigation architecture based on the detected framework. Use when adding screens, changing
  routing, moving components, splitting features, or deciding where frontend logic belongs.
---

# Frontend Architecture Routing

Use this skill when route, module, or rendering boundaries matter.

## Workflow

1. Detect the framework and router from project files before choosing a pattern.
2. Follow local route naming, layout nesting, file conventions, and feature folder structure.
3. Keep route/page files thin when the framework supports it; move reusable UI, data adapters, and
   business formatting into feature modules.
4. Respect server/client boundaries. Keep secrets, privileged API calls, filesystem access, and
   server-only helpers out of browser code.
5. Put navigation state where users expect it: route params for identity, search params for
   shareable filters, local state for temporary UI.
6. Avoid broad rewrites unless the request is explicitly architectural.

## Framework Notes

- In server-rendered frameworks, prefer server data access and streaming patterns already used by
  the app.
- In client-rendered apps, keep route loaders, hooks, and side effects predictable and testable.
- In multi-page or static apps, preserve progressive enhancement and avoid unnecessary client
  bundles.
