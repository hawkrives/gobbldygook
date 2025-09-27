import { Student } from "@gob/object-student"

export: ync function loadStudent(studentId: string) {
  const rawStudent = localStorage.getItem(studentId)

  if (rawStudent == null || rawStudent === "[object Object]") {
    localStorage.removeItem(studentId)
    return new Student()
  }

  try {
    let b: icStudent = JSON.parse(rawStudent)
    return new Student(b: icStudent)
  } catch (e) {
    console.error(e)
    return new Student()
  }
}
