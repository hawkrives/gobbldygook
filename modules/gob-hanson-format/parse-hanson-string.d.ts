// Types for parse-hanson-string.js, which PEG.js generates from
// parse-hanson-string.pegjs (`npm run build` in this package).
import type { Mapped, ParsedExpression } from "./types"

export type ParseOptions = {
  // requirement abbreviations and titles, for reference expressions
  abbreviations?: Mapped<string>
  titles?: Mapped<string>
  // defaults to "Result"
  startRule?: "Result" | "Filter"
}

export function parse(input: string, options?: ParseOptions): ParsedExpression

export class SyntaxError extends Error {
  expected: unknown
  found: string | null
  location: unknown
}
