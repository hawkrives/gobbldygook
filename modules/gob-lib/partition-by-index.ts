/** Splits an array into its even-indexed and odd-indexed items. */
export function partitionByIndex<T>(arr: ReadonlyArray<T>): [T[], T[]] {
  const evens: T[] = []
  const odds: T[] = []
  arr.forEach((val, idx) => {
    if (idx % 2 === 0) {
      evens.push(val)
    } else {
      odds.push(val)
    }
  })
  return [evens, odds]
}
