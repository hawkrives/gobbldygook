import { db } from "./db"
import { buildQueryFromString } from "@gob/search-queries"
import type { QueryValue } from "@gob/search-queries"
import compact from "lodash/compact"
import type { Course } from "@gob/types"

export function queryCourseDatabase(
  queryString: string,
  baseQuery: Readonly<
    Record<string, QueryValue | ReadonlyArray<QueryValue>>
  > = {},
): Promise<Array<Course>> {
  let queryObject = buildQueryFromString(queryString, {
    words: true,
    profWords: true,
  })

  // make sure that all values are wrapped in arrays
  let filteredQuery = Object.entries({ ...baseQuery, ...queryObject })
    .map(([key, val]): [string, Array<QueryValue>] => {
      let list: ReadonlyArray<QueryValue> = Array.isArray(val) ? val : [val]
      return [key, compact(list)]
    })
    .filter(([_, val]) => val.length)

  return db.store("courses").query<Course>(Object.fromEntries(filteredQuery))
}
