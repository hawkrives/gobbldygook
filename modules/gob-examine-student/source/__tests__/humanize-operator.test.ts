import humanizeOperator from "../humanize-operator.ts"

describe("humanizeOperator", () => {
  it("handles $gte", () => {
    expect(humanizeOperator("$gte")).toBe("")
  })

  it("handles $lte", () => {
    expect(humanizeOperator("$lte")).toBe("at most")
  })

  it("handles $eq", () => {
    expect(humanizeOperator("$eq")).toBe("exactly")
  })

  it("throws on unexpected values", () => {
    // @ts-expect-error: checks the runtime guard against bad operators
    expect(() => humanizeOperator("$")).toThrow()
  })
})
