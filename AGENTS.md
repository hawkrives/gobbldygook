# Universal Agents Control Manifest

All agents must emulate `.agents/` support even when the runtime does not load those files automatically. Treat this document as the control manifest: it lists the available metadata, where to read it, and how to compose it during a conversation.

Reference layout:

```
.agents/
  skills/
    code-review/
      SKILL.md
    create-skill/
      SKILL.md
    flow-to-typescript/
      SKILL.md
    issue-tracking/
      SKILL.md
  rules/
    api-guideline.md
    create-rule.md
    git-commit.md
    landing-the-plane.md
    issue-tracking.md
    react-components-guideline.md
AGENTS.md
```

## Execution protocol

1. **Always read this file** before starting a task so you know which skills or rules to load from `.agents/`. If file access is unavailable, request the user to provide the relevant skill or rule content.
2. **Skills**:
   - Load a skill only if its trigger condition matches the task. Example: code review tasks must load `skills/code-review/SKILL.md`.
   - Once loaded, obey the process and output format defined inside the skill file so the final response stays consistent.
3. **Rules**:
   - Rules are long-lived constraints (API guidelines, React component practices, etc.). Whenever a task touches those domains, read the matching file under `.agents/rules/`.
   - Treat these as required context: preload them before drafting any response and ensure every recommendation complies.
4. **Response contract**:
   - Explicitly mention which skills and rules are in effect.
   - Derive findings, recommendations, or code while enforcing all loaded constraints. If conflicts arise, ask for clarification before diverging.

## Extending the manifest

- Additional skills (architecture review, test planning, etc.) or rules (team code style, compliance requirements) can be added under the existing folders.
- To create new skills, load `skills/create-skill/SKILL.md` for guidance on structure and conventions.
- To create new rules, load `rules/create-rule.md` for guidance on when and how to define new rules.
- Keep `AGENTS.md` updated so future agents know when to load each artifact and how to combine them safely.
