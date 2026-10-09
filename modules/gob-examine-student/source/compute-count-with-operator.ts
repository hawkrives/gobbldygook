import type { CounterOperatorEnum } from "./types"
export default function computeCountWithOperator({
  comparator,
  has,
  needs,
}: {
  comparator: CounterOperatorEnum
  has: number
  needs: number
}): boolean {
  // compute the result
  switch (comparator) {
    case "$eq":
      return has === needs
    case "$lte":
      return has <= needs
    case "$gte":
      return has >= needs
    default: {
      // unreachable for well-typed input; area files are parsed at runtime
      const unexpected: unknown = comparator
      throw new TypeError(
        `computeModifier(): "${String(unexpected)}" must be one of $eq, $lte, or $gte.`,
      )
    }
  }
}
