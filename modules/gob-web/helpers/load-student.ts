import { Student } from "@gob/object-student"
import type { StudentInput } from "@gob/object-student"

export async function loadStudent(studentId: string): Promise<Student> {
  const rawStudent = localStorage.getItem(studentId)

  if (rawStudent == null || rawStudent === "[object Object]") {
    localStorage.removeItem(studentId)
    return new Student()
  }

  try {
    // saved students are trusted to have the shape of a Student
    let basicStudent = JSON.parse(rawStudent) as StudentInput
    return new Student(basicStudent)
  } catch (e) {
    console.error(e)
    return new Student()
  }
}
