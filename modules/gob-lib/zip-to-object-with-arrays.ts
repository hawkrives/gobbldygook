import zip from "lodash/zip.js"

// `keys` and `vals` are optional because search-queries spreads a possibly
// empty `unzip()` result into this function.
export function zipToObjectWithArrays<T>(
  keys: ReadonlyArray<PropertyKey> = [],
  vals: ReadonlyArray<T> = [],
): Record<string, Array<T>> {
  const obj: Record<string, Array<T>> = {}

  for (const [key, val] of zip(keys, vals)) {
    // Past the end of `vals` this is undefined, as it was before typing.
    const value = val as T
    const name = String(key)
    const existing = Object.hasOwn(obj, name) ? obj[name] : undefined
    if (existing) {
      existing.push(value)
    } else {
      obj[name] = [value]
    }
  }

  return obj
}
