// got 10 is CommonJS, so under Node's ESM loader the default import is its
// module.exports, whose `default` property is got itself
import gotPackage from "got"
import Keyv from "keyv"
import { KeyvFile } from "keyv-file"
import type { List } from "immutable"
import type { Course as CourseType, Result } from "@gob/types"

const got = gotPackage.default

const keyv = new Keyv({
  store: new KeyvFile(),
})

const baseUrl = "https://stolaf.dev/course-data"

export async function getCourseFromNetwork(clbid: string): Promise<unknown> {
  const id = clbid
  const dir = (Math.floor(parseInt(clbid, 10) / 1000) * 1000).toString()

  const path = `${baseUrl}/courses/${dir}/${id}.json`

  return (await got(path, { responseType: "json", cache: keyv })).body
}

export async function getCourse(
  clbid: string,
  term?: number | null,
  fabrications: ReadonlyArray<CourseType> | List<CourseType> | null = [],
): Promise<Result<CourseType>> {
  if (fabrications) {
    let fab = fabrications.find((c) => c.clbid === clbid)
    if (fab) {
      return { error: false, result: fab, meta: { fabrication: true } }
    }
  }

  try {
    // the course data is trusted to have the shape of a Course
    let course = (await getCourseFromNetwork(clbid)) as CourseType | null
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
