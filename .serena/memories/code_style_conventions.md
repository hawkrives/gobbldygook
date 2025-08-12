# Code Style and Conventions

## Language and Type System
- **Language**: JavaScript (ES6+) with Flow annotations
- **File Extension**: `.js` (not `.ts` - this is a Flow project, not TypeScript)
- **Type Annotations**: Flow syntax (`// @flow` comment at top of files)

## Code Style
- **Formatter**: Prettier with specific configuration
- **Linter**: ESLint with Flow plugin
- **Naming**: 
  - camelCase for variables and functions
  - PascalCase for React components
  - kebab-case for file names and directories

## React Conventions
- Functional components with hooks preferred
- Styled-components for styling
- PropTypes for runtime type checking (in addition to Flow)
- React 18 patterns (render from react-dom)

## Import/Export Style
- ES6 modules (`import`/`export`)
- Relative imports for local modules
- Absolute imports for node_modules

## File Organization
- Components in appropriate module directories
- Styles co-located with components or in shared styles directory
- Workers in separate files with `.worker.js` suffix
- Tests in `__tests__` directories

## Comments and Documentation
- Flow type annotations serve as primary documentation
- JSDoc comments for complex functions
- Inline comments for non-obvious business logic

## CSS/Styling
- SCSS preprocessing
- CSS custom properties (variables)
- Styled-components for component-specific styles
- Normalize.css for cross-browser consistency