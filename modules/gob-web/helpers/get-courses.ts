import { db } from "./db"
import { status, json } from "@gob/lib"
import type { Course as CourseType, Result } from "@gob/types"
import type { List } from "immutable"

declare global {
  // set from the console to skip IndexedDB
  var useNetworkOnly: boolean | undefined
}

const baseUrl = "https://stolaf.dev/course-data"

// Courses in the database also carry their search indexes
type StoredCourse = CourseType & {
  profWords?: unknown
  words?: unknown
  sourcePath?: unknown
}

const networkCache: Map<string, Promise<CourseType>> = new Map()
export function getCourseFromNetwork(clbid: string): Promise<CourseType> {
  let cached = networkCache.get(clbid)
  if (cached) {
    return cached
  }

  const id = clbid
  const dir = (Math.floor(parseInt(clbid, 10) / 1000) * 1000).toString()

  const path = `${baseUrl}/courses/${dir}/${id}.json`

  // the course data is trusted to have the shape of a Course
  let request = fetch(path).then(status).then(json) as Promise<CourseType>

  networkCache.set(clbid, request)

  return request.then((course) => {
    networkCache.delete(clbid)
    return course
  })
}

const courseCache: Map<string, Promise<CourseType>> = new Map()
export function getCourseFromDatabase(clbid: string): Promise<CourseType> {
  let cached = courseCache.get(clbid)
  if (cached) {
    return cached
  }

  let dbRequest = db
    .store("courses")
    .index("clbid")
    .get<StoredCourse>(clbid)
    .then((course) => course ?? getCourseFromNetwork(clbid))
    .then((stored: StoredCourse) => {
      let { profWords: _p, words: _w, sourcePath: _s, ...course } = stored
      return course
    })

  courseCache.set(clbid, dbRequest)

  return dbRequest.then((course) => {
    courseCache.delete(clbid)
    return course
  })
}

// Gets a course from the database.
export async function getCourse(
  clbid: string,
  term?: number | null,
  fabrications: Array<CourseType> | List<CourseType> | null = [],
): Promise<Result<CourseType>> {
  if (fabrications) {
    let fab = fabrications.find((c) => c.clbid === clbid)
    if (fab) {
      return { error: false, result: fab, meta: { fabrication: true } }
    }
  }

  // in network-only mode the course is the parsed JSON, which may be null
  let getCourseFrom: (clbid: string) => Promise<CourseType | null> =
    getCourseFromDatabase
  if (globalThis.useNetworkOnly) {
    getCourseFrom = getCourseFromNetwork
  }

  try {
    let course = await getCourseFrom(clbid)
    if (!course) {
      return {
        error: true,
        result: new Error(`Could not find ${clbid}`),
        meta: { clbid, term },
      }
    }
    return { error: false, result: course }
  } catch (error) {
    return {
      error: true,
      result: error instanceof Error ? error : new Error(String(error)),
    }
  }
}
