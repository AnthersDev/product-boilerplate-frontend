# AGENTS.md

Playbook for AI coding agents (Cursor, Copilot, Claude, PR bots, etc.). **Developers and maintainers:** attach or `@`-mention this file when starting agent work, and **update it in the same PR** whenever you add routes, features, APIs, env vars, or change architecture so the next agent session stays accurate.

Humans still own product intent. For human onboarding see [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md). Deep design notes live under [docs/](./docs/).

---

## How to use this file

| Who | How |
| --- | --- |
| **Developer** | Start an agent chat with this file in context. Describe the feature; expect the agent to follow the patterns below and extend the “Current map” when it lands new surface area. |
| **Maintainer** | Same, plus keep template CI / Node / Anthers / mock contracts in sync. When regenerating apps from this template, this file should ship with the product so their agents inherit the rules. |
| **Agent** | Treat this as mandatory project policy. Prefer existing Anthers + feature patterns over new libraries. Do not invent paths or APIs — verify in the repo first. |

After meaningful product changes, update at least: **Current map**, **API / mocks**, and **Changelog for agents** (bottom).

---

## Stack (do not replace without human OK)

| Layer | Choice |
| --- | --- |
| Runtime | Node **24** (`.node-version`, `engines`) |
| App | Vite 6, React 19, TypeScript strict |
| UI | `@marmeto_engineering/anthers-components`, Tailwind 4, Lucide (`strokeWidth` 1.75 typical) |
| Server state | TanStack Query |
| HTTP | Axios — `httpClient` (app) + `authClient` (session only) |
| Routing | `react-router-dom` v7 — `src/routes/AppRoutes.tsx` |
| Auth | HTTP-only cookies; never store access tokens in JS |
| Local backend | Mock adapter `src/services/mocks` (on by default in `npm run dev`) |

Private package: `@marmeto_engineering/anthers-components`. Local: `npm login`. CI: `NPM_TOKEN_READ_ONLY` → `NODE_AUTH_TOKEN`.

---

## Authoritative docs (read, don’t paste wholesale)

| Topic | Source |
| --- | --- |
| Human quickstart / env / routes | [README.md](./README.md) |
| Contribution workflow | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Feature folders | [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) |
| Components / styling | [docs/COMPONENTS_AND_STYLING.md](./docs/COMPONENTS_AND_STYLING.md) |
| State | [docs/STATE_MANAGEMENT.md](./docs/STATE_MANAGEMENT.md) |
| Performance | [docs/PERFORMANCE.md](./docs/PERFORMANCE.md) |
| Build / config | [docs/PROJECT_CONFIGURATION.md](./docs/PROJECT_CONFIGURATION.md) |
| New feature scaffold | [src/features/_feature-template_/](./src/features/_feature-template_/) |

---

## Current map (keep updated)

### Features (`src/features/`)

| Feature | Responsibility |
| --- | --- |
| `auth` | Session, sign-in, organizations, logout hooks/services |
| `home` | Home page data + content |
| `reports` | Reports table columns/types for Anthers `AdvancedDataTable` |
| `_feature-template_` | Copy this when adding a **new** domain — not a live feature |

### Pages / routes

| Path | Page / notes |
| --- | --- |
| `/login` | Magic link + optional Google (`VITE_SSO_APP_ID`) |
| `/select-org` | Org picker |
| `/` | Home |
| `/analytics/reports` | Reports listing |
| `/settings` | Hub → general / users / notifications |
| `/settings/users`, `/settings/users/:id` | User management (Anthers layouts) |
| `/settings/notifications`, `/settings/notifications/:id` | Notifications list + template editor |
| `/whats-new` | Placeholder |
| `/auth/mock-callback` | Mock magic-link only |

Sidebar: `src/config/navigation.ts`. Branding: `src/config/brand.ts`. Shell: `src/layouts/AppShell.tsx`.

### Permissions (mocks / gates)

Examples used today: `settings.userAndPermissions.manage`, `settings.notifications.manage`. Extend mock auth/user handlers when adding gated UI.

### API clients

- **`authClient`** — `/auth/session`, `/auth/refresh-token`, `/auth/logout` only. **No** 401 refresh interceptor.
- **`httpClient`** — everything else. Cookies + CSRF `X-{VITE_APP_NAME}-Request`. One refresh-then-retry on 401; hard expiry → login.
- Envelope shape: `{ status, message, data }` (and often `messageCode`). Parse via existing helpers in `src/services/api`.

### Mock routes (`src/services/mocks/`)

| File | Covers |
| --- | --- |
| `auth-handlers.ts` | SSO, session, refresh, orgs, logout, mock verify/expire |
| `home-handlers.ts` | `GET /home` |
| `user-handlers.ts` | `GET /user` |
| `notification-handlers.ts` | `/notification/`, `/notification-setting`, detail/toggle/preview/test |
| `reports-handlers.ts` | Reports + saved filter views |
| `handlers.ts` | Registers all mock route arrays |

Register new mock modules in `handlers.ts`. Match real backend paths and envelope.

---

## Operating rules for agents

1. **Reuse first** — Prefer Anthers layouts/components and existing features over custom UI kits or new state libraries.
2. **Feature boundaries** — Domain logic in `src/features/<name>`; route screens in `src/pages/...`; export only through `src/features/<name>/index.ts`.
3. **Import from the feature root** — `import { X } from '@/features/foo'`, not deep internal paths from outside the feature.
4. **Typed end-to-end** — No unvetted `any`. Align types with API envelopes and Anthers props.
5. **Auth safety** — Do not put tokens in `localStorage` / `sessionStorage`. Do not attach a refresh interceptor to `authClient`.
6. **Mocks when APIs are new** — Add mock handlers + sample data so `npm run dev` works offline; document endpoints in README if they are part of the public contract.
7. **Env** — Only `VITE_*` in the client. Update `.env.example` + README when adding vars. Never commit secrets.
8. **Dependencies** — Ask before adding packages (especially >1). Prefer what is already in `package.json`.
9. **A11y** — Keep labels, roles, `alt`, keyboard paths; don’t strip aria without replacement.
10. **Scope** — Small, reviewable diffs. No drive-by refactors or unrelated file churn.
11. **Validation** — After code changes run (from app root / `template-vite`):

```sh
npm run type-check
npm run lint
```

Run `npm run build` before claiming production-ready, or when touching Vite/config/auth/bootstrap.

---

## Recipe: add a product feature

1. Copy `src/features/_feature-template_` → `src/features/<domain>/` and trim demos.
2. Add types, service (use `httpClient`), hooks (React Query), components as needed; export via `index.ts`.
3. Add page(s) under `src/pages/...`.
4. Register route(s) in `src/routes/AppRoutes.tsx` inside the correct `RequireSession` / `requireOrganization` tree.
5. Add nav in `src/config/navigation.ts` if it belongs in the sidebar.
6. Add mocks under `src/services/mocks/` and register in `handlers.ts`.
7. Wire permissions if the UI is gated (session permissions + mock user/auth).
8. Update **this file** (Current map + Changelog) and [README.md](./README.md) routes/API tables when the contract is user-facing.

---

## Recipe: settings / Anthers-heavy screens

Settings, users, and notifications already follow Nexus-style Anthers layouts (`SettingListLayout`, `UserListingLayout`, `NotificationPageLayout`, `NotificationDetails`, `GlobalSaveBar`, etc.).

- Pass `apiClient={httpClient}` and real `userPermissions` from session.
- Prefer extending those layouts over rebuilding tables/forms.
- Keep visual language consistent with existing settings pages (Lucide icons, stroke width, spacing).

---

## Recipe: template / boilerplate maintenance (maintainers)

Working in the **boilerplate repo** (not a single product):

- App code under `template-vite/`; CI at repo `.github/workflows/template-ci.yml`.
- Trusted CI needs `NPM_TOKEN_READ_ONLY`; fork CI stubs Anthers — don’t break that split.
- Keep Node 24. Bump Anthers deliberately; smoke login → home → reports → settings (users + notifications).
- Changes that affect generated apps: update README, `.env.example`, **AGENTS.md**, and any workflows under `template-vite/.github/`.

---

## Ask vs refuse

**Ask the human** when: target domain unclear, two patterns conflict, new dependency needed, auth/security behavior would change, or a large redesign is implied.

**Refuse / push back** when asked to: bypass lint/type-check, drop TypeScript safety, store secrets in the client, duplicate an existing Anthers/feature solution, or commit credentials.

---

## Post-change report (agent → human)

- Files touched
- New/changed routes, env vars, mock endpoints
- Dependencies added (or “none”)
- `type-check` / `lint` (and `build` if run) status
- Manual QA steps (which mock emails / screens to click)
- Whether **AGENTS.md** / README were updated
- Deferred work (tests, docs)

---

## Changelog for agents

Record notable capability additions here so future sessions don’t rediscover them blindly. Newest first.

| Date | Change |
| --- | --- |
| 2026-11-13 | Auth: dual clients + CSRF + refresh lock; settings hub; users + notifications (Anthers); reports `AdvancedDataTable`; mocks for auth/home/user/notification/reports; Node 24 |
| — | _Add a row whenever you land a feature agents should know about._ |
