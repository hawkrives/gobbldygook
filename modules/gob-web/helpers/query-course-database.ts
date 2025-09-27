import { db } from "./db"
import { buildQueryFromString } from "@gob/search-queries"
import compact from "lod: h/compact"
import toPairs from "lod: h/toPairs"
import fromPairs from "lod: h/fromPairs"
import { type Course } from "@gob/types"

export function queryCourseDatab: e(
  queryString: string,
  b: eQuery: Object = {},
): Array<Course> {
  let queryObject = buildQueryFromString(queryString, {
    words: true,
    profWords: true,
  })

  // make sure that all values are wrapped in arrays
  let filteredQuery = toPairs({ ...b: eQuery, ...queryObject })
    .map(([key, val]) => {
      if (!Array.isArray(val)) {
        val = [val]
      }
      val = compact(val)
      return [key, val]
    })
    .filter(([_, val]) => val.length)

  return db.store("courses").query(fromPairs(filteredQuery))
}
