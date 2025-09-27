# Development Workflow and Environment Setup

This guide provides detailed instructions for AI coding assistants on development workflows, environment setup, and code quality processes for the Gobbldygook project.

## Environment Setup

### Prerequisites Verification

Before making any changes, verify the development environment:

```bash
# Check Node.js version (must be v22+)
node --version

# Verify npm is available
npm --version

# Check if mise is available (optional task runner)
mise --version 2>/dev/null || echo "mise not installed (optional)"
```

### Initial Setup Process

**CRITICAL**: Always run dependency installation first:

```bash
cd /path/to/gobbldygook
npm ci  # NEVER use npm install - always use npm ci for exact dependency versions
```

### Development Dependencies

Key development tools and their purposes:

- **Flow**: Static type checker (legacy but required)
- **ESLint**: Code quality and style enforcement
- **Prettier**: Automated code formatting
- **Jest**: Testing framework with coverage
- **Webpack**: Build system and development server
- **Babel**: JavaScript transpilation

## Development Workflow

### Pre-Development Checks

Run these commands to understand the current state:

```bash
# Check type errors
./node_modules/.bin/flow check --quiet

# Check linting issues
./node_modules/.bin/eslint --cache --report-unused-disable-directives --max-warnings=0 modules/

# Run tests to ensure nothing is broken
./node_modules/.bin/jest --runInBand --coverage

# Check formatting
./node_modules/.bin/prettier --check '{*,.*,{.circleci,modules,config,scripts}/**/*}.{js,json,scss,yml,yaml,md}'
```

All commands must pass with zero errors/warnings before making changes.

### Code Quality Standards

#### Flow Type Checking

- **Zero tolerance**: Must show "Found 0 errors"
- **Type annotations**: All functions should have Flow types
- **Custom types**: Defined in module-specific files or `flow-typed/`

```javascript
// @flow

type StudentSchedule = {
  id: string,
  courses: Course[],
  year: number,
  semester: string,
}

function processSchedule(schedule: StudentSchedule): boolean {
  // Implementation
}
```

#### ESLint Configuration

- **Zero warnings policy**: No warnings allowed in CI
- **React rules**: JSX, hooks, prop-types validation
- **Flow integration**: Type checking integration
- **Cache enabled**: Use `--cache` for performance

Common ESLint patterns to follow:
```javascript
// Prefer arrow functions for callbacks
const processData = data => data.map(item => transform(item))

// Use destructuring for props
function Component({ title, courses, onUpdate }) {
  // Implementation
}

// Prefer const/let over var
const immutableData = Object.freeze(data)
```

#### Prettier Formatting

- **Automatic formatting**: Never manually format code
- **Consistent style**: 2 spaces, single quotes, trailing commas
- **Pre-commit**: Format before committing

### Module Structure

#### Monorepo Organization

The project uses npm workspaces with 22 modules:

```
modules/
├── gob-web/              # Main React application (largest module)
├── gob-examine-student/  # Core evaluation logic
├── gob-hanson-format/    # Requirement language parser
├── gob-cli/              # Command-line tools
├── gob-worker-*/         # Web workers for background processing
├── gob-school-*/         # Institution-specific data and logic
└── gob-lib/              # Shared utilities
```

#### Module Independence

- Each module has its own `package.json`
- Cross-module dependencies declared explicitly
- Independent testing and building capability

#### Adding New Modules

1. Create directory in `modules/`
2. Add `package.json` with proper workspace configuration
3. Update root `package.json` workspaces array
4. Follow existing naming convention: `gob-*`

### Testing Strategy

#### Jest Configuration

- **Test environment**: jsdom for browser APIs
- **Coverage threshold**: Maintain current coverage levels
- **Parallel execution**: Use `--runInBand` for consistent results

#### Test File Organization

```
modules/module-name/
├── __tests__/           # Test files
├── source/              # Source code
└── package.json
```

#### Testing Best Practices

```javascript
// Use descriptive test names
describe('evaluateStudent', () => {
  it('should return passing status when all requirements are met', () => {
    // Test implementation
  })
})

// Mock external dependencies
jest.mock('@gob/course-data', () => ({
  getCourse: jest.fn(),
}))

// Test both success and error cases
it('should handle invalid course data gracefully', () => {
  expect(() => processInvalidCourse(null)).not.toThrow()
})
```

### Build and Development Servers

#### Production Build

**Critical**: Must change to `modules/gob-web/` directory:

```bash
cd modules/gob-web
NODE_ENV=production ../../node_modules/.bin/webpack --bail
```

Expected warnings (ignore these):
- Bundle size limit exceeded
- Duplicate package versions
- Export/import warnings from hanson-format

#### Development Server

For local development with hot reloading:

```bash
cd modules/gob-web
../../node_modules/.bin/webpack-dev-server
```

Access at `http://localhost:3000`

### Code Change Process

#### Making Changes

1. **Create feature branch**: From main/trunk branch
2. **Small commits**: Atomic changes with descriptive messages
3. **Test frequently**: Run tests after each logical change
4. **Type checking**: Verify Flow types are correct
5. **Format code**: Run Prettier before committing

#### Commit Message Format

Follow conventional commit format:

```
type(scope): description

- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting changes
- refactor: code restructuring
- test: test additions/changes
- chore: maintenance tasks
```

Examples:
```
feat(web): add course search filtering
fix(examine): handle missing requirement data
docs(readme): update setup instructions
```

#### Pre-Commit Checklist

- [ ] Flow type checking passes
- [ ] ESLint shows zero warnings
- [ ] Jest tests pass with coverage
- [ ] Prettier formatting applied
- [ ] Manual testing completed
- [ ] Build succeeds (if relevant)

### Debugging and Troubleshooting

#### Common Issues

1. **Flow errors**: Check type definitions in `flow-typed/`
2. **Build failures**: Verify Node.js version compatibility
3. **Test failures**: Check for async operation timing issues
4. **Module resolution**: Verify workspace configuration

#### Debugging Tools

- **React DevTools**: Browser extension for React debugging
- **Redux DevTools**: For state management debugging
- **Chrome DevTools**: Performance and network analysis
- **Flow Language Server**: IDE integration for type checking

#### Performance Monitoring

- **Webpack Bundle Analyzer**: Analyze bundle size
- **Jest Coverage**: Track test coverage metrics
- **Build Time**: Monitor CI/CD pipeline performance

### IDE and Editor Setup

#### Recommended Extensions

- **Flow Language Support**: Type checking in editor
- **ESLint**: Real-time linting feedback
- **Prettier**: Automatic formatting on save
- **Jest**: Test runner integration

#### Editor Configuration

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "flow.useNPMPackagedFlow": true,
  "javascript.validate.enable": false
}
```

### Continuous Integration

#### GitHub Actions Workflow

The CI pipeline runs:
1. Node.js setup and dependency installation
2. Flow type checking (must pass)
3. ESLint linting (zero warnings)
4. Jest testing with coverage
5. Prettier format checking
6. Webpack production build

#### CI Debugging

- **Log analysis**: Check GitHub Actions logs for specific failures
- **Local reproduction**: Run same commands locally
- **Dependency issues**: Clear cache and reinstall if needed

### Documentation Standards

#### Code Documentation

- **Flow types**: Self-documenting type annotations
- **JSDoc comments**: For complex functions only
- **README files**: Module-specific documentation

#### API Documentation

- **Function signatures**: Flow types as primary documentation
- **Usage examples**: In test files and comments
- **Change documentation**: Update relevant docs with code changes

### Security Considerations

#### Dependency Management

- **Regular updates**: Use Renovate for automated updates
- **Security audits**: `npm audit` for vulnerability scanning
- **Minimal dependencies**: Avoid unnecessary packages

#### Code Security

- **Input validation**: Sanitize user inputs
- **XSS protection**: Proper React prop handling
- **Data privacy**: Student data handling compliance