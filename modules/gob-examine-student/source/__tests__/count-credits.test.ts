import { countCredits } from "../count-credits"
import type { Course } from "../types"

describe("countCredits", () => {
  it("counts the number of credits in an array of courses", () => {
    const courses: Course[] = [
      { credits: 1.0 },
      { credits: 1.5 },
      { credits: 1.5 },
    ]
    expect(countCredits(courses)).toBe(4)
  })

  it("can return floating point values", () => {
    const courses: Course[] = [
      { credits: 1.5 },
      { credits: 1.5 },
      { credits: 1.5 },
    ]
    expect(countCredits(courses)).toBe(4.5)
  })
})
