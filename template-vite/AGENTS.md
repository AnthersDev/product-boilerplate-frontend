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
| `_feature-template_` | Copy this when adding a **new** domain — not a live screen. Sample is `GET /examples` via `httpClient`, React Query, and `exampleMockRoutes` |

### Pages / routes

| Path | Page / notes |
| --- | --- |
| `/login` | Magic link + optional Google (`VITE_SSO_APP_ID`) |
| `/select-org` | Org picker |
| `/` | Home |
| `/analytics/reports` | Reports listing |
| `/registration` | Vendor registration demo — Anthers `PageLayout` + `FormPreviewPage`; sample JSON `src/pages/registration/vendor-registration-form.ts` (Company → Brand → Bank → Contact). Chromatic: Form Preview In App Layout / Vendor Registration |
| `/settings` | Hub → general / users / notifications |
| `/settings/users` | User list (`UserListingLayout`) |
| `/settings/users/create` | Add user (`UserCreationLayout`) — register **before** `:id` |
| `/settings/users/:id` | User details (`UserDetailsLayout`) |
| `/settings/notifications`, `/settings/notifications/:id` | Notifications list + template editor |
| `/whats-new` | Placeholder |
| `/auth/mock-callback` | Mock magic-link only |
| `*` | **Page not found** (`src/pages/NotFound.tsx`) — public when signed out, in `AppShell` for organization sessions; base sessions go to `/select-org`; never Home |

Sidebar: `src/config/navigation.ts`. Branding: `src/config/brand.ts`. Shell: `src/layouts/AppShell.tsx`.

### Analytics (optional)

| Tool | Env key | Code |
| --- | --- | --- |
| PostHog | `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` (+ optional `VITE_PUBLIC_POSTHOG_HOST`) | `src/libs/analytics/posthog.ts` |
| Intercom | `VITE_INTERCOM_APP_ID` (+ optional `VITE_INTERCOM_API_BASE`) | `src/libs/analytics/intercom.ts` |

Wired by `AnalyticsProvider`. **No key → no-op** (Ping / Nexus pattern). Do not hard-require these packages at runtime when keys are missing.

### Permissions (mocks / gates)

Examples used today: `settings.userAndPermissions.manage`, `settings.notifications.manage`. Extend mock auth/user handlers when adding gated UI.

| Helper | Use for |
| --- | --- |
| `PermissionGuard` (`src/components/PermissionGuard`) | Hide buttons (`fallback="hidden"`, default) or block pages (`fallback="denied"` → Anthers `AccessDenied`) |
| `useHasPermission` (`@/features/auth`) | Imperative boolean checks |

Home shows a sample **Manage users** button gated on `settings.userAndPermissions.manage`. Prefer `PermissionGuard` over ad-hoc `session.permissions.includes` in JSX.

### API clients

- **`authClient`** — `/auth/session`, `/auth/refresh-token`, `/auth/logout` only. **No** 401 refresh interceptor.
- **`httpClient`** — everything else. Cookies + CSRF `X-{VITE_APP_NAME}-Request`. One refresh-then-retry on 401; hard expiry → login.
- Envelope shape: `{ status, message, data }` (and often `messageCode`). Parse via existing helpers in `src/services/api`.

### Mock routes (`src/services/mocks/`)

| File | Covers |
| --- | --- |
| `auth-handlers.ts` | SSO, session, refresh, orgs, logout, mock verify/expire |
| `home-handlers.ts` | `GET /home` |
| `user-handlers.ts` | `GET /user`, `GET /user/permission`, `POST /user`, `GET`/`PUT /user/:id/permission`, `DELETE /user/:id` |
| `notification-handlers.ts` | `/notification/`, `/notification-setting`, detail/toggle/preview/test |
| `reports-handlers.ts` | Reports + saved filter views |
| `handlers.ts` | Registers all mock route arrays |
| `_feature-template_/services/example-mock.ts` | `GET /examples` (copy-me sample, not a product endpoint) |

Register new mock modules in `handlers.ts`. Match real backend paths and envelope. The feature scaffold’s handler is already registered; retarget that line when you copy it.

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

## Recipe: first AI setup — ask where to scaffold, then the product name

**When:** A human asks an AI agent to scaffold, set up, or brand an app, including when they attach this file before the app exists or open a newly scaffolded app.  
**When not:** Manual `create-frontend` / `npx` CLI use — the CLI creates the project in the current directory and does not ask for a display name. Humans edit branding themselves. Do not invent a scaffold folder or a product name without asking.

1. **Ask once where to scaffold** when the app does not exist yet: “Where should I scaffold the app?” Wait for the answer. Do not default to the current directory, a `create-frontend` checkout, or a folder beside one.

   The answer is a folder chain from the user’s home directory. `->` separates folders. Spaces around `->` do not matter. The project folder name is `my-app` unless they name a different one in the same message.

   | They say | Scaffold in |
   | --- | --- |
   | `Desktop` | `~/Desktop/my-app` |
   | `Desktop -> Frontend` | `~/Desktop/Frontend/my-app` |

   Create any missing parent folders. With that parent as the working directory (`~/Desktop` or `~/Desktop/Frontend`), create the app by running:

   ```bash
   npx --yes github:AnthersDev/create-frontend my-app
   ```

   If they named a different project, substitute that name for `my-app`. This downloads the scaffolder from GitHub. A local `create-frontend` repo is not required and must not be cloned, linked, or invoked (`npm link`, `node bin/index.js`, or a sibling checkout). If the command fails because SSH to GitHub is not set up, use `npx --yes git+https://github.com/AnthersDev/create-frontend.git my-app` instead. If the app is already scaffolded and they only asked to brand or change it, skip this question and do not move the project.

2. **Ask once:** “What is the product display name?” (e.g. `Acme Retail`). Wait for the answer.
3. **Fill it everywhere** (keep values identical):

| File | What to set |
| --- | --- |
| `src/config/brand.ts` | `brand.name` |
| `index.html` | `<title>` |
| `vite.config.ts` | `appName` (PWA `name` / `short_name` / `description`) |

4. If they also give a backend/app slug, set `VITE_APP_NAME` in `.env.local` (and document in `.env.example` only if the default should change for the team). That slug is for CSRF + refresh lock — not the marketing title.
5. Optionally align copy defaults that still say “Your organization” / “Your App” (e.g. settings `workspaceName`, notification `senderName`) when those are clearly product-facing placeholders.
6. Do **not** rewrite README/AGENTS just to insert the product name unless the human asked for doc updates.
7. Then continue with install / `npm run dev` / mock sign-in as requested.

Humans adding pages without AI: see [README.md — How to add a new page](./README.md#how-to-add-a-new-page-manual-no-ai).

---

## Recipe: add a page (agent)

Same three touchpoints as the human guide:

1. `src/pages/<Name>.tsx` — prefer Anthers `PageLayout`.
2. Lazy import + `<Route>` under `RequireSession requireOrganization` → `AppShell` in `src/routes/AppRoutes.tsx`.
3. `mainNavItems` entry in `src/config/navigation.ts` (Lucide icon, `strokeWidth` 1.75).

Document every added route in the README route table. When a change updates a user-facing API or environment contract, update the relevant README table. Skip documentation for unrelated changes unless it was requested.

---

## Recipe: multi-section registration / FormPreviewPage

Reference implementation: `src/pages/registration/`.

1. Keep form JSON next to the page (or load from API). Field `type` must use Anthers JSON shape `{ value, label }` (`short_answer`, `paragraph`, `email`, `phone`, `url`, `dropdown`, `file_upload`, `single_checkbox`, etc.).
2. Render with `FormPreviewPage` inside `PageLayout` (optional `responsive={false}` like Nexus previews).
3. `onSubmit` receives transformed form data; Global Save is already provided by `AppLayout`.
4. Prefer Anthers layouts over rebuilding steppers/fields by hand.
5. `npm run clean:demo` clears `vendor-registration-form.ts` to `{ sections: [] }` — restore or replace that JSON when shipping a real form.

---

## Recipe: add a product feature

1. Copy `src/features/_feature-template_` → `src/features/<domain>/`. Keep the `httpClient` service, `queryOptions`, `useQuery` hook, and mock route. Rename them. Do not swap in `useState` for server data.
2. Export via `index.ts`.
3. Add page(s) under `src/pages/...`.
4. Register route(s) in `src/routes/AppRoutes.tsx` inside the correct `RequireSession` / `requireOrganization` tree.
5. Add nav in `src/config/navigation.ts` if it belongs in the sidebar.
6. Update `src/services/mocks/handlers.ts`: replace `exampleMockRoutes` with the new feature routes only while the scaffold's `exampleMockRoutes` is still present. Otherwise, add the new routes while preserving routes for existing features. Update the feature's README with its routes and setup.
7. Wire permissions if the UI is gated (session permissions + mock user/auth).
8. Update **this file** (Current map + Changelog) and the relevant [README.md](./README.md) routes/API/environment tables when the contract is user-facing.

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

**Ask the human** when: first AI setup needs the **scaffold location** or the **product display name**; target domain unclear; two patterns conflict; new dependency needed; auth/security behavior would change; or a large redesign is implied.

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
| 2026-11-17 | First AI setup creates the app with `npx --yes github:AnthersDev/create-frontend my-app` in the chosen parent folder. A local `create-frontend` checkout is not required. |
| 2026-11-17 | First AI setup asks where to scaffold before creating the app. Answers are a home-folder chain: `Desktop` or `Desktop -> Frontend`. |
| 2026-11-17 | Analytics follows signed-in sessions and browser URLs; Intercom loading retries after failures and cancels pending boots on shutdown. Unknown routes select the public or shell 404 by session; registration country choices match available states; settings show filenames from draft values. |
| 2026-11-17 | Registration `/registration`: `FormPreviewPage` + vendor sample JSON (Company/Brand/Bank/Contact); docs + FormPreview recipe. `PermissionGuard`; user management; 404; PostHog/Intercom; AI product-name setup |
| 2026-11-16 | `_feature-template_` sample is `GET /examples`: `httpClient`, React Query, and `exampleMockRoutes` registered in `handlers.ts` |
| 2026-11-13 | Auth: dual clients + CSRF + refresh lock; settings hub; users + notifications (Anthers); reports `AdvancedDataTable`; mocks for auth/home/user/notification/reports; Node 24 |
| — | _Add a row whenever you land a feature agents should know about._ |
