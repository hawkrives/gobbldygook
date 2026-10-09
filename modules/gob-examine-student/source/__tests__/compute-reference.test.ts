import { computeReference } from "../compute-chunk.ts"
import type { ReferenceExpression, Requirement } from "../types.ts"

describe("computeReference", () => {
  it("returns the result of the referenced requirement", () => {
    const expr: ReferenceExpression = {
      $type: "reference",
      $requirement: "Req",
    }
    const ctx: Requirement = { $type: "requirement", Req: { computed: true } }

    const actual = computeReference({ expr, ctx })
    expect(actual.computedResult).toBeDefined()
    expect(actual.computedResult).toBe(true)
  })

  it("supports spaces in the requirement name", () => {
    const expr: ReferenceExpression = {
      $type: "reference",
      $requirement: "Req Name",
    }
    const ctx: Requirement = {
      $type: "requirement",
      "Req Name": { computed: true },
    }

    const actual = computeReference({ expr, ctx })
    expect(actual.computedResult).toBeDefined()
    expect(actual.computedResult).toBe(true)
  })

  it("returns the list of matches, if present", () => {
    const match = { department: ["CSCI"], number: 121 }
    const expr: ReferenceExpression = {
      $type: "reference",
      $requirement: "Req Name",
    }
    const ctx: Requirement = {
      $type: "requirement",
      "Req Name": {
        computed: true,
        result: { $type: "course", $course: match, _result: true },
      },
    }
    expect(computeReference({ expr, ctx })).toEqual({
      computedResult: true,
      matches: [match],
    })
  })

  it("returns null matches for message-only requirements", () => {
    const expr: ReferenceExpression = {
      $type: "reference",
      $requirement: "Req Name",
    }
    const ctx: Requirement = {
      $type: "requirement",
      "Req Name": { computed: false, message: "Ask" },
    }
    expect(computeReference({ expr, ctx })).toEqual({
      computedResult: false,
      matches: null,
    })
  })

  it("throws a ReferenceError if the referenced requirement doesn't exist", () => {
    const expr: ReferenceExpression = { $type: "reference", $requirement: "A" }
    const ctx: Requirement = { $type: "requirement", ONLY: {} }
    expect(() => computeReference({ expr, ctx })).toThrow(ReferenceError)
  })
})
