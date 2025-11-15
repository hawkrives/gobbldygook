# Skill: Create New Skill

## Purpose
Guide agents in creating new skill definitions that follow the Universal Agents framework conventions and maintain consistency across the skill catalog.

## Trigger conditions
- User explicitly requests creation of a new skill
- Task involves defining a new agent capability or workflow
- Need to document a specialized procedure that should be reusable

## Capability boundaries
- Can create skill documentation following established patterns
- Cannot execute the skill itself (that's the job of agents using the skill)
- Cannot modify existing skills without explicit permission

## Execution steps

1. **Understand the domain**
   - Clarify the skill's purpose with the user
   - Identify when the skill should be triggered
   - Define boundaries: what the skill can and cannot do
   
2. **Study reference materials**
   - Review documentation structure (markdown with YAML frontmatter)
   - Examine existing skills in `.agents/skills/` for patterns
   - Note how skills are referenced in `AGENTS.md`

3. **Define the skill structure**
   - **Title**: Clear, action-oriented name (e.g., "Skill: Code Review")
   - **Purpose**: One-sentence description of what the skill accomplishes
   - **Trigger conditions**: Specific scenarios when this skill should be loaded
   - **Capability boundaries**: Explicit limitations and scope constraints
   - **Execution steps**: Numbered, sequential procedure
   - **Output format**: Expected deliverables and response structure

4. **Follow conventions**
   - Use markdown with clear section headers (H2 ##)
   - Keep content focused and actionable
   - Include concrete examples where helpful
   - Avoid duplication with existing rules (reference them instead)
   - Make trigger conditions specific enough to avoid false positives

5. **Create the skill file**
   - Place in `.agents/skills/<skill-name>/SKILL.md`
   - Use lowercase-with-hyphens for directory names
   - Ensure the file is well-formatted and readable

6. **Update the manifest**
   - Add the new skill to the reference layout in `AGENTS.md`
   - Document when the skill should be loaded
   - Explain how it interacts with existing skills and rules

7. **Validate completeness**
   - Verify all required sections are present
   - Check that trigger conditions are unambiguous
   - Ensure execution steps are concrete and actionable
   - Confirm output format is clearly specified

## Output format

When creating a new skill, deliver:

- **Skill file**: Complete `.agents/skills/<skill-name>/SKILL.md` with all required sections
- **AGENTS.md update**: Modified `AGENTS.md` showing the new skill in the reference layout
- **Usage guidance**: Brief explanation of when and how to use the new skill
- **Validation checklist**: Confirmation that all required elements are present

## Best practices

- **Start simple**: Initial version should be minimal but complete
- **Be specific**: Vague trigger conditions lead to confusion
- **Show examples**: Include sample inputs/outputs when helpful
- **Reference, don't duplicate**: Point to rules rather than restating them
- **Iterate**: Skills can evolve based on usage feedback
- **Document dependencies**: Note if skill requires certain rules to be loaded

## Anti-patterns to avoid

- Creating skills that overlap heavily with existing ones
- Defining trigger conditions that are too broad
- Omitting capability boundaries (leads to scope creep)
- Writing execution steps that are too abstract to follow
- Forgetting to update AGENTS.md manifest
