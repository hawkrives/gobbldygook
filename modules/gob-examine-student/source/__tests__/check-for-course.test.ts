import checkForCourse from "../check-for-course.ts"
import type { Course } from "../types.ts"

describe("checkForCourse", () => {
  it("returns true if the course is found", () => {
    const query: Course = { department: ["ASIAN"], number: 100 }
    const courses: Course[] = [
      query,
      { department: ["CSCI"], number: 121 },
      { department: ["CHEM", "BIO"], number: 111 },
      { department: ["CHEM", "BIO"], number: 112 },
      { department: ["ART", "ASIAN"], number: 121 },
    ]

    expect(checkForCourse(query, courses)).toBe(true)
  })

  it("returns false if the course is not found", () => {
    const courses: Course[] = [
      { department: ["ASIAN"], number: 100 },
      { department: ["CSCI"], number: 121 },
      { department: ["CHEM", "BIO"], number: 111 },
      { department: ["CHEM", "BIO"], number: 112 },
      { department: ["ART", "ASIAN"], number: 121 },
    ]

    const query = { department: ["MUSIC"], number: 101 }

    expect(checkForCourse(query, courses)).toBe(false)
  })
})

// checks for a course in an array of courses
