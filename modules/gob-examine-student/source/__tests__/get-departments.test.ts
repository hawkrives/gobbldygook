import getDepartments from "../get-departments"
import type { Course } from "../types"

describe("getDepartments", () => {
  it("returns the distinct departments from an array of courses", () => {
    const courses: Course[] = [
      { department: "ART" },
      { department: "AR/AS" },
      { department: "CH/BI" },
      { department: "CH/BI" },
    ]

    expect(getDepartments(courses)).toEqual(["ART", "AR/AS", "CH/BI"])
  })
})
