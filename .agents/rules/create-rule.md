# Rule: Create New Rule

This rule explains how to create new rule documents that establish long-lived constraints and guidelines for agent behavior across the Universal Agents framework.

## Scope

- Creating new rule files under `.agents/rules/`
- Documenting domain-specific constraints (coding standards, API conventions, etc.)
- Establishing consistency guidelines that apply across multiple tasks

## When to create a rule

Create a new rule when you need to:

1. **Codify repeated guidance**: The same advice is given multiple times across different tasks
2. **Establish domain constraints**: Define boundaries for a specific technical domain (API design, testing, security, etc.)
3. **Document team conventions**: Capture agreed-upon practices that should be consistently applied
4. **Provide context for multiple skills**: Create shared knowledge that multiple skills reference

## When NOT to create a rule

Do NOT create a rule for:

- One-off instructions specific to a single task
- Procedural workflows (those belong in skills)
- Project-specific implementation details (those belong in project documentation)
- Temporary or experimental guidelines

## Rule structure template

Every rule file should follow this structure:

```markdown
# Rule: <Rule Name>

<One-sentence description of what this rule governs>

## Scope

- List the domains/contexts where this rule applies
- Be specific about when to load this rule

## Guidance

<Numbered or bulleted list of constraints, principles, and practices>

1. **Principle name**: Detailed explanation with examples
2. **Principle name**: Detailed explanation with examples
...

## Usage

- Explain when to preload this rule
- Note any exceptions or override conditions
- Document how this rule interacts with other rules
```

## Guidance for creating effective rules

1. **Clear scope definition**: Start by explicitly defining when this rule applies. Agents should know immediately whether a rule is relevant to their current task.

2. **Actionable constraints**: Write rules as specific, testable constraints rather than vague guidelines. "Use camelCase for variable names" is better than "Follow good naming practices."

3. **Explain the why**: Include brief rationale for constraints when it helps understanding. "Use dependency injection (enables testing and modularity)" is clearer than just "Use dependency injection."

4. **Provide examples**: Show concrete examples of correct and incorrect patterns when helpful for clarity.

5. **Declare precedence**: If rules might conflict, document which takes priority or under what conditions one overrides another.

6. **Reference, don't duplicate**: If a rule relates to existing project documentation or external standards, reference them rather than duplicating content.

7. **Keep rules focused**: Each rule should cover a single domain or concern. Split large rules into multiple focused ones.

8. **Document exceptions**: If there are legitimate exceptions to a rule, document them explicitly rather than making agents guess.

9. **Use consistent terminology**: Align with terms used in project documentation and other rules to avoid confusion.

10. **Make rules maintainable**: Write rules that can be updated as practices evolve without breaking existing guidance.

## File naming conventions

- Use lowercase with hyphens: `api-guideline.md`, `security-practices.md`
- Name should clearly indicate the domain: `testing-strategy.md` not `tests.md`
- Avoid overly general names: `react-components-guideline.md` not `frontend.md`

## Integration with AGENTS.md

After creating a new rule:

1. **Update reference layout**: Add the rule file to the list in `AGENTS.md`
2. **Document trigger conditions**: Explain when agents should preload this rule
3. **Note interactions**: If this rule should be loaded alongside other rules, document that relationship

## Validation checklist

Before finalizing a new rule, verify:

- [ ] Scope is clearly defined
- [ ] Guidance is specific and actionable
- [ ] Examples are provided where helpful
- [ ] Exceptions are documented
- [ ] File name follows conventions
- [ ] AGENTS.md is updated
- [ ] Rule doesn't duplicate existing rules
- [ ] Content is focused on constraints, not procedures

## Anti-patterns to avoid

- **Too abstract**: "Write good code" is not a rule, it's a platitude
- **Too specific**: Rules about a single function belong in code comments, not in `.agents/rules/`
- **Procedural content**: Step-by-step workflows belong in skills, not rules
- **Conflicting with existing rules**: Check for conflicts before adding new constraints
- **One-time instructions**: Rules should apply across multiple tasks
- **Project details**: Implementation specifics belong in project docs, not agent rules

## Examples of good rules

- **API Guideline**: REST API design principles (resource modeling, HTTP semantics, versioning)
- **Git Commit**: Commit message format and conventions
- **React Components**: Component structure, props typing, testing requirements
- **Security Practices**: Authentication, authorization, input validation standards
- **Testing Strategy**: Test pyramid, coverage requirements, naming conventions

## Examples of bad rules (and where they should go instead)

- **"How to set up the project"** → Project README.md
- **"Steps to deploy to production"** → Skill: Production Deployment
- **"Database schema for users table"** → Project documentation
- **"Fix bug #123"** → Task-specific instructions, not a rule
- **"Use the latest version of React"** → Too specific, belongs in package.json + changelog
