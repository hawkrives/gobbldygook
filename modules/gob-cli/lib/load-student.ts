import { Student } from "@gob/object-student"
import type { StudentInput } from "@gob/object-student"
import type {
  Course,
  OverridesObject,
  ParsedHansonFile,
} from "@gob/examine-student"
import { getCourse } from "./get-course.ts"
import loadArea from "./load-area.ts"
import { loadJson } from "./load-json.ts"

export type LoadedStudent = {
  student: Student
  areas: Array<ParsedHansonFile>
  courses: Array<Course>
  overrides: OverridesObject
}

// Loads a student file (or stdin, without a path), plus its areas of study
// and the courses in its active schedules
export async function loadStudent(path?: string): Promise<LoadedStudent> {
  // student files are trusted to have the shape of a saved Student
  let student = new Student((await loadJson(path)) as StudentInput)

  let [areas, courses] = await Promise.all([
    Promise.all(student.studies.map(loadArea)),
    student.activeCourses(getCourse),
  ])

  // the web app only ever stores booleans as overrides
  let overrides = student.overrides.toObject() as OverridesObject

  return { student, areas, courses, overrides }
}
