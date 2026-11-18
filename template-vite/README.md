# Product boilerplate frontend

Vite + React 19 + TypeScript app template for Marmeto / Anthers product frontends. It ships with cookie-based auth, Anthers UI, React Query, Axios, feature-based folders, and a mock API for local work without a backend.

---

## Frontend Project Onboarding & Setup Guide (Developers)

Create a React 19 + Anthers app with authentication and organization switching in under two minutes.

### Before You Start (once per machine)

- **Node.js 24:** check with `node -v`; it should report `v24.x` (`fnm use` reads `.node-version`).
- **npm registry access:** your account needs access to `@marmeto_engineering/anthers-components`. Ask in `#product-frontend-components` if you are not in the organization.
- **npm authentication:** check with `npm whoami --registry=https://registry.npmjs.org/`. If it returns `401 Unauthorized`, run `npm login --registry=https://registry.npmjs.org/`.

### 1. Create the Project

Run the generator outside your main repositories, such as from `~/Desktop`:

```sh
cd ~/Desktop
npx --yes github:AnthersDev/create-frontend my-app
cd my-app
```

If SSH access to GitHub is not configured, use HTTPS:

```sh
cd ~/Desktop
npx --yes git+https://github.com/AnthersDev/create-frontend.git my-app
cd my-app
```

The generator downloads the template, creates `.env.local` from `.env.example`, configures `package.json`, checks access to the private Anthers package, installs dependencies, and initializes Git.

### 2. Configure the Environment

The generator creates `.env.local`. Review it with `cat .env.local`. The mock API is enabled by default during development when `VITE_USE_MOCK_API` is unset.

| Mode | `.env.local` setting | Behavior |
| --- | --- | --- |
| **Mock API (default)** | `VITE_USE_MOCK_API` unset or `true` | Simulates sign-in, magic links, organization selection, and local API responses without a backend. |
| **Real API (local development)** | `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` set to your backend | Disables mock auth and the mock banner; app requests use the configured API base URL. Set `VITE_SSO_APP_ID` to enable Google sign-in. |
| **Production build** | `npm run build && npm run preview` | Mocks are off by default; configure a real API base URL. Set `VITE_USE_MOCK_API=true` only when intentionally testing mocks in a build. |

See [`.env.example`](./.env.example) for the available variables. Never put secrets in `VITE_*` variables because they are exposed in the browser bundle.

### 3. Quality Gates & Local Development

Run the checks before starting work:

```sh
npm run lint && npm run type-check && npm run build
```

Start the app:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/). With the default mock setup, the app redirects to `/login` and shows an amber mock banner.

### 4. Clean Up Demo Data

When you are ready to build your application, run:

```sh
npm run clean:demo
```

This removes the seeded report rows and saved views, removes the home-page demo state switcher, and clears the **Registration** page sample form fields (`vendor-registration-form.ts` → empty `sections`). It keeps the mock API, authentication scaffolding, and the Registration route/shell available for local development.

### 5. Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| `404 Not Found` for `@marmeto_engineering/anthers-components` | Missing organization access or expired npm token | Run `npm login --registry=https://registry.npmjs.org/` and verify your organization membership. |
| `401 Unauthorized` from `npm whoami` | Expired npm session | Run `npm login --registry=https://registry.npmjs.org/`. |
| `npx` cannot clone the generator repository | SSH key is not configured | Use the HTTPS command above. |
| An old globally linked CLI runs | A stale global link is active | Run `npm unlink -g @marmeto_engineering/create-frontend`, then run `npm link` in the current CLI checkout. |
| Port 3000 is already in use | Another server is using the port | Run `PORT=3001 npm run dev`. |

### What’s included

| Area | Stack / location |
| --- | --- |
| UI | React 19, Anthers components ([Storybook index](./docs/anthers-storybook.md)), Tailwind 4, Lucide icons |
| Data | Axios (`httpClient` + `authClient`), TanStack Query |
| Auth | Magic link + optional Google SSO, org picker, cookie session + refresh |
| Structure | Feature folders under `src/features/*`, pages under `src/pages/*` |
| Local API | Mock routes in `src/services/mocks` (on by default in `npm run dev`) |

More detail: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md), [docs/](./docs).

### Anthers Storybook

Anthers UI docs live on Chromatic: [Storybook](https://main--685923032e27da931cdadb63.chromatic.com/).

Every Anthers layout/component used in this template has a **Storybook comment above its import** in source, plus a full index:

| Resource | Link |
| --- | --- |
| Index of all used components | [docs/anthers-storybook.md](./docs/anthers-storybook.md) |
| Chromatic home | [main--685923032e27da931cdadb63.chromatic.com](https://main--685923032e27da931cdadb63.chromatic.com/) |

In the running app, dashed **Anthers component docs** bars sit near Anthers usages. Each button opens that component in Chromatic Storybook (new tab). Copy explains they are demo-only and removed by `npm run clean:demo`. Source: `src/demo/anthers-storybook`.

When you add a new Anthers import, add the matching Storybook URL comment (and a row in `docs/anthers-storybook.md`). For a clickable demo bar, wrap `<AnthersStorybookLinks components={[...]} />` in `{/* @clean-demo anthers-storybook */}` … `{/* @clean-demo-end */}` markers.

### App routes

| Route | Who can open it | What it does |
| --- | --- | --- |
| `/login` | Signed-out users | Email or Google sign-in |
| `/select-org` | Signed-in users | Choose an organization |
| `/` | Signed-in + org | Home (Anthers shell). Mock demos: `?home=empty`, `?home=error` |
| `/analytics/reports` | Signed-in + org | `AdvancedDataTable` listing: search, filters, bulk actions, saved views (including **Empty demo**), row ⋮ menu |
| `/registration` | Signed-in + org | Vendor registration demo (`FormPreviewPage` multi-section sample: Company → Brand → Bank → Contact) |
| `/permissions` | Signed-in + org | Nested **Permissions** sidebar demo (overview + allowed / access denied / hidden actions) |
| `/permissions/allowed` | Signed-in + org | `PermissionGuard` allow path (`settings.userAndPermissions.manage`) |
| `/permissions/access-denied` | Signed-in + org | Always shows Anthers `AccessDenied` |
| `/permissions/hidden` | Signed-in + org | Page open for all; manage button uses `fallback="hidden"` |
| `/settings` | Signed-in + org | Settings hub (general, users, notifications) |
| `/settings/users` | Signed-in + org | User management list (`UserListingLayout`) |
| `/settings/users/create` | Signed-in + org | Add user (`UserCreationLayout`) |
| `/settings/users/:id` | Signed-in + org | Edit user permissions (`UserDetailsLayout`) |
| `/settings/notifications` | Signed-in + org | Notification sender / look & feel / list |
| `/settings/notifications/:id` | Signed-in + org | Notification template editor |
| `/whats-new` | Signed-in + org | Release notes placeholder |
| `/auth/mock-callback` | Mock API only | Stands in for opening the magic link |
| `*` (unknown) | Signed-in + org (in shell) or public | **Page not found** — does not redirect to Home (e.g. `/settings/123`) |

Sign out clears the session and sends you to `/login`. Wrap new signed-in routes in `<RequireSession requireOrganization />` in `src/routes/AppRoutes.tsx`. Add sidebar items in `src/config/navigation.ts`. New product domains can start from `src/features/_feature-template_/`.

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
| `GET /user` | Users list (settings → user management) |
| `GET /user/permission` | Permission catalog for invite form |
| `POST /user` | Invite user (`{ email, permissions }`) |
| `GET /user/:id/permission` | User detail + permission catalog |
| `PUT /user/:id/permission` | Update user permissions |
| `DELETE /user/:id` | Remove user |
| `GET /notification/` | Notifications connection |
| `GET` / `PUT /notification-setting/` | Sender + look & feel |
| `PATCH /notification/:id` | Toggle `isActive` |
| `GET` / `PUT /notification/:id` | Template detail |
| `POST /notification/preview` | Preview HTML |
| `POST /notification/test` | Send test email |

The magic link should land on `/select-org` after cookies are set.

### Registration (vendor form demo)

Signed-in route **`/registration`** (sidebar: **Registration**) demos Anthers **`FormPreviewPage`** inside **`PageLayout`**, matching the Chromatic story [*Form Preview In App Layout → Vendor Registration*](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-registration-form-long-form-with-sections-form-preview-in-app-layout--vendor-registration). Full Anthers Storybook map: [docs/anthers-storybook.md](./docs/anthers-storybook.md).

| Piece | Location |
| --- | --- |
| Page | `src/pages/registration/Registration.tsx` |
| Sample form JSON | `src/pages/registration/vendor-registration-form.ts` |
| Nav | `src/config/navigation.ts` (`/registration`) |
| Route | `src/routes/AppRoutes.tsx` |

Stepper sections in the sample: **Company → Brand → Bank → Contact**. Editing fields registers with the shell **Global Save** bar (`AppLayout` / `GlobalSaveProvider`); Save shows a demo success toast (no backend yet).

To reuse for a real product form, swap `vendorRegistrationSampleForm` for API-loaded JSON (same shape as Anthers advance-form-builder `formJson`) and wire `onSubmit` to your endpoint.

### Permission checks (hide UI by role)

Use `PermissionGuard` (Nexus-style) to hide buttons or block page sections from session permissions. Hook: `useHasPermission` from `@/features/auth`.

**Try it in the app:** open the nested **Permissions** group in the sidebar (`/permissions`). It walks through allowed content, the AccessDenied screen, hidden actions, and Anthers sidebar lock icons (`requiredPermissions` on menu items + `userPermissions` on `Sidebar`). Pages live under `src/pages/permissions/`; nav config is in `src/config/navigation.ts`.

```tsx
import { PermissionGuard } from '@/components/PermissionGuard';
import { useHasPermission } from '@/features/auth';

// Hide a button unless the user has the permission (default fallback)
<PermissionGuard requiredPermissions="settings.userAndPermissions.manage">
  <Button onClick={() => navigate('/settings/users')}>Manage users</Button>
</PermissionGuard>

// Full section / page: show Anthers AccessDenied instead of hiding
<PermissionGuard requiredPermissions={['settings.general.manage']} fallback="denied">
  <GeneralSettings />
</PermissionGuard>

// Imperative check
const canManageUsers = useHasPermission('settings.userAndPermissions.manage');
```

| Prop | Meaning |
| --- | --- |
| `requiredPermissions` | One string or a list |
| `requireAll` | `true` = need every permission; default = any one |
| `fallback` | `hidden` (default), `denied` (`AccessDenied`), or a custom node |

**Try the Permissions sidebar** (`/permissions`) for allow / deny / hidden demos instead of scattering samples on Home.

### Branding

Edit `src/config/brand.ts` and replace `public/logo.svg` / `public/login-background.svg` (or point `brand.ts` at other assets). Login logo renders ~64px tall. Brand colour, font, and radius live in `src/theme/theme.css`.

Keep these in sync when you change the display name by hand:

| File | Field |
| --- | --- |
| `src/config/brand.ts` | `brand.name` |
| `index.html` | `<title>` |
| `vite.config.ts` | `appName` (PWA name / short_name) |

`VITE_APP_NAME` in `.env.local` is a **technical** slug for CSRF and the refresh lock (must match the backend `APP_NAME`). It is not the marketing product name.

### How to add a new page (manual, no AI)

Use this when you are editing the app yourself. Example: an **Inventory** page at `/inventory`.

#### 1. Create the page component

Add `src/pages/Inventory.tsx`:

```tsx
import React from 'react';
import { PageLayout } from '@marmeto_engineering/anthers-components';

const Inventory = () => (
  <PageLayout title="Inventory" description="Track stock levels for your catalog.">
    <p className="text-body text-zinc-600">Inventory content goes here.</p>
  </PageLayout>
);

export default Inventory;
```

#### 2. Register the route

In `src/routes/AppRoutes.tsx`, lazy-load the page and add it inside the signed-in + organization shell (same tree as Home and Reports):

```tsx
const Inventory = lazy(() => import('@/pages/Inventory'));

// inside <Route element={<RequireSession requireOrganization />}> → <AppShell>:
<Route path="/inventory" element={<Inventory />} />
```

#### 3. Add a sidebar item

In `src/config/navigation.ts`, import an icon and push into `mainNavItems`:

```tsx
import { Package } from 'lucide-react';

// inside mainNavItems:
{
  id: 'inventory',
  label: 'Inventory',
  href: '/inventory',
  icon: icon(Package),
},
```

#### 4. Check it

```sh
npm run type-check && npm run lint
npm run dev
```

Sign in, pick an organization, open **Inventory** in the sidebar (or visit http://localhost:3000/inventory). Signed-out visits should redirect to `/login`.

For a page that also needs its own API + feature folder, copy `src/features/_feature-template_/` and follow [AGENTS.md](./AGENTS.md) “Recipe: add a product feature” — or the feature README under that folder.

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
| `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` | Optional. When set, PostHog boots (pageviews + identify). Leave unset to keep analytics off |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog host (default `https://us.i.posthog.com`) |
| `VITE_INTERCOM_APP_ID` | Optional. When set, Intercom messenger boots for signed-in users |
| `VITE_INTERCOM_API_BASE` | Intercom API base (default `https://api-iam.intercom.io`) |

### Analytics (PostHog + Intercom)

Same pattern as Ping / Nexus: **no key → no-op**; set the env var (or equivalent in your deploy env) and it starts working.

| Tool | Enable with | Behavior |
| --- | --- | --- |
| PostHog | `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` | Init on load, `$pageview` on route change, `identify` when session has a user, `reset` on sign-out |
| Intercom | `VITE_INTERCOM_APP_ID` | Loads the widget script, boots for signed-in users, shuts down on sign-out |

Code: `src/libs/analytics/*`, wired through `AnalyticsProvider` in `src/App.tsx`.

### Staging and production deployments

Generated apps ship `.github/workflows/build-and-deploy.yml` (Ping / Nexus / Pulse pattern):

| Branch | GitHub Environment | What happens |
| --- | --- | --- |
| `staging` | `staging` | Build → S3 → CloudFront invalidate |
| `main` | `production` | Same for production |

Configure each environment’s AWS variables/secrets and `VITE_API_BASE_URL` before the first deploy. Full checklist: [docs/GITHUB_SETUP_GUIDE.md](./docs/GITHUB_SETUP_GUIDE.md#staging-and-production-deploy-s3--cloudfront).

### Scripts

| `npm run <script>` | Description |
| --- | --- |
| `dev` | App at http://localhost:3000 (`PORT` overrides) |
| `build` | Type-check + production build to `dist/` (mocks off by default) |
| `preview` | Serve `dist/` locally |
| `lint` / `lint:fix` | ESLint |
| `format` | Prettier |
| `type-check` | `tsc --noEmit` |
| `clean:demo` | Strip demo mock data, homepage demo controls, registration sample form fields, and on-page Anthers Storybook buttons |

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

#### Scaffold location and product name on AI-assisted setup (agents only)

When a developer uses an AI agent to create the app, the agent **must ask once where to scaffold it** before running `create-frontend`. The answer is a folder chain from the home directory, with `->` between folders: `Desktop` (`~/Desktop/<project-name>`) or `Desktop -> Frontend` (`~/Desktop/Frontend/<project-name>`). The agent does not pick a directory on its own. Skip this question when the app already exists.

The agent **must also ask once for the product display name** and fill it in everywhere listed under [Branding](#branding) (`brand.name`, `index.html` title, `vite.config.ts` `appName`). Optionally set a slug for `VITE_APP_NAME` in `.env.local` if the human provides one.

This does **not** apply to the manual `create-frontend` / `npx` path: the CLI creates the project in the current directory and only sets the folder / `package.json` name. Humans branding by hand edit those files themselves (see Branding above).

---

## Frontend Project Onboarding & Setup Guide (Maintainers)

Use this guide to test unmerged changes to the `create-frontend` CLI or its template and verify the scaffolded app end to end. It is for maintainers of **this boilerplate repo** ([AnthersDev/product-boilerplate-frontend](https://github.com/AnthersDev/product-boilerplate-frontend)), not day-to-day feature work inside one product app.

### Repository layout

| Path | Role |
| --- | --- |
| `template-vite/` | The Vite app template (this README lives here and ships with generated apps) |
| `.github/workflows/template-ci.yml` | Boilerplate CI: install, lint, type-check, build against `template-vite` |
| `template-vite/.github/workflows/` | Workflows copied into generated product repos |

Do not treat the checked-out boilerplate as a production app. New product apps should be generated (e.g. via create-frontend / the org’s scaffolder) so branding, env, and package name are set correctly.

### 1. Set Up the CLI Locally

Use a separate checkout of the generator when testing CLI changes:

```sh
git clone git@github.com:AnthersDev/create-frontend.git
cd create-frontend
npm install
npm link
```

If SSH access is unavailable, clone `https://github.com/AnthersDev/create-frontend.git` instead.

### 2. Scaffold a Test Project

Always scaffold into a fresh temporary directory:

```sh
cd "$(mktemp -d)"
create-frontend my-test-app
```

To test a specific unmerged template branch:

```sh
create-frontend my-test-app --template-ref <branch-name>
```

Expected output:

- `Template downloaded successfully`
- `Project files configured` (`.env.local` created from `.env.example`)
- `package.json updated`
- `Access to @marmeto_engineering/anthers-components confirmed`
- `Dependencies installed successfully`
- `Git repository initialized`

### 3. Verify the Scaffolded App

The smoke test uses the default Mock API mode. Start the generated app with `npm run dev`, then check these flows:

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Open `/` | Redirects to `/login` with the app branding and amber mock banner. |
| 2 | Enter `fail@example.com` and continue | Shows the mock sign-in error. |
| 3 | Enter `ria@example.com`, continue, then use **finish sign-in** in the banner | Opens the organization picker with Acme, Globex, and Initech. |
| 4 | Select **Acme Retail**, then switch to **Globex Stores** | Home loads and reflects the selected organization. |
| 5 | Refresh, then sign out | The session survives refresh; sign-out returns to `/login`. |
| 6 | Sign in with Google | Mock Google sign-in skips the email step and uses `demo@example.com`. |

Check these mock account edge cases as well:

| Email | Expected result |
| --- | --- |
| `one-org@example.com` | Automatically selects Acme after a brief loading state. |
| `no-orgs@example.com` | Shows that the account has no organizations and offers **Use a different account**. |
| `org-error@example.com` | Shows an organization loading error with **Try again** and **Use a different account**. |

Run the quality gates in the generated app before considering the scaffold verified:

```sh
npm run lint && npm run type-check && npm run build
```

When done, unlink the local CLI:

```sh
npm unlink -g @marmeto_engineering/create-frontend
```

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
