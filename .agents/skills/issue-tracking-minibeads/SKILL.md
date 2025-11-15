# Skill: Issue Tracking with Minibeads

## Purpose
Guide agents through using minibeads (`bd`) for markdown-based issue tracking, dependency management, and project workflow coordination in a git-friendly manner.

## Trigger conditions
- User requests issue creation, tracking, or management
- Task involves project planning or work breakdown
- Need to track dependencies between tasks
- Working with `.beads/` directory or `bd` commands

## Capability boundaries
- Can guide creation and management of issues via `bd` CLI
- Can query issue status, dependencies, and ready work
- Cannot directly modify `.beads/` database files (use `bd` commands only)
- Requires minibeads (`bd`) to be installed and initialized

## Execution steps

1. **Verify minibeads setup**
   
   Check if minibeads is initialized:
   ```bash
   # Check for .beads directory
   ls -la .beads/
   
   # If not initialized, run:
   bd init [--prefix PROJECT_NAME]
   ```
   
   The prefix defaults to the directory name but should be set explicitly for clarity.

2. **Create issues following project conventions**
   
   When creating issues, use structured titles and comprehensive descriptions:
   ```bash
   bd create "Title describing the task" \
     --priority 1-4 \
     --type bug|feature|task|epic|chore \
     --assignee username \
     --description "Detailed description with acceptance criteria"
   ```
   
   **Priority guidelines**:
   - Priority 0: Reserved for tracking issues (created by humans)
   - Priority 1: High-level tracking issues (epics, milestones)
   - Priority 2: Critical bugs or urgent work
   - Priority 3-4: Regular tasks and features
   
   **Issue types**:
   - `epic`: Large tracking issue that references other issues
   - `bug`: Defect or problem that needs fixing
   - `feature`: New functionality or enhancement
   - `task`: Regular work item
   - `chore`: Maintenance, refactoring, or housekeeping

3. **Structure issue descriptions properly**
   
   Each issue should contain:
   
   ```markdown
   # Description
   
   [Clear explanation of what needs to be done and why]
   
   # Design
   
   [Technical approach or solution design - optional]
   
   # Acceptance Criteria
   
   - [ ] Criterion 1
   - [ ] Criterion 2
   - [ ] Tests pass
   ```
   
   **Important**: Always use the description field via `--description`. Do NOT use `--notes` as it creates duplication.

4. **Manage dependencies**
   
   Track blocking relationships between issues:
   ```bash
   # Issue B blocks Issue A (A cannot proceed until B is done)
   bd dep add ISSUE_A ISSUE_B --type blocks
   
   # Other dependency types:
   # - related: Issues are related but don't block
   # - parent-child: Hierarchical relationship
   # - discovered-from: Issue found while working on another
   ```
   
   Dependency direction: `bd dep add FROM TO` means TO blocks FROM.

5. **Query and find ready work**
   
   Find actionable work with no blockers:
   ```bash
   # Show all ready issues (no dependencies blocking them)
   bd ready
   
   # Filter by assignee
   bd ready --assignee username
   
   # Filter by priority
   bd ready --priority 3
   
   # Show blocked issues and what blocks them
   bd blocked
   ```

6. **Update issue status and fields**
   
   ```bash
   # Update status
   bd update ISSUE_ID --status open|in_progress|blocked|closed
   
   # Update other fields
   bd update ISSUE_ID --priority 2
   bd update ISSUE_ID --assignee username
   bd update ISSUE_ID --description "Updated description"
   
   # Add or update acceptance criteria
   bd update ISSUE_ID --description "$(cat <<EOF
   # Description
   Original content
   
   # Acceptance Criteria
   - [x] Completed item
   - [ ] Pending item
   EOF
   )"
   ```
   
   **Always use `bd update` for existing issues** - never create duplicates with `bd create`.

7. **Close and reopen issues**
   
   ```bash
   # Close completed issue
   bd close ISSUE_ID --reason "Completed: [brief summary]"
   
   # Reopen if needed
   bd reopen ISSUE_ID
   ```

8. **View and monitor progress**
   
   ```bash
   # Show detailed issue information
   bd show ISSUE_ID
   
   # List all issues with filters
   bd list
   bd list --status open
   bd list --assignee username
   bd list --priority 2
   
   # Get project statistics
   bd stats
   ```
   
   The markdown files in `.beads/issues/` are human-readable and can be reviewed directly.

9. **Reference issues in code**
   
   When adding TODOs in code, reference the tracking issue:
   ```javascript
   // TODO(project-42): Implement caching for API responses
   ```
   
   When the issue is resolved, remove the TODO and close the issue.

10. **Coordinate with git commits**
    
    Update issues as part of your commit workflow:
    - Mark completed acceptance criteria with `[x]`
    - Update status to reflect progress
    - Close completed issues
    - Reference relevant issues in commit messages
    - Mention new issues created for bugs found or future work

## Output format

When working with minibeads, deliver:

- **Issue creation summary**: Issue ID, title, priority, initial status
- **Dependency graph**: Clear explanation of blocking relationships
- **Ready work identification**: List of actionable issues with no blockers
- **Progress updates**: Status changes and completion of acceptance criteria
- **Issue references**: Citations in code (TODOs) and commit messages

## Best practices

- **One issue per logical task**: Keep issues focused and atomic
- **Clear dependencies**: Make blocking relationships explicit
- **Update existing issues**: Use `bd update` instead of creating duplicates
- **Structured descriptions**: Use consistent sections (Description, Design, Acceptance Criteria)
- **Priority discipline**: Follow project conventions for priority levels
- **Git integration**: Keep issue status synchronized with git commits
- **No manual file editing**: Always use `bd` commands, never edit `.beads/issues/*.md` directly
- **Tracking issues**: Use priority 0-1 epics to organize work hierarchically

## Anti-patterns to avoid

- Creating duplicate issues instead of updating existing ones
- Using `--notes` field (causes duplication - use description only)
- Editing `.beads/issues/*.md` files directly
- Creating issues without proper structure or acceptance criteria
- Ignoring dependencies when planning work
- Forgetting to close issues after completion
- Missing issue references in code TODOs
- Not synchronizing issue status with actual progress

## Common workflows

### Starting new work
```bash
# Find ready work
bd ready --assignee me

# Review issue details
bd show project-42

# Update status when starting
bd update project-42 --status in_progress
```

### Breaking down large tasks
```bash
# Create epic tracking issue
bd create "Implement authentication system" --priority 1 --type epic

# Create sub-tasks
bd create "Add login endpoint" --priority 3 --type feature
bd create "Add password hashing" --priority 3 --type feature
bd create "Add session management" --priority 3 --type feature

# Set up dependencies (sub-tasks must complete before epic)
bd dep add project-1 project-2
bd dep add project-1 project-3
bd dep add project-1 project-4
```

### Handling blockers
```bash
# Discover a blocker while working
bd create "Fix database connection pool" --priority 2 --type bug

# Mark current task as blocked by the new issue
bd dep add project-5 project-6 --type blocks

# Update current task status
bd update project-5 --status blocked

# Work on the blocker instead
bd update project-6 --status in_progress
```

## Integration with MCP

Minibeads supports Model Context Protocol for AI agent integration:

- Set `MB_BEADS_DIR` or `BEADS_DB` environment variable
- MCP server auto-discovers `.beads/` in project root
- Agents can create, update, query, and close issues programmatically
- Full dependency tracking and ready work identification via MCP

## Storage format

Issues are stored as markdown files with YAML frontmatter:

```
.beads/
├── config.yaml           # Contains issue-prefix
├── .gitignore           # Auto-managed
└── issues/
    ├── project-1.md     # Issue files
    └── project-2.md
```

Files are git-friendly and merge well. Review changes with `git diff .beads/`.

## Troubleshooting

**Problem**: `bd` command not found
- **Solution**: Install minibeads and ensure it's in PATH. Check with `which bd`.

**Problem**: "Database not initialized" error
- **Solution**: Run `bd init` in project root to create `.beads/` directory.

**Problem**: Duplicate issues created
- **Solution**: Always use `bd update ISSUE_ID` to modify existing issues. Search first with `bd list`.

**Problem**: Issue shows as blocked but dependency is resolved
- **Solution**: Check dependencies with `bd show ISSUE_ID`. Remove stale deps with `bd dep remove`.

**Problem**: Can't find issue by number
- **Solution**: Use full issue ID with prefix (e.g., `project-42` not just `42`).
