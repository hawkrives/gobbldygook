# Skill: Flow to TypeScript Conversion

## Purpose
Convert one workspace package (or one gob-web chunk) from Flow to strict TypeScript 7, in the order listed under "Conversion order" below, while the rest of the repo stays Flow.

## Trigger conditions
- User requests conversion from Flow to TypeScript
- Task involves migrating Flow-typed JavaScript code to TypeScript
- Need to convert `.js` files with `// @flow` to `.ts` or `.tsx`

## How the mixed Flow/TypeScript setup works
- **Babel** (`babel.config.js`) compiles `.js` with `@babel/preset-flow` and `.ts`/`.tsx` with `@babel/preset-typescript` through `overrides`. Webpack, Jest and the CLIs (`modules/gob-cli/lib/init.js`, which uses `@babel/register`) all go through it.
- **TypeScript** (`tsconfig.json`) only typechecks (`noEmit`). It includes every `.ts`/`.tsx` file under `modules/` plus `config/types/*.d.ts`. Run it with `mise run typecheck`. Strict mode is on, plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax` and `erasableSyntaxOnly`. Never loosen these to get a file through.
- **Flow** can't read `.ts`. Still-Flow code reaches converted code through stubs:
  - For a converted package imported by name: keep the old Flow source as `index.js.flow` (and its other files as `*.js.flow`), and add a `module.name_mapper` line in `.flowconfig` pointing the package name at that stub, like the existing `@gob/types` entry. If the Flow types are not worth keeping, map it to `config/flow/any` instead.
  - For a converted file imported by relative path: leave a sibling `foo.js.flow` next to `foo.ts`, either with the old Flow signatures or with `declare module.exports: any`.
  - Delete stubs once nothing Flow imports them anymore.

## Execution steps

1. **Check the order.** Convert a package only after everything it imports is TypeScript. The plan lists the waves (see "References").
2. **Run flow-to-ts** on the package's `@flow` files:
   ```bash
   npx @khanacademy/flow-to-ts --write --delete-source --inline-utility-types <files>
   ```
   It crashes on Flow's `this` type, silently drops exactness (`{| |}`) and variance (`+prop`), and turns `Object`, `Function` and `*` into `any`. Convert those files by hand.
3. **Convert the package's non-Flow `.js` files and tests** too (rename them and add types).
4. **Point `main` in the package's `package.json` at `index.ts`.** Webpack reads `main` literally.
5. **Add Flow stubs** for whatever still-Flow code imports (see above), then run `mise run flow`.
6. **Fix every strict error properly**:
   - Replace each `any` with a real type, a type parameter, or `unknown` plus narrowing. No `as any`, `@ts-ignore` or `@ts-expect-error` without a one-line reason.
   - Read-only exact objects (`{| +a: T |}`) become `Readonly<{ a: T }>` or `readonly` fields.
   - `mixed` becomes `unknown`; `$Keys<T>` becomes `keyof T`; `$ReadOnlyArray<T>` becomes `ReadonlyArray<T>`; `$Shape<T>` becomes `Partial<T>`.
   - Type-only exports and imports use `export type` / `import type` (`verbatimModuleSyntax` requires it).
   - No enums, namespaces or constructor parameter properties (`erasableSyntaxOnly`); the code will later run under Node's type stripping.
   - Class components need `override` on lifecycle methods. Use `declare` for fields Babel shouldn't initialize.
   - React events: `SyntheticEvent` becomes `React.SyntheticEvent`, `SyntheticMouseEvent` becomes `React.MouseEvent`, and so on.
   - Untyped third-party modules get a small declaration in `config/types/` or an `@types/*` dev dependency that matches the installed major version.
7. **Delete `flow-typed/npm` stubs** that nothing else uses anymore.
8. **Validate:** `mise run typecheck`, `mise run flow`, `mise run test`, `mise run lint`, `mise run format`, `mise run build`, plus `mise run e2e` if gob-web loads the package. Files were unlinted and unformatted while they were Flow, so expect oxlint and oxfmt fixes on the first pass.

## Output format
- Files converted, and any flow-to-ts failures that were converted by hand
- Every remaining `any` or suppression, with its reason
- Results of the validation commands
- Flow stubs added or removed

## Anti-patterns to avoid
- Turning off a strict flag, or excluding files from `tsconfig.json`, to get green
- Converting a package before the packages it imports
- Blindly replacing `any` with `unknown`, or adding assertions (`as T`) without a runtime check
- Leaving a converted file without a Flow stub while Flow code still imports it

## Conversion order
Leaves first; each line can only start once the lines above it are done.
1. `gob-types` (done), `gob-colors`, `gob-lib`, `gob-school-st-olaf-college`
2. `gob-schedule-conflicts`, `gob-search-queries`
3. Break the `gob-hanson-format` and `gob-examine-student` import cycle (`enhance-hanson.js` imports `is-requirement-name` from examine-student), then `gob-hanson-format` (keep the generated `parse-hanson-string.js` as JavaScript with a `.d.ts`), `gob-examine-student`, `gob-courses`
4. `gob-object-student` (upgrade immutable to 4.3 here), `gob-schedule-builder`, `gob-worker-check-student`
5. `gob-school-st-olaf-college-sis-import`, `gob-treo-plugin-*`, `gob-web-database`, `gob-worker-load-data`
6. The CLIs: `gob-cli`, `gob-hanson-format-cli`, `gob-search-queries-cli`
7. `gob-web`, bottom-up: types, helpers and redux; `components/`; feature modules; screens, app and workers
8. Cleanup: delete `.flowconfig`, `flow-typed/`, `config/decls`, `config/flow`, every `.js.flow` stub and `scripts/flow-files.sh`, and remove `flow-bin` and `@babel/preset-flow`

`gob-webpack-plugin-html` stays JavaScript until the Vite move removes it.
