import { countTerms } from "../count-terms"
import type { Course } from "../types"

describe("countTerms", () => {
  it("counts the number of terms in an array of courses", () => {
    const courses: Course[] = [
      { year: 2010, semester: 1 },
      { year: 2010, semester: 2 },
      { year: 2010, semester: 3 },
    ]
    expect(countTerms(courses)).toBe(3)
  })

  it("skips duplicate terms", () => {
    const courses: Course[] = [
      { year: 2010, semester: 1 },
      { year: 2010, semester: 1 },
      { year: 2010, semester: 3 },
    ]
    expect(countTerms(courses)).toBe(2)
  })
})
