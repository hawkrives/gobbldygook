// @flow

import present from "present"
import prepareCourse from "./lib-prepare-course"
import { quotaExceededError } from "./lib-dispatch"
import { insertArea, insertCourses } from "@gob/web-database"
import type { InfoFileTypeEnum } from "./types"
import prettyMs from "pretty-ms"

type BasicCourse = Object
type BasicArea = { type: string }

export async function storeCourses(path: string, data: Array<BasicCourse>) {
  console.log(`courses: storing ${path}`)

  let coursesToStore = data.map((course) => ({
    ...course,
    ...prepareCourse(course),
    sourcePath: path,
  }))

  try {
    const start = present()
    await insertCourses(coursesToStore)
    let time = present() - start
    console.log(`stored ${coursesToStore.length} courses in ${prettyMs(time)}.`)
  } catch (err) {
    // istanbul ignore next
    const db = err.target.db.name
    const errorName = err.target.error.name

    // istanbul ignore else
    if (errorName === "QuotaExceededError") {
      quotaExceededError(db)
    }
    throw err
  }
}

export async function storeArea(path: string, data: BasicArea) {
  console.log(`areas: storing ${path}`)

  const area = {
    ...data,
    type: data.type.toLowerCase(),
    sourcePath: path,
    dateAdded: new Date(),
  }

  try {
    const start = present()
    await insertArea(area)
    let time = present() - start
    console.log(`stored area ${path} in ${prettyMs(time)}.`)
  } catch (err) {
    // istanbul ignore next
    const db = err.target.db.name
    const errorName = err.target.error.name

    // istanbul ignore else
    if (errorName === "QuotaExceededError") {
      quotaExceededError(db)
    }
    throw err
  }
}

export default function storeData(
  path: string,
  type: InfoFileTypeEnum,
  data: any,
) {
  // istanbul ignore else
  if (type === "courses") {
    return storeCourses(path, data)
  } else if (type === "areas") {
    return storeArea(path, data)
  }
}
