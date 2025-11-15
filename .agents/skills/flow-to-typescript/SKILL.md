# Skill: Flow to TypeScript Conversion

## Purpose
Guide agents through converting JavaScript files with Flow type annotations to TypeScript using the `flow-to-ts` tool, ensuring strict type safety and compliance with TypeScript's recommended linting rules.

## Trigger conditions
- User requests conversion from Flow to TypeScript
- Task involves migrating Flow-typed JavaScript code to TypeScript
- Need to convert `.js` or `.jsx` files with Flow annotations to `.ts` or `.tsx`

## Capability boundaries
- Can guide the conversion process using flow-to-ts
- Can provide post-conversion cleanup and validation steps
- Cannot handle all edge cases automatically (some manual fixes will be required)
- Requires the flow-to-ts tool to be installed

## Execution steps

1. **Verify prerequisites**
   - Confirm `flow-to-ts` is installed: `yarn global add @khanacademy/flow-to-ts` or `npm install -g @khanacademy/flow-to-ts`
   - Verify source files contain Flow annotations (e.g., `// @flow` comment)
   - Check TypeScript compiler is available in the project

2. **Prepare for conversion**
   - Create a backup of files to be converted
   - Review the file(s) for complex Flow types that may need manual attention:
     - Utility types like `$Keys`, `$Values`, `$ReadOnly`
     - Exact object types (`{| ... |}`)
     - Flow-specific features like `%checks`
   - Note any custom type definitions or declarations

3. **Run flow-to-ts conversion**
   
   Basic usage:
   ```bash
   flow-to-ts --write --prettier [file-patterns]
   ```
   
   Recommended options:
   ```bash
   flow-to-ts \
     --write \
     --prettier \
     --single-quote \
     --trailing-comma all \
     --inline-utility-types \
     [file-patterns]
   ```
   
   - `--write`: Write output to disk (creates `.ts`/`.tsx` files)
   - `--prettier`: Format output with prettier
   - `--single-quote`: Use single quotes (matches most JS conventions)
   - `--trailing-comma all`: Add trailing commas
   - `--inline-utility-types`: Inline utility types when possible
   - `--delete-source`: (Optional) Remove original `.js` files after conversion

4. **Replace `any` with `unknown`**
   
   The flow-to-ts tool downgrades to `any` when exact translation isn't possible. For strict type safety, replace these with `unknown`:
   
   ```bash
   # Search for any usages
   grep -r ": any" --include="*.ts" --include="*.tsx"
   
   # Manual review required - determine if:
   # - Can be a specific type
   # - Should be `unknown` (requires type guards)
   # - Should be a generic type parameter
   ```
   
   **Important**: Do NOT blindly replace all `any` with `unknown`. Review each case:
   - Function parameters that accept anything → `unknown`
   - Return types that could be anything → `unknown`
   - Cases where the actual type is known → use the specific type
   - Generic contexts → consider type parameters

5. **Enable TypeScript strict mode**
   
   Update or create `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true
     }
   }
   ```

6. **Configure TypeScript ESLint with recommended-type-checked**
   
   Install dependencies:
   ```bash
   npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```
   
   Update `.eslintrc` (or equivalent):
   ```json
   {
     "parser": "@typescript-eslint/parser",
     "parserOptions": {
       "project": true,
       "tsconfigRootDir": "."
     },
     "plugins": ["@typescript-eslint"],
     "extends": [
       "eslint:recommended",
       "plugin:@typescript-eslint/recommended-type-checked"
     ]
   }
   ```
   
   Key rules from recommended-type-checked:
   - `@typescript-eslint/no-explicit-any`: error (enforces no `any`)
   - `@typescript-eslint/no-unsafe-assignment`: error
   - `@typescript-eslint/no-unsafe-call`: error
   - `@typescript-eslint/no-unsafe-member-access`: error
   - `@typescript-eslint/no-unsafe-return`: error
   - `@typescript-eslint/await-thenable`: error
   - `@typescript-eslint/no-floating-promises`: error
   - `@typescript-eslint/require-await`: error

7. **Fix common conversion issues**
   
   **Flow exact objects → TypeScript:**
   ```typescript
   // Flow: {| name: string, age: number |}
   // TypeScript: { name: string; age: number }
   // Note: TypeScript has no exact equivalent, consider using:
   type Person = { name: string; age: number };
   ```
   
   **Flow utility types → TypeScript:**
   ```typescript
   // Flow: $Keys<T> → TypeScript: keyof T
   // Flow: $Values<T> → TypeScript: T[keyof T]
   // Flow: $ReadOnly<T> → TypeScript: Readonly<T>
   // Flow: $Shape<T> → TypeScript: Partial<T>
   // Flow: $Diff<T, U> → TypeScript: Omit<T, keyof U>
   ```
   
   **React synthetic events:**
   ```typescript
   // Flow: SyntheticEvent → TypeScript: React.SyntheticEvent
   // Flow: SyntheticMouseEvent → TypeScript: React.MouseEvent
   // Flow: SyntheticKeyboardEvent → TypeScript: React.KeyboardEvent
   ```
   
   **Null/undefined handling:**
   ```typescript
   // With strictNullChecks enabled, be explicit:
   function getValue(): string | null { }
   function getName(): string | undefined { }
   ```

8. **Validate the conversion**
   
   Run TypeScript compiler:
   ```bash
   tsc --noEmit
   ```
   
   Run ESLint with type checking:
   ```bash
   eslint . --ext .ts,.tsx
   ```
   
   Address errors in order of priority:
   1. Type errors (tsc)
   2. Unsafe type operations (eslint)
   3. Style issues (eslint)

9. **Manual review checklist**
   
   After automated conversion, manually review:
   - [ ] All `any` types replaced with `unknown` or specific types
   - [ ] React component props properly typed
   - [ ] Event handlers have correct types
   - [ ] Async functions return `Promise<T>`
   - [ ] No unsafe type assertions (`as any`)
   - [ ] Generic types properly constrained
   - [ ] Union types use discriminated unions where appropriate
   - [ ] Optional chaining (`?.`) used instead of null checks where appropriate
   - [ ] Nullish coalescing (`??`) used appropriately

## Output format

When performing a Flow to TypeScript conversion, deliver:

- **Conversion summary**: Number of files converted, any warnings from flow-to-ts
- **Type replacement report**: List of `any` types replaced with `unknown` or specific types
- **Validation results**: 
  - TypeScript compilation status
  - ESLint errors/warnings count
  - Any remaining manual fixes needed
- **Updated configuration files**: `tsconfig.json`, `.eslintrc` changes
- **Migration notes**: Document any breaking changes or behavioral differences

## Best practices

- **Incremental conversion**: Convert files in logical groups (by feature or module)
- **Test coverage**: Run tests after each conversion batch
- **Type narrowing**: Use type guards instead of type assertions where possible
- **Avoid type assertions**: Prefer proper typing over `as` casts
- **Document unknowns**: Add comments explaining why `unknown` is used in specific cases
- **Preserve semantics**: Ensure TypeScript version behaves identically to Flow version

## Anti-patterns to avoid

- Blindly converting all `any` to `unknown` without analysis
- Using `@ts-ignore` or `@ts-expect-error` to bypass type errors
- Overly broad types (e.g., `object`, `Function`) when specific types are available
- Type assertions without runtime validation (`value as Type`)
- Disabling strict mode or recommended-type-checked rules
- Converting the entire codebase at once without incremental validation

## Common pitfalls

1. **Flow's `mixed` vs TypeScript's `unknown`**: Both represent "any type" but TypeScript's `unknown` is safer and requires type checking before use.

2. **Variance annotations**: Flow's variance annotations (`+property`, `-property`) don't have direct TypeScript equivalents. Document these cases.

3. **Nominal typing**: Flow supports nominal typing with opaque types. TypeScript uses structural typing. Consider using brands or unique symbols for nominal-like behavior.

4. **Refinement handling**: Flow's refinement may be more sophisticated. Add explicit type guards in TypeScript where needed.

## Troubleshooting

**Problem**: flow-to-ts produces errors during conversion
- **Solution**: Check that source files have valid Flow syntax. Fix Flow errors before converting.

**Problem**: TypeScript compiler reports type errors after conversion
- **Solution**: Expected for complex types. Review each error and apply proper TypeScript types.

**Problem**: Too many `any` types in converted code
- **Solution**: Use `--inline-utility-types` option. Manually type complex cases.

**Problem**: ESLint reports unsafe type operations
- **Solution**: Add proper type guards, narrow types before use, replace `any` with `unknown`.

**Problem**: Tests fail after conversion
- **Solution**: Check for behavioral differences in type coercion, null handling, and type assertions.
