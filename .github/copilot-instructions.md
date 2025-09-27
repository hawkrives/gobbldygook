# Gobbldygook Copilot Instructions

## Project Overview

**Gobbldygook** is a course scheduler for students at St. Olaf College. It's a React-based single-page application that helps students determine if they can graduate by analyzing their course requirements against their planned coursework.

### High-Level Information

- **Type**: Web application (SPA) with monorepo structure
- **Size**: ~546 JavaScript files, ~20 SCSS files across 22 modules
- **Languages**: JavaScript (with Flow type checking), CSS/SCSS, HTML
- **Framework**: React 18 with Redux for state management
- **Runtime**: Node.js 22+ (specified in mise.toml and package.json engines)
- **Build System**: Webpack 5 with Babel transpilation
- **Package Management**: npm (uses workspaces for monorepo)
- **Deployment**: Netlify (configured in netlify.toml)

### Key Technologies

- React 18.3 with React Router and Redux
- Flow 0.82 for static type checking
- Webpack 5 for bundling
- Jest for testing
- ESLint + Prettier for code quality
- IndexedDB for client-side storage
- Styled Components for CSS-in-JS

## Build and Validation Instructions

### Prerequisites

- **Node.js v22+** (enforced by engines field)
- npm (included with Node.js)
- The project uses `mise` as a task runner (configured in mise.toml)

### Environment Setup

**ALWAYS run `npm ci` before any other commands** to install dependencies. The build will fail without this step.

```bash
cd /path/to/gobbldygook
npm ci  # Install exact versions from package-lock.json
```

### Core Commands

All commands should be run from the repository root unless specified otherwise.

#### Dependencies and Installation

```bash
npm ci  # ALWAYS run first - installs exact dependency versions
```

#### Testing (Jest)

```bash
./node_modules/.bin/jest --runInBand --coverage
# OR using mise:
# mise run test -- --runInBand --coverage

# To run individual module tests:
./node_modules/.bin/jest modules/MODULE_NAME/__tests__/ --runInBand
```

- Tests take ~20 seconds to complete for full suite
- Individual module tests run in <1 second
- Coverage reports are generated in coverage/ directory
- Uses jsdom test environment for browser APIs
- 94 test suites with 561 tests (4 suites skipped, 18 tests skipped)

#### Linting (ESLint)

```bash
./node_modules/.bin/eslint --cache --report-unused-disable-directives --max-warnings=0 modules/
```

- Linting must pass with zero warnings
- Configuration in .eslintrc.yml with React and Flow rules
- Cache is used for performance

#### Type Checking (Flow)

```bash
./node_modules/.bin/flow check --quiet
```

- Must show "Found 0 errors" to pass
- Configuration in .flowconfig
- Type definitions in flow-typed/ directory

#### Code Formatting (Prettier)

```bash
./node_modules/.bin/prettier --write '{*,.*,{.circleci,modules,config,scripts}/**/*}.{js,json,scss,yml,yaml,md}'
```

- Configuration in .prettierrc.yml
- Must not make any changes when run (git diff --exit-code)

#### Building (Webpack)

```bash
cd modules/gob-web
NODE_ENV=production ../../node_modules/.bin/webpack --bail
```

- **IMPORTANT**: Must change to modules/gob-web directory first
- Build output goes to modules/gob-web/build/
- Takes ~20-25 seconds to complete
- Expect warnings about bundle size and duplicate packages (these are known)
- After building, run `node scripts/rearrange-for-circle.js` to prepare files for deployment

#### Development Server

```bash
cd modules/gob-web
../../node_modules/.bin/webpack-dev-server
```

### CI/CD Pipeline

The GitHub Actions workflow (.github/workflows/ci.yml) runs:

1. Flow type checking
2. Jest tests with coverage
3. ESLint linting (including SARIF output for security)
4. Prettier format checking
5. Webpack production build

### Common Issues and Workarounds

1. **Node Version Mismatch**: Project requires Node.js 22+. Current CI uses node 20 but project still builds (with warnings).

2. **cross-env Not Found**: The package uses `cross-env` in scripts but it may not be globally available. Use `NODE_ENV=production` directly instead.

3. **Build Warnings**: The webpack build produces several expected warnings:
   - Bundle size limits exceeded (known issue)
   - Duplicate package versions (documented in DuplicatePackageCheckerPlugin warnings)
   - Export/import warnings from hanson-format module (known issue)

4. **Flow Type Definitions**: If flow type checking fails, run the update script:
   ```bash
   bash scripts/update-flow-typedefs.sh
   ```

## Project Layout and Architecture

### Root Directory Structure

```
├── .github/              # GitHub Actions workflows
├── babel.config.js       # Babel configuration for JS transpilation
├── config/              # Build and test configuration
├── flow-typed/          # Flow type definitions
├── mise.toml           # Task runner configuration
├── modules/            # Monorepo packages (22 modules)
├── netlify.toml        # Netlify deployment config
├── package.json        # Root package with workspaces
├── scripts/            # Build and maintenance scripts
└── README.md           # Project documentation
```

### Module Architecture

The project uses a monorepo structure with 22 modules in the `modules/` directory:

**Core Modules:**

- `gob-web/` (14M) - Main React application and UI components
- `gob-examine-student/` (444K) - Student evaluation and requirement checking logic
- `gob-hanson-format/` (304K) - Domain-specific language parser for area requirements
- `gob-cli/` (220K) - Command-line tools for validation and examination

**Supporting Modules:**

- `gob-object-student/` - Student data models and operations
- `gob-worker-*` - Web workers for data loading and student checking
- `gob-school-st-olaf-college*` - Institution-specific data and logic
- `gob-search-queries/` - Course search functionality
- `gob-lib/` - Shared utilities and helpers

### Key Entry Points

- `modules/gob-web/index.js` - Main web application entry
- `modules/gob-web/webpack.config.js` - Webpack build configuration
- `modules/gob-cli/gob-examine/module.js` - CLI examination tool
- `modules/gob-examine-student/index.js` - Core evaluation logic

### Configuration Files

- `.eslintrc.yml` - ESLint rules (React, Flow, Prettier integration)
- `.flowconfig` - Flow type checker settings
- `.prettierrc.yml` - Code formatting rules
- `babel.config.js` - JavaScript transpilation settings
- `mise.toml` - Task definitions and Node version

### Data Architecture

- Uses IndexedDB for client-side course and area data storage
- Redux for application state management
- Immutable.js for immutable data structures
- Student data encoded/decoded for persistence

### Validation Process

The CI runs comprehensive checks that must all pass:

1. **Flow** - Static type checking with zero errors
2. **ESLint** - Code quality with zero warnings
3. **Jest** - Unit tests with coverage reporting
4. **Prettier** - Code formatting consistency
5. **Webpack** - Production build success

### Trust These Instructions

These instructions are comprehensive and tested. Only perform additional exploration if:

1. Commands fail with errors not documented here
2. New functionality requires understanding modules not covered
3. The instructions appear outdated based on file changes

Always start with `npm ci` and follow the exact command sequences provided.
