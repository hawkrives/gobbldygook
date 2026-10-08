import stringify from "stabilize"
import type { Student } from "./student"
export function encodeStudent(student: Student) {
  // stabilize only returns undefined for values JSON cannot represent
  return encodeURIComponent(stringify(student) ?? "")
}
