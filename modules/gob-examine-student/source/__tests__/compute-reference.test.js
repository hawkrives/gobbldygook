import { computeReference } from "../compute-chunk"

describe("computeReference", () => {
  it("returns the result of the referenced requirement", () => {
    const expr = { $requirement: "Req" }
    const ctx = { Req: { computed: true } }

    const actual = computeReference({ expr, ctx })
    expect(actual.computedResult).toBeDefined()
    expect(actual.computedResult).toBe(true)
  })

  it("supports spaces in the requirement name", () => {
    const expr = { $requirement: "Req Name" }
    const ctx = { "Req Name": { computed: true } }

    const actual = computeReference({ expr, ctx })
    expect(actual.computedResult).toBeDefined()
    expect(actual.computedResult).toBe(true)
  })

  it("returns the list of matches, if present", () => {
    const match = { department: ["CSCI"], number: 121 }
    const expr = { $requirement: "Req Name" }
    const ctx = {
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
    const expr = { $requirement: "Req Name" }
    const ctx = { "Req Name": { computed: false, message: "Ask" } }
    expect(computeReference({ expr, ctx })).toEqual({
      computedResult: false,
      matches: null,
    })
  })

  it("throws a ReferenceError if the referenced requirement doesn't exist", () => {
    const expr = { $requirement: "A" }
    const ctx = { ONLY: {} }
    expect(() => computeReference({ expr, ctx })).toThrowError(ReferenceError)
  })
})
