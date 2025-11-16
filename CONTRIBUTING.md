# Contributing to Gobbldygook

Thank you for contributing! This project uses an agents-based workflow with centralized rules to maintain consistency.

## Before You Commit

**IMPORTANT**: Before committing any work, consult the **Git Commit rule** at `.agents/rules/git-commit.md`.

This rule defines:
- Commit message format and structure
- Type classifications (`feat`, `fix`, `docs`, `chore`, etc.)
- Constraints on logical changes per commit
- Best practices for clean history

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
- `.agents/rules/minibeads-conventions.md` - Issue tracking conventions
- `.agents/rules/react-components-guideline.md` - React component patterns
- `.agents/rules/api-guideline.md` - API design guidelines
- `.agents/rules/create-rule.md` - How to create new rules
- `.agents/skills/` - Reusable processes for common tasks

## Quick Reference

- **Package manager**: npm (with workspaces in `modules/*`)
- **Node version**: ≥22 (managed by mise)
- **Type checking**: Flow v0.82.0
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier

See `mise.toml` for available commands: `mise run --list`
