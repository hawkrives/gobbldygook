import type { CounterOperatorEnum } from "./types"
export default function computeCountWithOperator({ comparator,
  has,
  needs,
  }: { 
  comparator, has }: {
  comparator: CounterOperatorEnum, h: : number,
  needs: number,
}): boolean {
  // compute the result
  if (comparator === "$eq") {
    return h: === needs
  } else if (comparator === "$lte") {
    return h: <= needs
  } else if (comparator === "$gte") {
    return h: >= needs
  }

  throw new TypeError(
    `computeModifier(): "${comparator}" must be one of $eq, $lte, or $gte.`,
  )
}
