# Product boilerplate frontend

Vite + React 19 + TypeScript app template for Marmeto / Anthers product frontends. It ships with cookie-based auth, Anthers UI, React Query, Axios, feature-based folders, and a mock API for local work without a backend.

---

## For developers

Use this section when you are building or extending an app from this template.

### Prerequisites

- Node **24** (see `.node-version`; `fnm use` is enough)
- npm access to the private package `@marmeto_engineering/anthers-components` (ask in `#engineering` for org access)

### Quickstart

```sh
fnm use
npm login --registry=https://registry.npmjs.org/   # once per machine
npm install
npm run dev
```

Open http://localhost:3000. The app starts on the login page. Copy `.env.example` to `.env.local` when you need to override defaults (create-frontend does this for new projects).

`@marmeto_engineering/anthers-components` is private. Local installs use your npm login; CI uses the `NPM_TOKEN_READ_ONLY` secret.

### What’s included

| Area | Stack / location |
| --- | --- |
| UI | React 19, Anthers components, Tailwind 4, Lucide icons |
| Data | Axios (`httpClient` + `authClient`), TanStack Query |
| Auth | Magic link + optional Google SSO, org picker, cookie session + refresh |
| Structure | Feature folders under `src/features/*`, pages under `src/pages/*` |
| Local API | Mock routes in `src/services/mocks` (on by default in `npm run dev`) |

More detail: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md), [docs/](./docs).

### App routes

| Route | Who can open it | What it does |
| --- | --- | --- |
| `/login` | Signed-out users | Email or Google sign-in |
| `/select-org` | Signed-in users | Choose an organization |
| `/` | Signed-in + org | Home (Anthers shell). Mock demos: `?home=empty`, `?home=error` |
| `/analytics/reports` | Signed-in + org | `AdvancedDataTable` listing: search, filters, bulk actions, saved views (including **Empty demo**), row ⋮ menu |
| `/settings` | Signed-in + org | Settings hub (general, users, notifications) |
| `/settings/users` | Signed-in + org | User management list |
| `/settings/users/:id` | Signed-in + org | User detail |
| `/settings/notifications` | Signed-in + org | Notification sender / look & feel / list |
| `/settings/notifications/:id` | Signed-in + org | Notification template editor |
| `/whats-new` | Signed-in + org | Release notes placeholder |
| `/auth/mock-callback` | Mock API only | Stands in for opening the magic link |

Any other path redirects to `/`. Sign out clears the session and sends you to `/login`. Wrap new signed-in routes in `<RequireSession requireOrganization />` in `src/routes/AppRoutes.tsx`. Add sidebar items in `src/config/navigation.ts`. New product domains can start from `src/features/_feature-template_/`.

### Authentication

Sign-in uses Anthers `LoginPage` and `SelectOrganizationPage`. The backend keeps the session in HTTP-only cookies; the app never stores an access token.

- **`authClient`** — session endpoints only (`/auth/session`, `/auth/refresh-token`, `/auth/logout`). No 401→refresh interceptor (avoids refresh loops).
- **`httpClient`** — app APIs. Sends cookies + CSRF header `X-{VITE_APP_NAME}-Request`. On 401 it refreshes once (Web Lock–coordinated across tabs), then retries. Only a 401 response from the refresh endpoint notifies session expiry, clears the session, and redirects to `/login`; other refresh failures, including server and network errors, reject the request without clearing the session.

Code: `src/features/auth`, `src/pages/auth`, `src/services/api`, `src/routes/RequireSession.tsx`.

#### Signing in with mock data

With `npm run dev`, the mock API is on:

- **Google** — Sign in with Google → `demo@example.com`
- **Email** — any email → **Continue with email** → **finish sign-in** in the yellow banner

| Email | Result |
| --- | --- |
| `fail@example.com` | Sign-in error on the login page |
| `one-org@example.com` | One organization, picked automatically |
| `no-orgs@example.com` | “You're not part of any organization yet” |
| `org-error@example.com` | Organizations fail to load (retry) |

Any other email gets three organizations (owner / admin / member). The mock session lives in `sessionStorage` (survives reload, ends when the tab closes). Handlers: `src/services/mocks/auth-handlers.ts`.

#### Connecting your backend

Set in `.env.local`, then restart:

```sh
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://your-api.example/api
VITE_APP_NAME=your-app   # must match backend APP_NAME (CSRF + refresh lock)
# VITE_SSO_APP_ID=...    # required to show Google sign-in
```

Expected auth/session endpoints (envelope `{ status, message, data }`, credentials + CORS):

| Endpoint | Purpose |
| --- | --- |
| `POST /auth/sso` | Send magic link (`{ email, query, redirectUrl }`) |
| `GET /auth/session` | Current session, or 401 when signed out |
| `POST /auth/refresh-token` | Rotate refresh cookie |
| `GET /auth/organization` | Organizations for the user |
| `POST /auth/organization/:organizationId` | Select organization |
| `POST /auth/logout` | End session |
| `GET /home` | Home page payload ([`HomePageDataProps`](./src/features/home/types.ts)) |
| `GET /reports` | Reports listing (`edges` + `pageInfo`; query `q`, `payment_status`, `channel`, `fulfillment_status`, cursors) |
| `GET` / `POST /filter-view` | Listing filters and saved views (`?type=reports`). `PUT` / `DELETE /filter-view/:id` |
| `GET /user` | Users connection (settings → user management) |
| `GET /notification/` | Notifications connection |
| `GET` / `PUT /notification-setting/` | Sender + look & feel |
| `PATCH /notification/:id` | Toggle `isActive` |
| `GET` / `PUT /notification/:id` | Template detail |
| `POST /notification/preview` | Preview HTML |
| `POST /notification/test` | Send test email |

The magic link should land on `/select-org` after cookies are set.

### Branding

Edit `src/config/brand.ts` and replace `public/logo.svg` / `public/login-background.svg` (or point `brand.ts` at other assets). Login logo renders ~64px tall. Brand colour, font, and radius live in `src/theme/theme.css`.

### Environment variables

See [`.env.example`](./.env.example). Only `VITE_*` values are exposed to the browser — never put secrets there.

| Variable | Role |
| --- | --- |
| `VITE_API_BASE_URL` | Axios base URL |
| `VITE_API_TIMEOUT_MS` | Request timeout (default `15000`) |
| `VITE_APP_NAME` | CSRF header + cross-tab refresh lock name |
| `VITE_SSO_APP_ID` | Shows Google SSO when set |
| `VITE_USE_MOCK_API` | Force mocks on/off (`dev` defaults to on) |
| `VITE_MOCK_API_DELAY_MS` | Artificial mock latency |

### Scripts

| `npm run <script>` | Description |
| --- | --- |
| `dev` | App at http://localhost:3000 (`PORT` overrides) |
| `build` | Type-check + production build to `dist/` (mocks off by default) |
| `preview` | Serve `dist/` locally |
| `lint` / `lint:fix` | ESLint |
| `format` | Prettier |
| `type-check` | `tsc --noEmit` |
| `clean:demo` | Strip demo mock data / homepage demo controls |

### Git hooks

Husky runs these locally. ESLint also runs on save (`.vscode/settings.json`).

| Hook | Runs | Typical time |
| --- | --- | --- |
| `pre-commit` | `lint-staged`, then `lint` + `type-check` | a few seconds |
| `pre-push` | `npm run build` | ~15–30s |
| `commit-msg` | Conventional Commits (`commitlint`) | instant |

Fix failures and retry. Skip only in emergencies with `--no-verify`. Generated-app CI usually runs lint + type-check (and often build); it may not mirror every local hook.

### Contributing (app work)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching, commits, and PR checklist. Prefer features under `src/features/<domain>` with pages in `src/pages`.

### AI agents

Hand agents [AGENTS.md](./AGENTS.md) (attach / `@AGENTS.md` in Cursor). It is the living playbook for stack, folder rules, current routes/features, and how to add more. **Update AGENTS.md in the same PR** when you add features, routes, mocks, or env contracts.

---

## For maintainers

Use this section when you maintain **this boilerplate repo** ([AnthersDev/product-boilerplate-frontend](https://github.com/AnthersDev/product-boilerplate-frontend)), its CI, or how product apps are generated from it — not day-to-day feature work inside a single product.

### Repository layout

| Path | Role |
| --- | --- |
| `template-vite/` | The Vite app template (this README lives here and ships with generated apps) |
| `.github/workflows/template-ci.yml` | Boilerplate CI: install, lint, type-check, build against `template-vite` |
| `template-vite/.github/workflows/` | Workflows copied into generated product repos |

Do not treat the checked-out boilerplate as a production app. New product apps should be generated (e.g. via create-frontend / the org’s scaffolder) so branding, env, and package name are set correctly.

### Private package + CI secret

Installs need `@marmeto_engineering/anthers-components`.

- **Local:** `npm login` with a `marmeto_engineering` org account
- **GitHub Actions:** repository secret `NPM_TOKEN_READ_ONLY` (read-only npm token), exposed as `NODE_AUTH_TOKEN` during `npm ci`

Without that secret, trusted CI jobs that install the private package will fail.

### Template CI behavior

`.github/workflows/template-ci.yml` runs on pushes and PRs to `main`:

| Job | When | Behavior |
| --- | --- | --- |
| `template-vite` | Same-repo pushes/PRs | `npm ci` with `NPM_TOKEN_READ_ONLY`, then lint, type-check, build |
| `template-vite-fork` | Fork PRs only | Strips the private dependency, stubs it, then lint / type-check / build so forks never receive the secret |

Concurrency cancels older runs on the same ref. Working directory is always `template-vite`.

### Validating template changes

From `template-vite/`:

```sh
fnm use
npm ci          # or npm install after login
npm run lint
npm run type-check
npm run build
```

Keep Node on **24** (engines + `.node-version`). Bump Anthers only intentionally and smoke-test login, home, settings (users + notifications), and reports.

When you change auth, mocks, or env contracts, update this README, `.env.example`, and [AGENTS.md](./AGENTS.md) in the same PR so generated apps and their agents stay current.

### Docs map

| Audience | Doc |
| --- | --- |
| Developers (humans) | This file + [CONTRIBUTING.md](./CONTRIBUTING.md) + [docs/](./docs) |
| Maintainers (humans) | This section + [docs/GITHUB_SETUP_GUIDE.md](./docs/GITHUB_SETUP_GUIDE.md) |
| Developers & maintainers → AI agents | [AGENTS.md](./AGENTS.md) — provide to the agent; keep the “Current map” and changelog updated as the product grows |

Template issues and PRs: [AnthersDev/product-boilerplate-frontend](https://github.com/AnthersDev/product-boilerplate-frontend).
