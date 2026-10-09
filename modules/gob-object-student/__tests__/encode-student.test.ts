import stringify from "stabilize"
import { encodeStudent } from "../encode-student.ts"
import { Student } from "../student.ts"

describe("encodeStudent", () => {
  it("URI-encodes the student's JSON", () => {
    const encode = vi
      .spyOn(globalThis, "encodeURIComponent")
      .mockImplementation(() => "")
    const student = new Student({ name: "s" })

    try {
      expect(encodeStudent(student)).toBe("")
      expect(encode).toHaveBeenCalledWith(stringify(student))
    } finally {
      encode.mockRestore()
    }
  })
})
