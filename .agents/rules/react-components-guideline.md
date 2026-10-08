# Rule: React Components Guideline

Apply this rule whenever you design, refactor, or review React components so that the output stays consistent and maintainable.

## Component style

1. **Single responsibility**: each component owns one interaction or layout concern; compose smaller primitives instead of building monoliths.
2. **Props typing**: new and converted components are `.tsx` with a `Props` type, usually `Readonly<{ ... }>`. TypeScript's excess-property check on JSX does the job Flow's exact object types (`{| ... |}`) did. Components that are still Flow keep their exact object types until they are converted. Provide sensible defaults via parameter/destructuring defaults, and avoid `any` (TypeScript) or `mixed` (Flow) unless absolutely necessary; prefer `unknown` plus narrowing.
3. **Events and callbacks**: expose callback props with descriptive names (`onSubmit`, `onClose`) and document when they fire.
4. **Styling**: prefer styled-components (already in use in this project); never leak global styles without justification.
5. **Testability**: push complex logic into hooks or pure utilities so the component render remains predictable and easy to unit test.

## Project-specific conventions

- **Type checking**: the codebase is moving from Flow 0.82 to strict TypeScript 7, package by package (see the flow-to-typescript skill). Converted files are checked by `mise run typecheck`; the rest by `mise run flow`. Don't write new Flow code.
- **React version**: React 18.3 is in use. Use modern React patterns (hooks, functional components) where appropriate.
- **State management**: Redux is used for application state. Follow existing patterns for connecting components and dispatching actions.
- **Testing**: Jest with @testing-library/jest-dom is configured. Write tests that exercise component behavior and user interactions.

## File structure suggestion

```text
ComponentName/
├─ index.ts (exports the component)
├─ component.tsx (the actual component implementation)
└─ __tests__/
   └─ component.test.tsx
```

## Documentation requirements

- Type all props. Annotate return types on exported functions.
- Provide JSDoc comments for complex components to explain their purpose and usage.
- Include key interactions plus accessibility considerations in PR descriptions.

## Constraints

- Follow the existing lint configuration (`.oxlintrc.json`).
- Ensure code passes `mise run typecheck` and `mise run flow` before submission.
- Components should work with the project's webpack configuration and babel setup.
