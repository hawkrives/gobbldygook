# Contributing to Gobbldygook

Thank you for contributing! This project uses an agents-based workflow with centralized rules to maintain consistency.

## Before You Commit

**IMPORTANT**: Before committing any work, consult the **Git Commit rule** at `.agents/rules/git-commit.md`.

This rule defines:

- Commit message format and structure
- Type classifications (`feat`, `fix`, `docs`, `chore`, etc.)
- Constraints on logical changes per commit
- Best practices for clean history

## Recording User-Facing Changes

This project uses [Changesets](https://changesets.dev/) to track user-facing changes. When a change affects what users see or do, run `mise run changeset` and describe the change; commit the generated file in `.changeset/` with the rest of your work. Refactors, tooling, and other internal-only changes do not need a changeset.

The `@gob/*` packages share one version number (except `@gob/webpack-plugin-html`), so a bump to any of them bumps all of them.

## Before You Finish Your Session

**IMPORTANT**: Before ending your work session, consult the **Landing the Plane rule** at `.agents/rules/landing-the-plane.md`.

This rule defines the protocol for cleanly ending a session, including:

- Running quality gates (linting, type checking, tests)
- Filing issues for remaining work
- Syncing the issue tracker
- Verifying clean git state
- Preparing context for the next session

## Other Guidelines

For additional project conventions and guidelines, consult:

- `.agents/rules/issue-tracking.md` - Issue tracking conventions
- `.agents/rules/react-components-guideline.md` - React component patterns
- `.agents/rules/api-guideline.md` - API design guidelines
- `.agents/rules/create-rule.md` - How to create new rules
- `.agents/skills/` - Reusable processes for common tasks

## Quick Reference

- **Package manager**: npm (with workspaces in `modules/*`)
- **Node version**: ≥22 (managed by mise)
- **Type checking**: strict TypeScript 7, run with `mise run typecheck`
- **Testing**: Jest
- **End-to-end tests**: Playwright, run with `mise run e2e` (specs and fixture course data live in `e2e/`)
- **Linting**: oxlint
- **Formatting**: oxfmt
- **Changelog**: Changesets, run with `mise run changeset`

When running Mise, always set the environment variable `MISE_ENV=agents` to make sure that the agentic tools are installed.

See `mise.toml` for available commands: `mise run --list`
