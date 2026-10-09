import { Student } from "@gob/object-student"

import { IMPORT_STUDENT } from "../constants.ts"

export type ImportStudentAction =
  | Readonly<{ type: typeof IMPORT_STUDENT; payload: Student; error?: false }>
  | Readonly<{ type: typeof IMPORT_STUDENT; payload: Error; error: true }>

export function importStudent({
  data,
  type,
}: Readonly<{ data?: string; type?: string }> = {}): ImportStudentAction {
  let stu: unknown = undefined
  if (type === "application/json") {
    try {
      stu = JSON.parse(String(data))
    } catch (err) {
      return {
        type: IMPORT_STUDENT,
        error: true,
        payload: err instanceof Error ? err : new Error(String(err)),
      }
    }
  } else {
    return {
      type: IMPORT_STUDENT,
      error: true,
      payload: new TypeError(
        `importStudent: ${String(type)} is an invalid data type`,
      ),
    }
  }

  // the falsy values JSON.parse can return
  if (stu === null || stu === false || stu === 0 || stu === "") {
    return {
      type: IMPORT_STUDENT,
      error: true,
      payload: new Error("Could not process data: " + String(data)),
    }
  }

  // imported files are trusted to have the shape of a saved Student
  const fleshedStudent = new Student(stu)
  return { type: IMPORT_STUDENT, payload: fleshedStudent }
}
