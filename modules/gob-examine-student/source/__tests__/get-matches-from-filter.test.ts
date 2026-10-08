import getMatchesFromFilter from "../get-matches-from-filter"
import type { FilterExpression, Requirement } from "../types"

describe("getMatchesFromFilter", () => {
  it("returns the matches from the requirement's filter property", () => {
    const filter: FilterExpression = {
      $type: "filter",
      $distinct: false,
      $filterType: "where",
      $where: {
        $type: "qualification",
        $key: "department",
        $operator: "$eq",
        $value: "CSCI",
      },
      _matches: [
        { department: ["CSCI"], number: 320 },
        { department: ["CSCI"], number: 160 },
      ],
    }
    const requirement: Requirement = { $type: "requirement", filter }

    expect(getMatchesFromFilter(requirement)).toBe(filter._matches)
  })
})
