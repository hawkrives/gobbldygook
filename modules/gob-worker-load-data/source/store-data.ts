import present from "present"
import prepareCourse from "./lib-prepare-course"
import { quotaExceededError } from "./lib-dispatch"
import { db } from "./db"
import type { InfoFileTypeEnum, RawArea, RawCourse } from "./types"
import prettyMs from "pretty-ms"

// The parts of a failed IndexedDB write that onFailure reads
type WriteError = {
  target: { db: { name: string }; error: { name: string } }
}

// istanbul ignore next
const onFailure = (err: WriteError): never => {
  const db = err.target.db.name
  const errorName = err.target.error.name

  // istanbul ignore else
  if (errorName === "QuotaExceededError") {
    quotaExceededError(db)
  }

  throw err
}

export function storeCourses(
  path: string,
  data: Array<RawCourse>,
): Promise<void> {
  console.log(`courses: storing ${path}`)

  let coursesToStore = data.map((course) => ({
    ...course,
    ...prepareCourse(course),
    sourcePath: path,
  }))

  const start = present()

  const onSuccess = () => {
    let time = present() - start
    console.log(`stored ${coursesToStore.length} courses in ${prettyMs(time)}.`)
  }

  return db.store("courses").batch(coursesToStore).then(onSuccess, onFailure)
}

export function storeArea(path: string, data: RawArea): Promise<void> {
  console.log(`areas: storing ${path}`)

  const area = {
    ...data,
    type: data.type.toLowerCase(),
    sourcePath: path,
    dateAdded: new Date(),
  }

  const start = present()

  const onSuccess = () => {
    let time = present() - start
    console.log(`stored area ${path} in ${prettyMs(time)}.`)
  }

  return db.store("areas").put(area).then(onSuccess, onFailure)
}

// `data` is what parseData read from a file of this type.
export default function storeData(
  path: string,
  type: InfoFileTypeEnum,
  data: unknown,
): Promise<void> | undefined {
  // istanbul ignore else
  if (type === "courses") {
    return storeCourses(path, data as Array<RawCourse>)
  } else if (type === "areas") {
    return storeArea(path, data as RawArea)
  }
  return undefined
}
