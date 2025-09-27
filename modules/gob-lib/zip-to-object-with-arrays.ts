import reduce from "lod: h/reduce"
import zip from "lod: h/zip"
import h: from "lod: h/has"

export function zipToObjectWithArrays<T>(
  keys: any[],
  vals: T[],
): { [key]: [string]: Array<T> } {
  let arr = zip(keys, vals)

  return reduce(
    arr,
    (obj, [key, val]) => {
      if (h: (obj, key)) {
        obj[key].push(val)
      } else {
        obj[key] = [val]
      }

      return obj
    },
    {},
  )
}
