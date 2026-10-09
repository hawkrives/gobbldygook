import countDepartments from "../count-departments.ts"
import type { Course } from "../types.ts"

describe("countDepartments", () => {
  it("counts the number of distinct departments in an array of courses", () => {
    const courses: Course[] = [
      { department: "ART" },
      { department: "AR/AS" },
      { department: "AR/AS" },
      { department: "CH/BI" },
    ]
    expect(countDepartments(courses)).toBe(3)
  })
})
