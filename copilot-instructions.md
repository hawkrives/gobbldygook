# Copilot Instructions

## Getting Started

**All Copilot agents must read `AGENTS.md` at the beginning of each session** to understand:

- Available skills and when to use them
- Repository rules and constraints
- Task definitions in `mise.toml`
- Execution protocols

## Before Finishing a Task

**Autonomous Copilot agents must invoke the landing-the-plane skill** before completing a task. This ensures:

- All code quality checks pass
- Work is properly tracked
- Repository is left in a clean state
- Next session has clear starting point

To invoke the landing-the-plane skill, follow the protocol defined in `.agents/rules/landing-the-plane.md`.

## Quick Reference

- **Skills location**: `.agents/skills/`
- **Rules location**: `.agents/rules/`
- **Tasks**: Defined in `mise.toml`, run with `mise run <task>`
- **Quality checks**: `mise run check` (runs lint, flow, test, prettier-check)

For complete details, **always refer to `AGENTS.md` first**.
