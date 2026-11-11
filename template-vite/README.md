# React Vite TypeScript Starter

This project was generated using [create-awesome-node-app](https://www.npmjs.com/package/create-awesome-node-app). **DON'T USE THIS TEMPLATE AS IT!** Generate yours using the command and following the options in the interactive menu. Check the docs for more information!

## Features

- ⚡️ **Instant HMR** - use [Vite](https://vitejs.dev/) on dev (no more refresh!)
- ⚛ React - [React](https://reactjs.org/) is used for UI
- 🦾 [TypeScript](https://www.typescriptlang.org/) - type safe
- 🏗️ **Feature-Based Architecture** - Scalable and maintainable code organization
- 🔒 **Encapsulated Features** - Self-contained modules with clear boundaries
- 🎯 **Domain-Driven Design** - Code organized around business capabilities

## Architecture

This template uses a Feature-Based Architecture inspired by Screaming Architecture and Domain-Driven Design principles. The codebase is organized around business capabilities rather than technical concerns, making it:

- 📦 **Modular**: Each feature is self-contained
- 🔄 **Maintainable**: Changes are isolated to specific features
- 🚀 **Scalable**: Easy to add new features without affecting existing ones
- 🎨 **Clear**: Structure reflects business capabilities

For detailed information about the architecture, see [Project Structure](./docs/PROJECT_STRUCTURE.md).

## Extra documentation

You can find useful information such as project structure, available scripts and much more in the [docs](./docs) folder!

## Pre-packed

### Dev tools

- [TypeScript](https://www.typescriptlang.org/)
- [eslint](https://eslint.org/) - Linting utility for JavaScript and JSX
- [prettier](https://prettier.io/) - Opinionated code formatter
- [husky](https://www.npmjs.com/package/husky) - Git hooks made easy
- [lint-staged](https://www.npmjs.com/package/lint-staged) - Run linters against staged git files and don't let 💩 slip into your code base!

## Quickstart

`@marmeto_engineering/anthers-components` is a private package. Run `npm login` once per machine with an npm account in the `marmeto_engineering` org (ask in #engineering for access); npm then reads the package with that login. In CI the token comes from the Actions secret `NPM_TOKEN_READ_ONLY`.

```sh
fnm use
npm login --registry=https://registry.npmjs.org/   # once per machine
npm install
npm run dev
```

Open http://localhost:3000. The app starts on the login page.

## Authentication

Sign-in uses the Anthers `LoginPage` (magic link by email, plus optional Google) and `SelectOrganizationPage`. The backend keeps the session in HTTP-only cookies, so the app never stores a token. It asks `GET /auth/session` who is signed in.

| Route                 | Who can open it                      | What it does                                                              |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| `/login`              | Signed-out users                     | Email or Google sign-in. Signed-in users are sent to `/`.                 |
| `/select-org`         | Signed-in users                      | Choose an organization. With one organization it is picked automatically. |
| `/`                   | Signed-in users with an organization | Home page.                                                                |
| `/auth/mock-callback` | Mock API only                        | Stands in for opening the magic link from the email.                      |

Any other path redirects to `/`. If any API call returns 401, the session is cleared and the user goes back to `/login`.

The code lives in `src/features/auth` (API calls and React Query hooks), `src/pages/auth` (screens) and `src/routes/RequireSession.tsx` (route guards). Wrap new signed-in routes in `<RequireSession requireOrganization />` in `src/routes/AppRoutes.tsx`.

### Signing in with mock data

In `npm run dev` the mock API is on, so you can sign in without a backend:

- **Google**: click **Sign in with Google**. You are signed in as `demo@example.com`.
- **Email**: enter any email, click **Continue with email**, then click **finish sign-in** in the yellow banner.

These emails trigger specific states:

| Email                   | Result                                          |
| ----------------------- | ----------------------------------------------- |
| `fail@example.com`      | Sign-in error on the login page                 |
| `one-org@example.com`   | One organization, picked automatically          |
| `no-orgs@example.com`   | "You're not part of any organization yet"       |
| `org-error@example.com` | Organizations fail to load, with a retry button |

Any other email gets three organizations with the roles owner, admin and member. The mock session is kept in `sessionStorage`, so it survives a reload and ends when you close the tab. The mock routes are in `src/services/mocks/auth-handlers.ts`.

### Connecting your backend

Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` in `.env.local`, then restart the dev server. The backend must provide these endpoints, each returning `{ status, message, data }`:

| Endpoint                                  | Purpose                                                    |
| ----------------------------------------- | ---------------------------------------------------------- |
| `POST /auth/sso`                          | Send the magic link. Body: `{ email, query, redirectUrl }` |
| `GET /auth/session`                       | Current session, or 401 when signed out                    |
| `GET /auth/organization`                  | Organizations the user belongs to                          |
| `POST /auth/organization/:organizationId` | Switch the session to that organization                    |
| `POST /auth/logout`                       | End the session                                            |

Requests are sent with credentials, so if the API is on another origin it must allow credentials in CORS and set cookies that the browser will send back. The magic link should send the user to `/select-org` after it sets the cookies.

To show **Sign in with Google**, set `VITE_SSO_APP_ID` to your app's ID from the Marmeto identity service. Without it, the login page offers email only.

### Branding the login page

Edit `src/config/brand.ts` to set your product's name, logo, login background and support links. Replace `public/logo.svg` and `public/login-background.svg` with your own artwork, or point `brand.ts` at other files. The logo is shown 64px tall on the login page, so keep the artwork vertically centred in its canvas.

## Git hooks

Husky runs these checks automatically, so you don't need to run them by hand. ESLint also runs in the editor on save (see `.vscode/settings.json`), so problems are fixed before you `git add`.

| Hook | Runs | Takes |
| --- | --- | --- |
| `pre-commit` | `lint-staged` (ESLint fix and Prettier on the files you staged with `git add`), then `npm run lint` and `npm run type-check` | a few seconds |
| `pre-push` | `npm run build` | about 15–30 seconds |
| `commit-msg` | `commitlint` (conventional commit messages) | instant |

If a hook fails, the commit or push stops and the error is printed. Fix it and try again. In an emergency you can skip hooks with `--no-verify`. CI runs lint and type-check, but not the local pre-push build, commitlint, or staged-file formatting.

## Development

While developing, you will mostly use `npm run dev`. These scripts are also available:

| `npm run <script>` | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `dev`              | Serves the app at http://localhost:3000 with hot reload. Set `PORT` to use another port.             |
| `format`           | Formats the project using [Prettier](https://prettier.io/)                                           |
| `lint`             | Runs [ESLint](https://eslint.org/) on the project                                                    |
| `lint:fix`         | Runs ESLint and [fixes what it can](https://eslint.org/docs/latest/use/command-line-interface#--fix) |
| `type-check`       | Runs the TypeScript compiler without emitting files                                                  |

## Production

Scripts for preparing and viewing the production version:

| `npm run <script>` | Description                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| `build`            | Type-checks, then builds the application to `dist/`. The mock API is off by default |
| `preview`          | Serves the `dist/` build locally. Run `npm run build` first                         |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local project contribution workflow (branching, commits, architecture). For issues or improvements to the template itself, open an issue or PR in [AnthersDev/product-boilerplate-frontend](https://github.com/AnthersDev/product-boilerplate-frontend).
