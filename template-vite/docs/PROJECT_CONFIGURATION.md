# ⚙️ Project Configuration

The application has been bootstrapped using [create-awesome-node-app](https://www.npmjs.com/package/create-awesome-node-app) for simplicity reasons. It allows us to create applications quickly without dealing with a complex tooling setup such as bundling, transpiling etc.

You should always configure and use the following tools:

## ESLint

ESLint is a linting tool for JavaScript. By providing specific configuration defined in the`eslint.config.mjs` file it prevents developers from making silly mistakes in their code and enforces consistency in the codebase.

The rules follow the same conventions as [Anthers-component](https://github.com/AnthersDev/Anthers-component/blob/main/eslint.config.js) where they apply to product apps: boolean prefixes (`is` / `has` / `should`), JSX handlers starting with `on`, hooks under `src/**/hooks/**` starting with `use`, PascalCase components, Lucide `strokeWidth={1.75}`, and Anthers text-size classes (`text-label`, `text-small`, `text-body`, `text-headline`, `text-mono`). Library-only rules such as `import/no-default-export` are not enabled, because pages use default exports for `React.lazy`.

Install the recommended VS Code / Cursor extensions (prompted from `.vscode/extensions.json`). With `.vscode/settings.json`, ESLint fixes and Prettier run on save, so issues are cleaned up before you `git add`. On commit, Husky runs the same checks again on the staged files via `lint-staged`.

[ESLint Configuration](../eslint.config.mjs)

## Prettier

This is a great tool for formatting code. It enforces a consistent code style across your entire codebase. By utilizing the "format on save" feature in your IDE you can automatically format the code based on the configuration provided in the `.prettierrc` file. It will also give you good feedback when something is wrong with the code. If the auto-format doesn't work, something is wrong with the code.

[Prettier Configuration](../.prettierrc.js)

## TypeScript

ESLint is great for catching some of the bugs related to the language, but since JavaScript is a dynamic language ESLint cannot check data that run through the applications, which can lead to bugs, especially on larger projects. That is why TypeScript should be used. It is very useful during large refactors because it reports any issues you might miss otherwise. When refactoring, change the type declaration first, then fix all the TypeScript errors throughout the project and you are done. One thing you should keep in mind is that TypeScript does not protect your application from failing during runtime, it only does type checking during build time, but it increases development confidence drastically anyways. Here is a [great resource on using TypeScript with React](https://react-typescript-cheatsheet.netlify.app/).

## Husky

Husky is a tool for executing git hooks. Use Husky to run your code validations before every commit, thus making sure the code is in the best shape possible at any point of time and no faulty commits get into the repo. It can run linting, code formatting and type checking, etc. before it allows pushing the code. You can check how to configure it [here](https://typicode.github.io/husky/#/?id=usage).

This project's hooks live in `.husky/`:

- `pre-commit`: `lint-staged` (ESLint fix and Prettier on staged files, configured in `.lintstagedrc.json`), then `npm run lint` and `npm run type-check`.
- `pre-push`: `npm run build`.
- `commit-msg`: `commitlint`.

## Absolute imports

Absolute imports should always be configured and used because it makes it easier to move files around and avoid messy import paths such as `../../../Component`. Wherever you move the file, all the imports will remain intact. Here is how to configure it:

For JavaScript (`jsconfig.json`) projects:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

For TypeScript (`tsconfig.json`) projects:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

[Paths Configuration](../tsconfig.json)

It is also possible to define multiple paths for various folders(such as `@/components`, `@/hooks`, etc.), but using `@/*` works very well because it is short enough so there is no need to configure multiple paths and it differs from other dependency modules so there is no confusion in what comes from `node_modules` and what is our source folder. That means that anything in the `src` folder can be accessed via `@`, e.g some file that lives in `src/components/MyComponent` can be accessed using `@/components/MyComponents`.
