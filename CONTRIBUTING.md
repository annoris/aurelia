# Contributing to Aurelia AI

Aurelia AI is a general-purpose business AI automation platform built for small and medium businesses as well as enterprise teams. We welcome high-signal contributions from the community.

## Reporting Issues & Discussions

- **Questions & Ideas:** Start a thread in [GitHub Discussions](https://github.com/annoris/aurelia/discussions).
- **Bugs & Documentation Fixes:** Open an issue using the templates in the [GitHub Issue Tracker](https://github.com/annoris/aurelia/issues).
- **Security Vulnerabilities:** **Never** open a public issue for security bugs. Report them privately through [GitHub Security Advisories](https://github.com/annoris/aurelia/security/advisories/new) as described in [SECURITY.md](SECURITY.md).

## Before You Start

Please keep our maintainer review workflow in mind before spending significant time on a patch:

1. **Link an issue:** Pull requests should reference an existing issue (language translation updates are the only exception).
2. **Feature PRs require prior approval:** Bug fixes only require a linked issue, whereas new features must have an issue approved by a maintainer before implementation begins. Unapproved feature PRs may be closed without review to keep architecture and scope coherent.
3. **Avoid duplicate work:** Comment on the issue you intend to work on before starting.
4. **Core permission/licensing internals:** Custom role systems or organization-specific overrides belong in a private fork rather than upstream.

## Configuring Git

Fork [annoris/aurelia](https://github.com/annoris/aurelia) on GitHub, clone your fork, and configure `upstream` tracking the `main` branch:

```bash
git clone https://github.com/<your-username>/aurelia.git
cd aurelia
git remote add upstream https://github.com/annoris/aurelia.git
git fetch upstream
git checkout -b feat/your-change upstream/main
```

## Local Development Setup

### Prerequisites

- **Node.js `>=18`** (the repository pins `v24.22.2` in `.nvmrc` for reproducible development)
- **npm** (bundled with Node.js)
- Optional: **Docker** and **Docker Compose** if testing containerized builds via `docker/docker-compose.yml`

### Install & Start Locally

From the repository root:

```bash
npm run setup
npm run doctor
npm run dev:local
```

What each command does:

- `npm run setup`: Installs dependencies across `server/`, `collector/`, and `frontend/`, creates local environment files from `*.env.example` without overwriting existing ones (`npm run setup:envs`), and generates/migrates/seeds the Prisma database (`npm run prisma:setup`).
- `npm run doctor`: Runs read-only diagnostics verifying Node runtime, installed dependencies, `.env` presence, Prisma client generation, and `server/storage/` availability.
- `npm run dev:local`: Launches `server`, `collector`, and `frontend` together cleanly in development mode with coordinated signal shutdown.

To preview and validate the static GitHub Pages showcase locally:

```bash
npm run pages:dev
npm run pages:check
```

## Verification & Quality Checks

Before opening a pull request, run:

```bash
npm run verify
npm run lint:ci
npm test
```

Individual verification scripts:

- `npm run verify:packages`: Ensures shared dependency versions match between `server/package.json` and `collector/package.json`.
- `npm run verify:translations`: Validates all frontend locale files in `frontend/src/locales/` against the English schema.
- `npm run pages:check`: Validates the static GitHub Pages showcase in `site/`.

## Project Structure

- `frontend/`: React + Vite web interface and locale resources
- `server/`: Node.js/Express API server, Prisma schema, RAG pipeline, agents, and MCP tooling
- `collector/`: Document, web, audio, and YouTube ingestion microservice
- `docker/`: `Dockerfile`, `docker-compose.yml`, and container setup guide (`docker/HOW_TO_USE_DOCKER.md`)
- `cloud-deployments/`: Cloud deployment templates and guides
- `site/`: Static GitHub Pages showcase
- `scripts/`: Local development diagnostics, launcher, and Pages validation utilities
- `docs/`: Architecture, development, integration, and design system documentation
- `extras/`: Verification scripts and translation tooling

## Pull Request Guidelines

1. Keep pull requests focused on a single problem or approved feature.
2. Add or update tests for bug fixes and new behavior, covering failure/edge cases.
3. Update relevant documentation in `docs/` or `site/` when public APIs, workflows, or UI capabilities change.
4. Use [Conventional Commits](https://www.conventionalcommits.org/en/) for PR titles (e.g., `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).
5. Never commit `.env`, `.env.development`, `.license-authority/`, API credentials, or `server/storage/` runtime data.
6. Mark incomplete PRs as **Draft** until ready for review.

## Criteria for New Third-Party Integrations

To keep Aurelia AI maintainable across diverse SMB and enterprise environments, dedicated third-party connectors (LLM providers, embeddings, vector databases, search, TTS/STT, or automation tools) must satisfy both thresholds below:

### 1. Technical Threshold

- **OpenAI-Compatibility Rule:** Providers exposing standard OpenAI-compatible endpoints (`/v1/chat/completions`, `/v1/models`) without bespoke orchestration logic should use the built-in **Generic OpenAI** connector rather than adding a dedicated integration.
- **Dedicated Integration Justification:** A dedicated connector is appropriate only when the provider requires custom authentication/signing, relies on an incompatible native SDK/payload schema, or exposes unique architectural capabilities lost behind a generic wrapper.

### 2. Adoption & Maintainability Threshold

- Verifiable community demand and real-world adoption (e.g., repository stars, package downloads, or organic issue upvotes).
- Publicly available, stable production API (`90+` days) and a free/developer tier or local emulation path so maintainers can test and maintain the connector without paid-only blockers.
- Contributions opened purely for promotional backlinks or listing visibility without technical merit will be closed.

## AI-Assisted Contributions

We welcome engineers who use AI coding tools thoughtfully to accelerate design, refactoring, and testing. However, every line in a pull request is your responsibility:

- Do not submit unreviewed boilerplate or superficial tests that fail to test the actual behavior changed.
- Verify all commands, imports, and edge cases locally before requesting review.

## License

By contributing to **annoris/aurelia**, you agree that your contributions will be governed by the repository [Proprietary License](LICENSE).
