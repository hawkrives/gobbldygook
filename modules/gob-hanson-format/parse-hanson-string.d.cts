// Types for parse-hanson-string.cjs, which PEG.js generates from
// parse-hanson-string.pegjs (`npm run build` in this package).
import type { Mapped, ParsedExpression } from "./types.ts"

export type ParseOptions = Readonly<{
  // requirement abbreviations and titles, for reference expressions
  abbreviations?: Mapped<string>
  titles?: Mapped<string>
  // defaults to "Result"
  startRule?: "Result" | "Filter"
}>

export function parse(input: string, options?: ParseOptions): ParsedExpression

// oxlint-disable-next-line no-redeclare -- the generated parser exports its own SyntaxError
export class SyntaxError extends Error {
  expected: unknown
  found: string | null
  location: unknown
}
