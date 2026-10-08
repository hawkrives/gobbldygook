import stringify from "stabilize"
import { encodeStudent } from "../encode-student"
import { Student } from "../student"

describe("encodeStudent", () => {
  it("URI-encodes the student's JSON", () => {
    const encode = jest
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
