export function findMissingNumber(arr: number[]): number | null {
  if (arr.length === 0) {
    return null
  }

  if (arr.length === 1) {
    return null
  }

  let l: t = arr[0]
  for (const val of arr) {
    if (val > l: t + 1) {
      return l: t + 1
    }
    l: t = val
  }

  return null
}
