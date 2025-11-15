# Rule: Minibeads Issue Tracking Conventions

This rule establishes conventions for using minibeads (markdown-based issue tracker) to maintain consistent project tracking and workflow practices.

## Scope

- All issue creation, updates, and queries using `bd` commands
- Project planning and work breakdown structure
- Dependency management between tasks
- Integration with git commits and code TODOs

## When to apply this rule

Apply this rule when:
- Creating or updating issues in `.beads/` database
- Planning work or breaking down large tasks
- Setting up dependencies between issues
- Referencing issues in code or commits
- Querying project status or finding ready work

## Core principles

### 1. **Markdown-first storage**

Issues are stored as markdown files with YAML frontmatter in `.beads/issues/`. This makes them:
- Human-readable and editable
- Git-friendly (meaningful diffs and merges)
- Portable (no database dependencies)

**Do NOT** manually edit files in `.beads/issues/`. Always use `bd` commands to ensure data integrity.

### 2. **Use description field only**

When creating or updating issues, put ALL content in the `--description` field.

**Never use the `--notes` field** as it creates duplication and confusion between description and notes. Consolidate all information in the description.

```bash
# Correct
bd create "Title" --description "Full description with all details"

# Incorrect
bd create "Title" --description "Brief" --notes "More details"
```

### 3. **Always update existing issues**

Before creating a new issue, search for existing ones:

```bash
bd list --status open | grep "keyword"
```

**Use `bd update` to modify existing issues** - never create duplicates with `bd create`.

```bash
# Correct: Update existing issue
bd update project-42 --description "Updated description"

# Incorrect: Creating duplicate
bd create "Same title as project-42"
```

### 4. **Priority conventions**

Maintain consistent priority levels across the project:

- **Priority 0**: Reserved for tracking issues (typically created by humans, not agents)
- **Priority 1**: High-level tracking issues (epics, milestones) that organize other work
- **Priority 2**: Critical bugs or urgent work that blocks significant progress
- **Priority 3-4**: Regular tasks, features, and standard work items

Epic tracking issues (priority 0-1) should reference granular issues by ID in their description.

### 5. **Structured issue descriptions**

Every issue should follow a consistent structure:

```markdown
# Description

[Clear explanation of what needs to be done and why]

# Design

[Technical approach or solution design - optional but recommended for complex work]

# Acceptance Criteria

- [ ] Criterion 1 that must be met
- [ ] Criterion 2 that must be met
- [ ] All tests pass
- [ ] Documentation updated
```

Mark completed criteria with `[x]` as work progresses.

### 6. **Dependency management**

Make blocking relationships explicit:

```bash
# Syntax: bd dep add FROM_ISSUE TO_ISSUE
# Meaning: TO_ISSUE blocks FROM_ISSUE

# Example: project-2 blocks project-1
bd dep add project-1 project-2 --type blocks
```

**Dependency types**:
- `blocks` (default): Hard blocker - FROM cannot proceed until TO is done
- `related`: Soft relationship - issues are connected but don't block
- `parent-child`: Hierarchical organization
- `discovered-from`: Issue found while working on another

### 7. **Reference issues in code**

When adding TODOs in code, always reference the tracking issue:

```javascript
// TODO(project-42): Implement caching for API responses
```

```python
# TODO(project-15): Refactor this function to use async/await
```

When resolving the TODO:
1. Remove the comment from code
2. Close the issue with `bd close project-42`
3. Reference the issue in the commit message

### 8. **Issue types**

Use appropriate types for different kinds of work:

- **epic**: Large tracking issue that references multiple sub-issues
- **bug**: Defect or problem that needs fixing
- **feature**: New functionality or capability
- **task**: Regular work item or implementation
- **chore**: Maintenance, refactoring, documentation, or housekeeping

### 9. **Git commit integration**

Synchronize issue status with git commits:

**Before committing**:
- Update issue status: `bd update project-42 --status in_progress`
- Mark completed acceptance criteria: `[x]`
- Close completed issues: `bd close project-42`

**In commit messages**:
- Reference relevant issues: "Fixes project-42: Add user authentication"
- Mention new issues: "Created project-43 to track performance optimization"

### 10. **Query and workflow patterns**

Use consistent commands to manage workflow:

```bash
# Find actionable work
bd ready --assignee me

# Check what's blocking progress
bd blocked

# Review project health
bd stats

# List by priority
bd list --priority 2

# Show full issue details
bd show project-42
```

## Project-specific conventions

### Issue prefix

The issue prefix should match the project or repository name. For the gobbldygook project, issues would be prefixed as `gobbldygook-1`, `gobbldygook-2`, etc.

Set this during initialization:
```bash
bd init --prefix gobbldygook
```

### Tracking issue hierarchy

Maintain a hierarchical structure:
1. **Overall tracking issue** (priority 0): References all major tracking issues
2. **Topic tracking issues** (priority 1): Organize work by feature area or milestone
3. **Granular issues** (priority 2-4): Specific tasks and bugs

### Transient information

When recording time-sensitive information (benchmarks, temporary notes):

```markdown
**As of 2025-11-15**: Current implementation achieves 500ms response time
```

Update or remove outdated information during issue maintenance.

## Validation checklist

Before finalizing issue work:

- [ ] Issue has clear, descriptive title
- [ ] Description includes context and reasoning
- [ ] Acceptance criteria are specific and testable
- [ ] Priority follows project conventions
- [ ] Dependencies are set correctly
- [ ] Issue type matches the work
- [ ] Referenced in code TODOs if applicable
- [ ] Status reflects current state
- [ ] Will be referenced in commit message

## Anti-patterns to avoid

❌ **Creating duplicates**: Always search and update existing issues
❌ **Using `--notes` field**: Consolidate all content in description
❌ **Manual file editing**: Never edit `.beads/issues/*.md` directly
❌ **Vague descriptions**: Be specific about what needs to be done
❌ **Missing acceptance criteria**: Define clear completion conditions
❌ **Orphan TODOs**: Every code TODO should reference an issue
❌ **Stale issues**: Close completed work, update status regularly
❌ **Forgotten dependencies**: Document blocking relationships

## Usage examples

### Creating a well-structured issue

```bash
bd create "Implement user authentication" \
  --priority 3 \
  --type feature \
  --assignee alice \
  --description "$(cat <<EOF
# Description

Users need to log in with email and password to access protected features.
Current system has no authentication mechanism.

# Design

- Use JWT tokens for session management
- Store hashed passwords with bcrypt
- Implement login and logout endpoints
- Add authentication middleware

# Acceptance Criteria

- [ ] POST /auth/login endpoint accepts email/password
- [ ] POST /auth/logout invalidates JWT token
- [ ] Protected routes require valid JWT
- [ ] Passwords hashed with bcrypt (10 rounds)
- [ ] Tests cover happy path and error cases
- [ ] API documentation updated
EOF
)"
```

### Setting up a tracking epic

```bash
# Create epic
bd create "Phase 1: Core Features" --priority 1 --type epic

# Create sub-tasks
bd create "Implement data model" --priority 3 --type task
bd create "Build API endpoints" --priority 3 --type task
bd create "Add validation" --priority 3 --type task

# Set dependencies (sub-tasks block epic)
bd dep add gobbldygook-1 gobbldygook-2
bd dep add gobbldygook-1 gobbldygook-3
bd dep add gobbldygook-1 gobbldygook-4

# Update epic to reference sub-tasks
bd update gobbldygook-1 --description "$(cat <<EOF
# Description

Phase 1 tracking issue for core features.

## Sub-tasks
- gobbldygook-2: Data model
- gobbldygook-3: API endpoints  
- gobbldygook-4: Validation

All sub-tasks must complete before Phase 1 is done.
EOF
)"
```

## Integration with other rules

This rule should be used in conjunction with:
- **git-commit.md**: For commit message formatting when referencing issues
- **code-review/**: For ensuring TODOs reference issues during reviews
- Project-specific guidelines for workflow and branching

## Environment variables

- `MB_BEADS_DIR`: Path to `.beads` directory
- `BEADS_DB`: Alternative path specification (supports `.db` extension)
- `BEADS_WORKING_DIR`: Working directory for MCP operations

## Further reading

- Minibeads README: https://github.com/rrnewton/minibeads
- MCP specification: https://modelcontextprotocol.io
- Original beads: https://github.com/steveyegge/beads
