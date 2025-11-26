# Contributing to Ameyo CRM

Thanks for your interest in contributing! This file explains how to get the project running locally and the development workflow we expect from contributors.

## Code of Conduct

Please follow respectful behavior and code of conduct in all communications.

## Getting started

1. Fork the repo and create a new branch from `main`.
2. Copy `.env.example` to `.env` and update values.
3. Start the dev database and app with Docker (recommended):

```bash
# Build and start services
docker-compose up --build
```

Or run locally:

```powershell
npm install
npm run dev
```

## Development guidelines

- Use `npm run lint` and `npm run format` before committing.
- Tests: `npm test`.
- Keep your PRs small and focused; include tests for new behavior.

## Commit messages

Use conventional, short commit messages. Example: `feat(auth): add bcrypt hashing`.

## Pull requests

- Target the `main` branch.
- Include a short description, motivation, and screenshots if UI changes.
- Make sure CI passes (lint, tests).

Thanks for contributing — we appreciate your help!

## PR Checklist (maintainers and contributors)

- [ ] Branch is created from `main` and named properly (feature/bugfix/fix)
- [ ] Changes are documented in `CHANGELOG.md` when applicable
- [ ] Code compiles and tests pass locally
- [ ] Linting and formatting applied (`npm run lint`, `npm run format`)
- [ ] Unit/integration tests added for new features
- [ ] No secrets or credentials committed

## Local development using Docker

We recommend using Docker for local development to match production more closely.

1. Copy `.env.example` to `.env` and update values.
2. Start app and DB:

```bash
docker-compose up --build
```

3. Open `http://localhost:5000` and run API requests.

## CI and Releases

- CI runs lint, formatting checks, tests, and CodeQL on PRs.
- Releases can be automated with `semantic-release` (not configured by default).

## Contact / Reporting

If you find security issues or sensitive data leaks, please contact the maintainers
privately (add contact email or GitHub usernames here).
