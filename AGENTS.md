# AGENTS.md — AI Assistant Rules for `jlynshue.github.io`

> This file provides guardrails for all AI coding assistants (Claude Code, Cline, Cursor, Codex, GitHub Copilot, Windsurf, etc.) working in this repository. It is the single source of truth for "how AI tools should behave here."
>
> **Companion file:** [`CLAUDE.md`](CLAUDE.md) — project-specific build/test/architecture context that AI tools read first.
> **Development context:** This repo may be cloned inside `~/code-projects/projects/active/jlynshue.github.io/` as part of Jon's local development monorepo. See that monorepo's `AGENTS.md` for workspace-wide conventions.

## Repository Identity

- **Owner:** `jlynshue` (or `@jonathanlynshue`)
- **Canonical remote:** `https://github.com/jlynshue/jlynshue.github.io`
- **Default branch:** `main`
- **Primary language:** `TypeScript`

## Rules

### DO NOT

- **Commit secrets.** All secrets live in `.env.master` in the local monorepo; never commit `.env`, credentials, tokens, API keys, or `~/.restic-password`-style files.
- **Force-push to `main`** without explicit user approval.
- **Skip CI hooks** (`--no-verify`, `--no-gpg-sign`) unless the user explicitly asks.
- **Mix projects** — don't copy files from sibling repos in `~/code-projects/projects/active/` into this one without a stated reason.
- **Create session artifacts at the repo root** (`SESSION_*.md`, `*_HANDOFF_*.md`, `*_REPORT_*.md`) — put them under `docs/session-logs/` or delete when done.
- **Bypass the deployment rule:** every deployment requires QA and regression testing before pushing (see `CLAUDE.md` → Deployment).

### DO

- **Follow `CLAUDE.md`** for build/test commands, code style, and architecture. That file is the project-specific companion to this one.
- **Use the repo's existing patterns.** Before inventing a new convention, grep for an existing one.
- **Prefer editing existing files** over creating new ones.
- **Run tests and linters before committing.** Commands are in `CLAUDE.md`.
- **Update `docs/HISTORY.md`** for material decisions (merged PRs are auto-tracked; decisions are not).
- **Cline-specific:** surface plan changes to the user before executing multi-file edits. Don't batch 5+ file changes into a single approval prompt — split them into reviewable chunks so the user can veto a specific step without aborting the whole plan.

## Scope Boundaries

### In scope

- Code, tests, docs, CI/CD configuration inside this repo.
- Issues and PRs in this repo.
- Releases and tags for this repo.

### Out of scope

- Changes to sibling repos (open a PR in the other repo).
- Changes to `~/code-projects/` monorepo-level infrastructure (MCP config, shared libs, etc.) — those belong in the monorepo.
- Production deployments without QA sign-off.

## Secrets & Security

- All AI tools should respect `.gitignore`, `.copilotignore`, `.claudeignore`, `.aiignore` in this repo.
- If any file path matches `*.env`, `*.pem`, `*.key`, `credentials*`, `secrets*`, `*.db`, `*.csv` with PII — do not read it into a response and do not stage it.
- PII masking conventions (if applicable): see `CLAUDE.md`. Project-specific masking rules live there to avoid duplication.

## Working with This Repo Inside the Monorepo

If this repo is cloned inside `~/code-projects/projects/active/jlynshue.github.io/`:

- Work here for git-tracked changes. Do not commit from `~/code-projects/` (that directory is not a git repo).
- Shared libraries from `~/code-projects/shared/libs/python/` are imported via `sys.path.insert(...)` — see the monorepo's `CLAUDE.md` for the import pattern.

## History & Provenance

- `docs/HISTORY.md` tracks merged PRs and major decisions.
- Baseline snapshots tagged as `phase-N-baseline` map to phases of the 2026-04 codebase revamp (see `~/code-projects/docs/plans/2026-04-codebase-revamp.md`).
- Transfer history (if applicable) is noted at the top of `docs/HISTORY.md`.


## For More Information

- [`CLAUDE.md`](CLAUDE.md) — project-specific build/test/architecture context
- [`docs/HISTORY.md`](docs/HISTORY.md) — merged PRs, major decisions, and timeline
- Monorepo context: `~/code-projects/CLAUDE.md` and `~/code-projects/AGENTS.md`
