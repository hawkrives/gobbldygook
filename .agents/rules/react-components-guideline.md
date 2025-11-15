# Rule: React Components Guideline

Apply this rule whenever you design, refactor, or review React components so that the output stays consistent and maintainable.

## Component style

1. **Single responsibility**: each component owns one interaction or layout concern; compose smaller primitives instead of building monoliths.
2. **Props typing**: define props with Flow type annotations. Use exact object types (`{| ... |}`)—which is Flow-specific syntax—to prevent unexpected extra props from being passed to components. This catches errors at type-check time rather than runtime. Provide sensible defaults via parameter/destructuring defaults, and avoid `any` or `mixed` unless absolutely necessary.
3. **Events and callbacks**: expose callback props with descriptive names (`onSubmit`, `onClose`) and document when they fire.
4. **Styling**: prefer styled-components (already in use in this project); never leak global styles without justification.
5. **Testability**: push complex logic into hooks or pure utilities so the component render remains predictable and easy to unit test.

## Project-specific conventions

- **Flow type checking**: This project uses Flow 0.82 for static type checking. All component props should be typed with Flow annotations.
- **React version**: React 18.3 is in use. Use modern React patterns (hooks, functional components) where appropriate.
- **State management**: Redux is used for application state. Follow existing patterns for connecting components and dispatching actions.
- **Testing**: Jest with @testing-library/jest-dom is configured. Write tests that exercise component behavior and user interactions.

## File structure suggestion

```text
ComponentName/
├─ index.js (exports the component)
├─ component.js (the actual component implementation)
└─ __tests__/
   └─ component.test.js
```

## Documentation requirements

- Include Flow type annotations for all props and return types.
- Provide JSDoc comments for complex components to explain their purpose and usage.
- Include key interactions plus accessibility considerations in PR descriptions.

## Constraints

- Follow the existing ESLint configuration (`.eslintrc.yml`) which includes React and Flow rules.
- Ensure code passes Flow type checking (`flow check`) before submission.
- Components should work with the project's webpack configuration and babel setup.
