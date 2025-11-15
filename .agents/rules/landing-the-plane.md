# Rule: Landing the Plane

This rule defines the protocol for cleanly ending a working session, ensuring all work is properly tracked, quality gates pass, and the repository is left in a clean state for the next session.

## Scope

- Session completion and handoff procedures
- Quality gate validation
- Issue tracking synchronization
- Git state management
- Next session planning

## When to apply this rule

Apply this rule when:
- User says "let's land the plane" or similar session-ending phrases
- Reaching the end of a focused work session
- Preparing to hand off work to another session or developer
- Before taking an extended break from the project

## Landing the Plane Protocol

**When the user says "let's land the plane"**, follow this clean session-ending protocol:

### 1. File issues for any remaining work

Document any unfinished work, discovered bugs, or follow-up tasks:

```bash
# Create issues for follow-up work
bd create "Add integration tests for authentication" --type task --priority 3
bd create "Performance optimization for search" --type chore --priority 4
bd create "Bug: Date picker doesn't handle timezones" --type bug --priority 2
```

### 2. Run quality gates (only if code changes were made)

Execute all relevant quality checks to ensure code meets project standards:

```bash
# Run linter
mise run lint
# or: ./node_modules/.bin/eslint --cache --report-unused-disable-directives --max-warnings=0 modules/

# Run Flow type checking
mise run flow
# or: ./node_modules/.bin/flow

# Run tests
mise run test
# or: ./node_modules/.bin/jest

# Run prettier check (optional)
./node_modules/.bin/prettier --check '{*,.*,{.circleci,modules,config,scripts}/**/*}.{js,json,scss,yml,yaml,md}'
```

**Important**: If any quality gates fail:
- File P0 (priority 0) issues for critical failures that block deployment
- File P2 issues for non-critical failures that should be fixed soon
- Document the failure state in the issue description

### 3. Update issue tracker

Close finished work and update status of in-progress issues:

```bash
# Close completed issues
bd close PREFIX-42 --reason "Completed: Implemented user authentication"
bd close PREFIX-43 --reason "Completed: Added unit tests for auth module"

# Update in-progress issues
bd update PREFIX-44 --status in_progress --description "$(cat <<EOF
# Description
Implement password reset flow

# Progress
- [x] Design reset token mechanism
- [x] Add email template
- [ ] Implement reset endpoint
- [ ] Add tests

Currently working on the reset endpoint implementation.
EOF
)"
```

### 4. Sync the issue tracker carefully

Work methodically to ensure both local and remote issues merge safely:

```bash
# Pull latest changes (rebase to maintain clean history)
git pull --rebase origin main

# If conflicts occur in .beads/* files:
# 1. Review each conflict carefully
# 2. Keep changes that represent real work progress
# 3. Resolve thoughtfully - don't blindly accept ours or theirs
# 4. Verify issue consistency after resolution

# Push all changes
git push origin your-branch-name

# If push fails due to new commits, repeat pull/rebase/push cycle
```

**Conflict resolution guidelines**:
- For issue content conflicts: Merge descriptions if both have valid updates
- For status conflicts: Use the most recent valid status
- For dependency conflicts: Preserve all valid dependencies
- When in doubt: Create a new issue documenting the conflict for manual review

### 5. Clean up git state

Remove stale data and prune obsolete references:

```bash
# Clear old stashes (only if you're sure they're not needed)
git stash list  # Review first
git stash clear # Only if nothing important

# Prune deleted remote branches
git remote prune origin

# Clean up any untracked build artifacts (if applicable)
git clean -fd -e node_modules -e .beads  # Dry run: add -n flag first
```

### 6. Verify clean state

Ensure repository is ready for next session:

```bash
# Check for uncommitted changes
git status

# Verify all commits are pushed
git log origin/your-branch..HEAD

# Confirm no untracked files that should be committed
git ls-files --others --exclude-standard
```

**Clean state checklist**:
- [ ] All changes committed
- [ ] All commits pushed to remote
- [ ] No untracked files that should be versioned
- [ ] No merge conflicts remaining
- [ ] Quality gates passing (or issues filed)
- [ ] Issues updated to reflect current state

### 7. Choose a follow-up issue for next session

Identify the next priority work and provide context:

```bash
# Find ready work
bd ready --priority 2

# Show details of chosen issue
bd show PREFIX-45

# Check dependencies
bd show PREFIX-45 | grep -A 10 "depends_on"
```

**Provide the user with**:
1. **Summary of completed work**: List closed issues and key accomplishments
2. **Filed issues**: New issues created for follow-up work
3. **Quality gate status**: All passing, or specific issues filed for failures
4. **Recommended next session prompt**: Clear, actionable starting point

## Next session prompt template

Format the next session prompt as:

```
Continue work on PREFIX-X: [issue title]

Context:
- Completed in this session: [brief list]
- Current state: [what's working, what's in progress]
- Next steps: [specific actions to take]
- Dependencies: [any blocking issues]

Commands to start:
1. bd show PREFIX-X
2. [specific command to begin work]
```

## Example "land the plane" session

```bash
# 1. File remaining work
bd create "Add E2E tests for course planner" --type task --priority 3 --description "Need integration tests covering the full student workflow"
bd create "Optimize render performance in course list" --type chore --priority 4

# 2. Run quality gates (code changes were made)
mise run lint
# ✓ No lint errors

mise run flow
# ✓ No type errors

mise run test
# ✓ All tests pass (45 test suites, 234 tests)

# 3. Close finished issues
bd close gobbldygook-42 --reason "Completed: Added user authentication with JWT"
bd close gobbldygook-43 --reason "Completed: Unit tests for auth module"

# 4. Sync carefully
git pull --rebase origin main
# No conflicts

git push origin feature/user-auth
# Successfully pushed

# 5. Clean up git state
git stash list
# No stashes

git remote prune origin
# Pruned 2 obsolete branches

git status
# Clean working tree

# 6. Choose next work
bd ready --priority 2
# gobbldygook-45: Implement password reset flow

bd show gobbldygook-45
# Shows details and acceptance criteria
```

**Session summary provided to user**:

```
Session Summary
===============

Completed this session:
- gobbldygook-42: User authentication with JWT tokens
- gobbldygook-43: Comprehensive unit tests for auth module
- Added middleware for protected routes
- Updated API documentation

Filed for follow-up:
- gobbldygook-46: Add E2E tests for course planner
- gobbldygook-47: Optimize render performance in course list

Quality gates:
✓ Lint: No errors
✓ Flow: No type errors  
✓ Tests: 45 suites, 234 tests, all passing

Recommended next session prompt:
---
Continue work on gobbldygook-45: Implement password reset flow

Context:
- Completed in this session: User authentication system with login/logout
- Current state: Auth foundation is working, middleware in place
- Next steps: Build password reset with email token mechanism
- Dependencies: None (ready to start)

Commands to start:
1. bd show gobbldygook-45
2. bd update gobbldygook-45 --status in_progress
3. Review existing email templates in modules/gob-web/emails/
```

## Best practices

- **Always run quality gates** if any code was changed - never skip this step
- **File issues generously** - better to have too many tracked items than lose context
- **Sync thoughtfully** - don't rush the git merge process, take time to resolve conflicts properly
- **Provide clear context** - the next session should be able to start immediately with your prompt
- **Verify clean state** - triple-check that everything is pushed and committed
- **Be specific in prompts** - include actual command examples, not just general guidance

## Anti-patterns to avoid

❌ **Skipping quality gates** - leads to broken CI/CD and wasted time debugging later
❌ **Leaving uncommitted changes** - creates confusion and potential data loss
❌ **Vague next session prompts** - forces the next session to waste time figuring out context
❌ **Force-pushing without coordination** - can overwrite others' work
❌ **Blindly accepting conflict resolutions** - can lose important issue information
❌ **Not filing follow-up issues** - loses track of remaining work and technical debt
❌ **Rushing the cleanup** - small oversights create big problems later

## Integration with other rules

This rule should be used in conjunction with:
- **minibeads-conventions.md**: For proper issue creation and management
- **git-commit.md**: For commit message format throughout the session
- **code-review**: For quality validation before landing

## Notes for gobbldygook project

- **Test command**: `mise run test` or `./node_modules/.bin/jest`
- **Lint command**: `mise run lint` or ESLint directly
- **Flow check**: `mise run flow` or `./node_modules/.bin/flow`
- **Prettier**: `mise run pretty` or `./node_modules/.bin/pretty-quick`
- **Build validation**: `mise run build` (if changes affect build process)
- **Issue prefix**: Use `gobbldygook-` for all issue IDs in this project
- **Branch naming**: Follow existing patterns (e.g., `feature/`, `fix/`, `chore/`)

## Troubleshooting

**Problem**: Quality gates fail but issue is unclear
- **Solution**: Run commands individually with verbose output. File issue with full error context.

**Problem**: Git conflicts in .beads/ during sync
- **Solution**: Use `git diff` to understand both versions. Merge manually, preserving valid information from both sides.

**Problem**: Can't push - "Updates were rejected"
- **Solution**: Pull with rebase, resolve conflicts, push again. Don't force-push unless coordinated.

**Problem**: Forgot to file follow-up issues
- **Solution**: File them retroactively before starting next session. Better late than never.

**Problem**: Next session prompt is too vague
- **Solution**: Include specific commands, file paths, and context. Test by imagining you're reading it fresh in 2 weeks.
