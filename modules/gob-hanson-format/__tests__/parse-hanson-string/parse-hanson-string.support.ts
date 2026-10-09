import peg from "pegjs"
import type { ParserBuildOptions, ParserOptions } from "pegjs"
import fs from "fs"
import path from "path"

const grammar = fs.readFileSync(
  path.join(__dirname, "../../parse-hanson-string.pegjs"),
  "utf-8",
)

// Every rule in the grammar returns an object, like {$type: "course", ...}
// or {$operator: "$gte", $num: 2} for a counter.
type ParsedRule = Readonly<Record<string, unknown>>

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- pegjs's ParserBuildOptions (allowedStartRules: string[]) is a library type, and peg.generate takes it mutable
export const customParser = (buildOptions?: ParserBuildOptions) => {
  const parser = peg.generate(grammar, buildOptions)
  return (input: string, options?: Readonly<ParserOptions>): ParsedRule =>
    parser.parse(input, options) as ParsedRule
}
