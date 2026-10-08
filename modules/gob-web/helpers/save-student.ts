import stringify from "stabilize"
import type { Student } from "@gob/object-student"

export function getIdCache(): Set<string> {
  let stored: unknown = JSON.parse(localStorage.getItem("studentIds") || "[]")
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

export async function saveStudent(student: Student): Promise<Student> {
  console.info(`saving ${student.id} (${student.name})`)

  student = student.set("dateLastModified", new Date())
  let str = stringify(student) ?? "null"
  localStorage.setItem(student.id, str)
  addStudentToCache(student.id)

  return student
}
