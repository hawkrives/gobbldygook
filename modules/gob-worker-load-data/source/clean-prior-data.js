// @flow

import {
  cleanPriorCourses,
  cleanPriorAreas,
  cleanCourseCache,
  cleanAreaCache,
} from "@gob/web-database"
import type { InfoFileTypeEnum } from "./types"

export default async function cleanPriorData(
  path: string,
  type: InfoFileTypeEnum,
) {
  console.log(`cleaning ${path}`)

  if (type === "courses") {
    await cleanPriorCourses(path)
    await cleanCourseCache(path)
  } else if (type === "areas") {
    await cleanPriorAreas(path)
    await cleanAreaCache(path)
  } else {
    console.warn(`"${type}" is not a valid store type`)
    throw new TypeError(`"${type}" is not a valid store type`)
  }
}
