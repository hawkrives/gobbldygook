export function findMissingNumber(arr: ReadonlyArray<number>): number | null {
  const [first] = arr
  if (first === undefined || arr.length === 1) {
    return null
  }

  let last = first
  for (const val of arr) {
    if (val > last + 1) {
      return last + 1
    }
    last = val
  }

  return null
}
