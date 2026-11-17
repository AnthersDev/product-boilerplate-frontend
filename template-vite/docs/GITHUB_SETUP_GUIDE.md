# GitHub Setup Guide

## Overview

A generated app ships the GitHub Actions workflows, issue templates, and pull request template in this repository. Before running CI, configure the required repository secrets described in [Required repository secrets](#required-repository-secrets).

Dependabot, `CODEOWNERS`, and Super Linter are not part of this template. Do not look for `dependabot.yml`, `CODEOWNERS`, or `super-lint.yml`. Linting in CI is MegaLinter (`.github/workflows/mega-linter.yml`).

## Included features

### GitHub Actions

- **MegaLinter**: lints the JavaScript/TypeScript diff on pull requests
- **Typecheck**: runs `npm run type-check`
- **Tests**: runs `npm run test` when that script exists
- **Danger**: checks the pull request body against the PR template
- **Todo checker**: turns `TODO` comments on a pull request into GitHub issues, then commits the issue links onto that pull request branch

### Templates

- Bug report, feature request, and documentation issue forms
- Pull request template with the sections Danger expects
- Code of conduct

## Configuration files

### Workflows (`.github/workflows/`)

| File | When it runs | What it does |
| --- | --- | --- |
| `mega-linter.yml` | Non-draft pull requests to `main` | MegaLinter (`oxsecurity/megalinter` JavaScript flavor). Lints the diff with `main`. Can commit automatic fixes on that pull request. |
| `type-check.yml` | Push to `main`, and non-draft pull requests to `main` | Installs dependencies, then `npm run type-check`. |
| `tests.yml` | Push to `main`, and non-draft pull requests to `main` | Installs dependencies, then `npm run test` if the script exists. |
| `pr-review.yml` | Non-draft pull requests to `main` | Danger JS. Fails the check when the description is missing the PR template sections. Warns on an unchecked checklist and on diffs over 200 lines. |
| `todo.yml` | Pull requests to `main` from this repository | Opens or closes issues from `TODO` comments in the pull request's full diff. Commits inserted issue links onto the pull request branch. Does not push to `main`. |

### Required repository secrets

In the repository, open **Settings → Secrets and variables → Actions → New repository secret** and add these secrets before running CI:

- `NPM_TOKEN_READ_ONLY`: a read-only npm token used by `type-check.yml`, `tests.yml`, and `pr-review.yml` to install `@marmeto_engineering/anthers-components`.
- `DANGER_GITHUB_API_TOKEN`: a token used by `pr-review.yml` to access the GitHub API.

Without these secrets, the affected workflows fail during dependency installation or API access.

Draft pull requests skip MegaLinter, typecheck, tests, and Danger.

### Templates (`.github/`)

- `ISSUE_TEMPLATE/bug-report.yml` — bug reports
- `ISSUE_TEMPLATE/feature-request.yml` — feature requests
- `ISSUE_TEMPLATE/documentation.yml` — documentation issues
- `ISSUE_TEMPLATE/config.yml` — turns off blank issues
- `PULL_REQUEST_TEMPLATE.md` — sections Danger checks: Description, Type of Change, How Has This Been Tested?, Checklist
- `CODE_OF_CONDUCT.md`

There is no `.mega-linter.yml`. MegaLinter settings live in `mega-linter.yml` (`VALIDATE_ALL_CODEBASE`, `APPLY_FIXES`, `APPLY_FIXES_EVENT`, `APPLY_FIXES_MODE`).

## Customization

### MegaLinter

In `.github/workflows/mega-linter.yml`:

- The job runs only on non-draft pull requests, so the push trigger does not start a run.
- `VALIDATE_ALL_CODEBASE` is true only for a push to `main`. On pull requests MegaLinter lints the diff.
- `APPLY_FIXES: all` with `APPLY_FIXES_MODE: commit` writes fixes onto the pull request branch.

Set `VALIDATE_ALL_CODEBASE: true` if you want every pull request to lint the whole repo. Point MegaLinter at a root `.mega-linter.yml` if you outgrow the workflow env block. Docs: [megalinter.io](https://megalinter.io/latest/config-file/).

### Danger

The rules are in `tools/danger/dangerfile.ts`. The workflow moves that folder to the repo root before the Danger action runs. Keep the section headings in `PULL_REQUEST_TEMPLATE.md` aligned with `templateSections` in the dangerfile, or the check fails on every pull request.

### Issue templates

Edit the files in `.github/ISSUE_TEMPLATE/`. `config.yml` points general questions at a discussions URL from the upstream generator. Change that URL if you use discussions on this repo.

## Best practices

### Branch protection

These are repository settings, not files in the template. On `main`, consider requiring:

- A pull request before merging
- The MegaLinter, typecheck, tests, and Danger checks
- Branches to be up to date before merge

The tests check uses `npm run test --if-present`, so it can pass without running tests when no `test` script is defined. Add a test script before relying on this check for branch protection.

### Dependency updates

Nothing in this repo opens dependency update pull requests. Update npm packages and GitHub Actions on purpose, then run `npm run lint`, `npm run type-check`, and `npm run build`. Add [Dependabot](https://docs.github.com/en/code-security/dependabot) yourself if you want that automation. It is not configured here.

### Review assignment

There is no `CODEOWNERS` file, so GitHub will not auto-request reviewers from a path list. Add `.github/CODEOWNERS` when you want that.

## Troubleshooting

### MegaLinter failures

Open the MegaLinter job log and the uploaded `MegaLinter reports` artifact. Fixes are committed only when `APPLY_FIXES` is on and the workflow has permission to push to the pull request branch.

### Typecheck or tests fail at install

Confirm the `NPM_TOKEN_READ_ONLY` secret exists and can read `@marmeto_engineering/anthers-components`. A missing or expired token fails `npm install` before typecheck or tests start.

### Danger fails on a new pull request

The body must include `## Description`, `## Type of Change`, `## How Has This Been Tested?`, and `## Checklist`, and the checklist items must be checked (`- [x]`). Use the template instead of an empty description. If Danger cannot call the API, check `DANGER_GITHUB_API_TOKEN`.

### Todo checker

`todo.yml` processes the pull request's full diff, so TODO comments from earlier commits can affect issues. New TODO comments become issues, and the workflow pushes a `chore: add GitHub issue links to TODOs` commit back onto that same branch. Linked issues close only after the pull request is merged into `main`. Fork pull requests are skipped, because the workflow cannot push to them. Pull the branch again if that commit landed while you were still editing it.

## Resources

- [GitHub Actions](https://docs.github.com/en/actions)
- [MegaLinter](https://megalinter.io)
- [Danger JS](https://danger.systems/js/)
