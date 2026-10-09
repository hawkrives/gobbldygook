import { computeWhere } from "../compute-chunk.ts"
import type { Course, WhereExpression } from "../types.ts"

describe("computeWhere", () => {
  it('requires "distinct" courses to be different courses', () => {
    const expr: WhereExpression = {
      $type: "where",
      $count: { $operator: "$gte", $num: 2 },
      $where: {
        $type: "qualification",
        $key: "gereqs",
        $operator: "$eq",
        $value: "SPM",
      },
      $distinct: true,
    }

    const courses: Course[] = [
      { department: ["ESTH"], number: 182, year: 2012, gereqs: ["SPM"] },
      { department: ["ESTH"], number: 182, year: 2013, gereqs: ["SPM"] },
    ]

    const expected = {
      computedResult: false,
      matches: [courses[0]],
      counted: 1,
    }

    const actual = computeWhere({ expr, courses })

    expect(actual).toEqual(expected)

    const altCourses: Course[] = [
      { department: ["ESTH"], number: 182, year: 2012, gereqs: ["SPM"] },
      { department: ["ESTH"], number: 187, year: 2013, gereqs: ["SPM"] },
    ]

    let expected2 = {
      computedResult: true,
      matches: altCourses,
      counted: 2,
    }

    let actual2 = computeWhere({ expr, courses: altCourses })

    expect(actual2).toEqual(expected2)
  })
})
