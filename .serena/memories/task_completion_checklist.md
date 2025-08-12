# Task Completion Checklist

## After Making Code Changes

### 1. Code Quality Checks
- [ ] `mise run lint` - Check for linting errors
- [ ] `mise run flow` - Verify Flow type checking passes
- [ ] `mise run pretty` - Format code with Prettier

### 2. Testing
- [ ] `mise run test` - Run Jest test suite
- [ ] `mise run cover` - Check test coverage if needed
- [ ] Manual testing in browser for UI changes

### 3. Build Verification
- [ ] `mise run build-dev` - Verify development build works
- [ ] `mise run build` - Verify production build works
- [ ] Check bundle size and performance if significant changes

### 4. Git Workflow
- [ ] Stage changes: `git add .`
- [ ] Commit with descriptive message: `git commit -m "description"`
- [ ] Push to appropriate branch: `git push`

### 5. Deployment Considerations
- [ ] Production builds use `mise run netlify` for deployment
- [ ] Bugsnag notifications sent automatically on deploy
- [ ] Static assets copied to build directory
- [ ] Source maps generated for debugging

## Pre-Push Checklist
- All tests passing
- No Flow errors
- No linting errors
- Code formatted consistently
- Build artifacts generated successfully

## Performance Considerations
- Check webpack bundle analyzer output for large bundles
- Verify web workers load correctly
- Test IndexedDB operations
- Validate offline functionality