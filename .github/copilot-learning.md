# Gobbldygook Learning Resources

This document provides comprehensive learning resources for developers working on Gobbldygook, particularly useful for AI coding assistants to understand best practices and technologies used in this project.

## Core Technologies Documentation

### React & JavaScript

- **React Official Documentation**: https://react.dev/
  - Focus on: Hooks, Component lifecycle, State management
  - Key patterns: Function components, useEffect, useState, useContext
- **JavaScript ES6+ Features**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
  - Essential: Arrow functions, destructuring, modules, async/await, template literals
- **Flow Type Checker**: https://flow.org/en/docs/
  - Static type checking for JavaScript (legacy, but still used in this project)
  - Type annotations, interfaces, generics

### State Management & Data Flow

- **Redux Toolkit**: https://redux-toolkit.js.org/
  - Modern Redux patterns used in this application
  - Store configuration, slices, async thunks
- **Immutable.js**: https://immutable-js.com/
  - Immutable data structures for predictable state updates
  - Maps, Lists, Records - used extensively for student and course data

### Build Tools & Development

- **Webpack 5**: https://webpack.js.org/
  - Module bundling, code splitting, asset optimization
  - Development server, hot module replacement
- **Babel**: https://babeljs.io/
  - JavaScript transpilation for browser compatibility
  - JSX transformation, ES6+ features
- **npm Workspaces**: https://docs.npmjs.com/cli/v7/using-npm/workspaces
  - Monorepo management for the 22 modules

### Testing & Quality

- **Jest**: https://jestjs.io/
  - Unit testing framework with built-in assertion library
  - Mocking, coverage reporting, snapshot testing
- **ESLint**: https://eslint.org/
  - Code quality and consistency enforcement
  - React-specific rules, Flow integration
- **Prettier**: https://prettier.io/
  - Automated code formatting for consistency

### Browser APIs & Storage

- **IndexedDB**: <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>
  - Client-side database for course and area data storage
  - Asynchronous, transactional database operations
- **Web Workers**: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API>
  - Background processing for student evaluation and data loading
  - Used in `gob-worker-*` modules

## Project-Specific Learning

### Domain Knowledge

- **Academic Requirements**: Understanding of college degree requirements
  - Majors, concentrations, degrees, prerequisites
  - Credit counting, GPA calculations, graduation requirements
- **Course Scheduling**: Academic calendar concepts
  - Semesters, terms, course offerings, scheduling conflicts

### Architecture Patterns

- **Monorepo Structure**: Managing multiple related packages
  - Shared dependencies, cross-module imports
  - Independent module testing and building
- **Single Page Application (SPA)**: Client-side routing and state management
  - React Router for navigation
  - Progressive enhancement for accessibility

### Data Structures

- **Student Data Model**: Complex nested objects representing academic progress
  - Schedules, courses, areas of study, overrides
  - Serialization/deserialization for persistence
- **Course Requirements**: Declarative language for academic requirements
  - Boolean logic, conditional requirements, credit calculations
  - Hanson format parsing (domain-specific language)

## Best Practices Resources

### React Development

- **React Patterns**: https://reactpatterns.com/
- **React Best Practices**: https://github.com/alan2207/bulletproof-react
- **Component Design**: Atomic design principles, reusable components

### JavaScript & Flow

- **Flow Best Practices**: https://flow.org/en/docs/style-guide/
- **JavaScript Style Guide**: Airbnb style guide (referenced in ESLint config)
- **Functional Programming**: Immutable data, pure functions, composition

### Testing Strategies

- **Testing Library**: https://testing-library.com/
- **Unit Testing**: Component testing, utility function testing
- **Integration Testing**: Cross-module functionality testing

### Performance & Accessibility

- **Web Performance**: Bundle size optimization, code splitting
- **Accessibility**: WCAG guidelines, semantic HTML, keyboard navigation
- **Progressive Enhancement**: Core functionality without JavaScript

## Development Workflow

### Git & Version Control

- **Conventional Commits**: https://www.conventionalcommits.org/
  - Structured commit messages for automated changelog generation
  - Types: feat, fix, docs, style, refactor, test, chore
- **Pull Request Process**: Code review, testing, continuous integration

### Continuous Integration

- **GitHub Actions**: Automated testing, linting, building
- **Quality Gates**: All checks must pass before merge
  - Flow type checking (zero errors)
  - ESLint (zero warnings) 
  - Jest tests (full coverage)
  - Prettier formatting
  - Webpack production build

### Deployment

- **Netlify**: Static site hosting with automatic deployments
- **Build Optimization**: Asset minification, caching strategies
- **Environment Configuration**: Production vs development settings

## Common Challenges & Solutions

### Flow Type System

- **Legacy Type System**: Flow is being maintained but not actively developed
- **Type Definitions**: Custom types in `flow-typed/` directory
- **Migration Considerations**: Potential future migration to TypeScript

### Build Performance

- **Large Bundle Size**: Known issue with webpack configuration
- **Duplicate Dependencies**: Multiple versions of packages (documented warnings)
- **Build Time**: ~20-25 seconds for production builds

### Browser Compatibility

- **Modern Features**: ES6+, IndexedDB, Web Workers required
- **Legacy Support**: No Internet Explorer support
- **Progressive Enhancement**: Core functionality accessibility

## Getting Help

### Documentation

- **README.md**: Project overview and setup instructions
- **CONTRIBUTING.md**: Development guidelines and commit conventions
- **Individual Module READMEs**: Specific module documentation

### Community Resources

- **Stack Overflow**: JavaScript, React, Webpack, Flow questions
- **GitHub Issues**: Project-specific problems and feature requests
- **MDN Web Docs**: Browser API references and web standards

### Internal Resources

- **Code Comments**: Inline documentation for complex logic
- **Type Definitions**: Flow types document data structures and interfaces
- **Test Files**: Examples of expected behavior and usage patterns