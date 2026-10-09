import { db } from "./db"
import range from "idb-range"
import fromPairs from "lodash/fromPairs"
import getCacheStoreName from "./get-cache-store-name"

export function getPriorCourses(path: string): Promise<Record<string, null>> {
  return db
    .store("courses")
    .index("sourcePath")
    .getAll<{ clbid: string }>(range({ eq: path }))
    .then((oldItems) => fromPairs(oldItems.map((item) => [item.clbid, null])))
}

export function getPriorAreas(path: string): Promise<Record<string, null>> {
  return db
    .store("areas")
    .getAll<{ sourcePath: string }>(range({ eq: path }))
    .then((oldItems) =>
      fromPairs(oldItems.map((item) => [item.sourcePath, null])),
    )
}

export default async function cleanPriorData(
  path: string,
  // `type` comes from the info index file, so it is checked at runtime
  type: string,
): Promise<void> {
  console.log(`cleaning ${path}`)

  let operations
  if (type === "courses") {
    operations = await getPriorCourses(path)
  } else if (type === "areas") {
    operations = await getPriorAreas(path)
  } else {
    console.warn(`"${type}" is not a valid store type`)
    throw new TypeError(`"${type}" is not a valid store type`)
  }

  await db.store(type).batch(operations)
  await db.store(getCacheStoreName(type)).del(path)
}
