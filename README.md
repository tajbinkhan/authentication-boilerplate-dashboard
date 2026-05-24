# Dashboard Boilerplate

A production-ready admin dashboard built with Next.js 16, React 19, TypeScript, and shadcn/ui. Features role-based access control, two-factor authentication, user management, session tracking, audit logging, and system settings.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| UI | shadcn/ui (radix-maia style), Tailwind CSS 4 |
| Icons | Hugeicons |
| Forms | React Hook Form + Zod + @hookform/resolvers |
| Data Fetching | TanStack Query 5 + Axios |
| URL State | nuqs |
| Auth | Custom proxy-based auth with CSRF protection |
| Notifications | Sonner |
| Linting | ESLint 9 + Prettier |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API URL for client-side calls (via proxy) |
| `NEST_API_URL` | Direct backend URL for server-side proxy handler |
| `NEXT_PUBLIC_FRONTEND_URL` | Frontend URL for redirect validation |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

### Development

```bash
pnpm install
pnpm dev
```

The dashboard runs on `http://localhost:3030`.

### Build

```bash
pnpm build
pnpm start
```

### Quality Checks

```bash
pnpm lint          # ESLint
npx tsc --noEmit   # TypeScript type check
pnpm build         # Full production build
```

## Architecture

### Folder Structure

```
src/
├── app/                          # Next.js App Router (thin route files only)
│   ├── (auth)/                   # Auth route group (login, 2fa, magic-link)
│   ├── (dashboard)/              # Protected dashboard route group
│   ├── api/proxy/[...path]/      # API proxy route handler
│   ├── layout.tsx                # Root layout (provider stack)
│   └── globals.css
├── components/
│   ├── ui/                       # 47 shadcn/ui primitives
│   ├── common/table/             # 9 shared data-table components
│   └── layout/                   # Sidebar, header, navigation
├── core/                         # Env validation, helpers, messages
├── features/                     # Feature modules (business logic lives here)
│   ├── audit-logs/
│   │   ├── actions/              # API action functions
│   │   ├── components/           # Feature UI components
│   │   ├── hooks/                # Feature-specific hooks (business logic)
│   │   ├── schemas/              # Zod validation schemas
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Feature utilities
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── sessions/
│   ├── system/
│   └── users/
├── hooks/                        # Global hooks (shared across features)
├── lib/
│   ├── api/                      # API client, error handling, query config
│   ├── client-api.ts             # Client-side Axios instance (CSRF handling)
│   ├── server-api.ts             # Server-side Axios instance (cookie forwarding)
│   └── utils.ts                  # cn() utility
├── providers/                    # React context providers
├── routes/                       # Centralized route definitions
├── server/                       # Server-only functions
└── proxy.ts                      # Next.js 16 proxy (auth routing, header injection)

@types/                           # Global type declarations (ApiResponse, User, etc.)
```

### Conventions

#### Route Pages Are Thin

Route files under `src/app/` contain only metadata, imports, and a single component render:

```tsx
import { UsersPage } from "@/features/users/components/users-page";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Users", description: "..." };

export default function Users() {
  return <UsersPage />;
}
```

#### Business Logic Lives in Hooks

All business logic — data fetching, state management, data transformations, API calls, and derived computations — must live in hooks under the feature's `hooks/` folder. Components consume hooks for data and behavior; they must not contain business logic directly.

```
features/users/
├── hooks/
│   ├── use-user-list.tsx         # List state, filtering, pagination
│   └── use-user-actions.ts       # CRUD mutations, dialog state
├── components/
│   ├── users-page.tsx            # Composition only
│   ├── users-table.tsx           # Table rendering
│   └── user-edit-dialog.tsx      # Dialog UI
└── actions/
    ├── users.actions.ts          # Raw API calls
    ├── users.queries.ts          # TanStack Query wrappers
    └── users.mutations.ts        # TanStack Mutation wrappers
```

#### Components Are Small and Focused

Break large components into smaller, focused components under the feature's `components/` folder. Each component should have a single responsibility and be small enough to read without scrolling.

#### Shared Error Handling

Use `handleRequestError` from `@/lib/api/handle-request-error` for consistent 401 redirect and toast behavior across features.

#### Global vs Feature Hooks

- `src/hooks/` — truly global hooks shared across multiple features (`use-auth`, `use-mobile`, `use-debounced-value`, etc.)
- `src/features/<name>/hooks/` — feature-specific hooks that belong to a single feature

## Auth Flow

1. **Proxy** (`src/proxy.ts`) intercepts every request, checks auth state via `/auth/me`, and:
   - Redirects unauthenticated users to `/login`
   - Redirects 2FA-required users to `/2fa/verify`
   - Redirects authenticated users away from login pages
   - Injects `x-auth-user` header (base64url-encoded user JSON) for authenticated requests

2. **Root Layout** (`src/app/layout.tsx`) decodes the `x-auth-user` header via `getUserFromRequestHeaders()` and passes the user to `AuthProvider`.

3. **AuthProvider** (`src/providers/auth-provider.tsx`) provides the user via React Context.

4. **useAuth** (`src/hooks/use-auth.ts`) hook gives components access to the current user.

## API Client Pattern

- **Client-side:** `src/lib/client-api.ts` — Axios with automatic CSRF token fetching and retry on 403
- **Server-side:** `src/lib/server-api.ts` — Axios with cookie jar for SSR cookie forwarding
- **Unified client:** `src/lib/api/client.ts` — `apiClient<T>()` wraps Axios with error normalization
- **Error handling:** `src/lib/api/errors.ts` — `ApiError` class with `normalizeApiError()`

## API Response Shape

```typescript
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

interface PaginatedData<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

## Rules

All coding conventions are enforced by instruction files in `.github/instructions/`:

- **Frontend Implementation Standards** — architecture, typing, change discipline
- **Frontend UI Quality Standards** — design system, accessibility, responsive quality
- **Frontend Data and Forms Standards** — data boundaries, forms, URL state
- **Frontend Testing Standards** — test selection, quality, verification

Agent rules are in `.github/agents/frontend-coding.agent.md`.

## License

MIT — see [LICENSE](LICENSE) for details.
