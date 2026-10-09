import type { CounterOperatorEnum } from "./types.ts"
export default function humanizeOperator(operator: CounterOperatorEnum) {
  switch (operator) {
    case "$gte":
      return ""
    case "$lte":
      return "at most"
    case "$eq":
      return "exactly"
    default: {
      // unreachable for well-typed input; area files are parsed at runtime
      const unexpected: unknown = operator
      throw new TypeError(
        `humanizeOperator does not recognize "${String(unexpected)}" as being an operator.`,
      )
    }
  }
}
