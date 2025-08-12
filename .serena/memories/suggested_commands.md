# Development Commands and Tools

## Primary Development Commands (using mise)
- `mise run start` - Start development server (webpack-dev-server on port 3000)
- `mise run build` - Production build
- `mise run build-dev` - Development build with source maps
- `mise run test` - Run Jest tests
- `mise run cover` - Run tests with coverage and open report
- `mise run lint` - Run ESLint with caching
- `mise run flow` - Run Flow type checker
- `mise run pretty` - Format all files with Prettier
- `mise run p` - Quick format changed files with pretty-quick

## Package-specific Commands (in modules/gob-web/)
- `node --run start` - Start webpack dev server
- `node --run build` - Production webpack build
- `node --run build-dev` - Dev webpack build
- `node --run stats` - Generate webpack bundle analyzer stats

## Useful System Commands (macOS)
- `git` - Version control
- `ls`, `cd`, `find`, `grep` - File system navigation
- `fd` - Fast file finder (used in mise tasks)
- `gsort` - GNU sort (used in count task)
- `open` - Open files with default application

## Installation/Setup
1. Clone repo: `git clone https://github.com/hawkrives/gobbldygook.git`
2. Install dependencies: `yarn install`
3. Start development: `mise run start` or `yarn start` (if in gob-web module)

## Package Management
- Use Yarn for dependency management
- Workspaces configured for monorepo structure
- Dependencies managed at both root and module level