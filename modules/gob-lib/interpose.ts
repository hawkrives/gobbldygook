export function interpose<T, U>(
  data: ReadonlyArray<T>,
  value: U,
): Array<T | U> {
  const result: Array<T | U> = []
  data.forEach((item, index) => {
    result.push(item)
    if (index < data.length - 1) {
      result.push(value)
    }
  })
  return result
}
