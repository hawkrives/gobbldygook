import applyFilter from "../apply-filter.ts"
import type { Course, FilterExpression } from "../types.ts"

describe("applyFilter", () => {
  it("filters a list of courses", () => {
    const query: FilterExpression = {
      $type: "filter",
      $distinct: false,
      $filterType: "where",
      $where: {
        $type: "qualification",
        $key: "number",
        $value: 121,
        $operator: "$eq",
      },
    }

    const courses: Course[] = [
      { department: ["ASIAN"], number: 100 },
      { department: ["CSCI"], number: 121 },
      { department: ["CHEM", "BIO"], number: 111 },
      { department: ["CHEM", "BIO"], number: 112 },
      { department: ["ART", "ASIAN"], number: 121 },
    ]

    expect(applyFilter(query, courses)).toMatchSnapshot()
  })

  it("filters by where-style queries", () => {
    const query: FilterExpression = {
      $type: "filter",
      $distinct: false,
      $filterType: "where",
      $where: {
        $type: "qualification",
        $key: "number",
        $value: 121,
        $operator: "$eq",
      },
    }

    const courses: Course[] = [
      { department: ["ASIAN"], number: 100 },
      { department: ["CSCI"], number: 121 },
      { department: ["CHEM", "BIO"], number: 111 },
      { department: ["CHEM", "BIO"], number: 112 },
      { department: ["ART", "ASIAN"], number: 121 },
    ]

    expect(applyFilter(query, courses)).toMatchSnapshot()
  })

  it("filters by list-of-valid-courses queries", () => {
    const query: FilterExpression = {
      $type: "filter",
      $distinct: false,
      $filterType: "of",
      $of: [
        { $type: "course", $course: { department: ["CSCI"], number: 121 } },
        { $type: "course", $course: { department: ["CSCI"], number: 125 } },
      ],
    }

    const courses: Course[] = [
      { department: ["ASIAN"], number: 100 },
      { department: ["CSCI"], number: 121 },
      { department: ["CHEM", "BIO"], number: 111 },
      { department: ["CHEM", "BIO"], number: 112 },
      { department: ["ART", "ASIAN"], number: 121 },
    ]

    expect(applyFilter(query, courses)).toMatchSnapshot()
  })

  it("returns the matches on the expression", () => {
    const query: FilterExpression = {
      $type: "filter",
      $distinct: false,
      $filterType: "where",
      $where: {
        $type: "qualification",
        $key: "number",
        $value: 121,
        $operator: "$eq",
      },
    }

    const courses: Course[] = [
      { department: ["ASIAN"], number: 100 },
      { department: ["CSCI"], number: 121 },
      { department: ["CHEM", "BIO"], number: 111 },
      { department: ["CHEM", "BIO"], number: 112 },
      { department: ["ART", "ASIAN"], number: 121 },
    ]

    const result = applyFilter(query, courses)

    expect(result).toMatchSnapshot()
    expect(query._matches).toMatchSnapshot()
  })

  it("returns an empty list when not presented with a filter", () => {
    const query = {}

    const courses: Course[] = [
      { department: ["ASIAN"], number: 100 },
      { department: ["CSCI"], number: 121 },
      { department: ["CHEM", "BIO"], number: 111 },
      { department: ["CHEM", "BIO"], number: 112 },
      { department: ["ART", "ASIAN"], number: 121 },
    ]

    // @ts-expect-error: checks the fallback for a missing filter
    expect(applyFilter(query, courses)).toMatchSnapshot()
  })
})
