import { loadStudent } from "../load-student.ts"
const demoStudent =
  require("@gob/object-student/demo-student.json") as StudentInput

import { Student } from "@gob/object-student"
import type { StudentInput } from "@gob/object-student"
vi.spyOn(global.console, "log").mockImplementation(() => vi.fn())
vi.spyOn(global.console, "error").mockImplementation(() => vi.fn())
vi.spyOn(global.console, "warn").mockImplementation(() => vi.fn())

describe("loadStudent", () => {
  let student: Student
  beforeEach(() => {
    student = new Student(demoStudent)
    localStorage.clear()
    localStorage.setItem(student.id, JSON.stringify(student))
  })

  it("loads a student", async () => {
    const actual = await loadStudent(student.id)
    expect(actual).toBeTruthy()
    expect(actual).toHaveProperty("id")
  })

  it("returns a fresh student if it is null", async () => {
    localStorage.removeItem(student.id)
    const actual = await loadStudent(student.id)
    expect(actual).toBeInstanceOf(Student)
  })

  it("returns a fresh student if it is the string [Object object]", async () => {
    localStorage.setItem(student.id, "[object Object]")
    const actual = await loadStudent(student.id)
    expect(actual).toBeInstanceOf(Student)
  })

  it("returns a fresh student if JSON errors are encountered", async () => {
    localStorage.setItem(student.id, "hello!")
    const actual = await loadStudent(student.id)
    expect(actual).toHaveProperty("id")
  })
})
