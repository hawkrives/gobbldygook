import stringify from "stabilize"
import type { Student } from "@gob/object-student"

export function getIdCache(): Set<string> {
  // an empty string must also fall back to "[]"
  let storedIds = localStorage.getItem("studentIds")
  let stored: unknown = JSON.parse(
    storedIds != null && storedIds !== "" ? storedIds : "[]",
  )
  return new Set(Array.isArray(stored) ? stored.map(String) : [])
}

export function setIdCache(ids: Set<string>) {
  localStorage.setItem("studentIds", JSON.stringify([...ids]))
}

export function addStudentToCache(studentId: string) {
  let ids = getIdCache()
  ids.add(studentId)
  setIdCache(ids)
}

export function removeStudentFromCache(studentId: string) {
  let ids = getIdCache()
  ids.delete(studentId)
  setIdCache(ids)
}

// oxlint-disable-next-line typescript/require-await -- without async, a throw (e.g. from localStorage) would be synchronous instead of a rejected promise
export async function saveStudent(student: Student): Promise<Student> {
  console.info(`saving ${student.id} (${student.name})`)

  student = student.set("dateLastModified", new Date())
  let str = stringify(student) ?? "null"
  localStorage.setItem(student.id, str)
  addStudentToCache(student.id)

  return student
}
