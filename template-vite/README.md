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

## Git hooks

Husky runs these checks automatically, so you don't need to run them by hand:

| Hook | Runs | Takes |
| --- | --- | --- |
| `pre-commit` | `lint-staged` (ESLint fix and Prettier on staged files), then `npm run lint` and `npm run type-check` | a few seconds |
| `pre-push` | `npm run build` | about 15–30 seconds |
| `commit-msg` | `commitlint` (conventional commit messages) | instant |

If a hook fails, the commit or push stops and the error is printed. Fix it and try again. In an emergency you can skip hooks with `--no-verify`, but CI runs the same checks.

## Development

While developing, you will probably rely mostly on `npm run start`; however, there are additional scripts at your disposal:

| `npm run <script>` | Description                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `dev`              | Serves your app at for local development                                                                                |
| `format`           | Formats the project using [Prettier](https://prettier.io/)                                                              |
| `lint`             | [Lints](http://stackoverflow.com/questions/8503559/what-is-linting) the project for potential errors                    |
| `lint:fix`         | Lints the project and [fixes all correctable errors](http://eslint.org/docs/user-guide/command-line-interface.html#fix) |

## Production

Scripts for preparing and viewing the production version:

| `npm run <script>` | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `preview`          | Serves your app using your production ready setup (`.env.production`) |
| `build`            | Builds the application to `dist/`                                     |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local project contribution workflow (branching, commits, architecture). For overarching template issues or improvements, open issues / PRs in the main monorepo: [Create-Node-App/cna-templates](https://github.com/Create-Node-App/cna-templates).
