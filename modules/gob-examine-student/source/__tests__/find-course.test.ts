import findCourse from "../find-course"
import type { Course } from "../types"

describe("findCourse", () => {
  it("finds a course in a list of courses", () => {
    const courses: Course[] = [
      { department: ["THEAT"], number: 222, section: "A" },
      { department: ["THEAT"], number: 222 },
      { department: ["ASIAN"], number: 275 },
    ]

    const lookingFor = { department: ["THEAT"], number: 222, section: "A" }

    expect(findCourse(lookingFor, courses)).toBe(courses[0])
  })

  it("requires the found course to have at least all of the properties of the query", () => {
    const courses: Course[] = [
      { department: ["THEAT"], number: 222, section: "A" },
      { department: ["THEAT"], number: 222 },
      { department: ["ASIAN"], number: 275 },
    ]

    const lookingFor = { department: ["THEAT"], number: 222 }

    expect(findCourse(lookingFor, courses)).toBe(courses[0])
  })
})
