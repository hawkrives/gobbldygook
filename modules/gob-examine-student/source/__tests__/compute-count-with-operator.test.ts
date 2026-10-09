import computeCountWithOperator from "../compute-count-with-operator"

describe("computeCountWithOperator", () => {
  it("throws on operators other than $eq, $lte, or $gte", () => {
    expect(() =>
      // @ts-expect-error: checks the runtime guard against bad operators
      computeCountWithOperator({ comparator: "$invalid" }),
    ).toThrow(TypeError)
  })

  it("computes $lte", () => {
    expect(
      computeCountWithOperator({ comparator: "$lte", has: 1, needs: 1 }),
    ).toBe(true)
    expect(
      computeCountWithOperator({ comparator: "$lte", has: 1, needs: 0 }),
    ).toBe(false)
    expect(
      computeCountWithOperator({ comparator: "$lte", has: 0, needs: 1 }),
    ).toBe(true)
  })

  it("computes $gte", () => {
    expect(
      computeCountWithOperator({ comparator: "$gte", has: 1, needs: 1 }),
    ).toBe(true)
    expect(
      computeCountWithOperator({ comparator: "$gte", has: 1, needs: 0 }),
    ).toBe(true)
    expect(
      computeCountWithOperator({ comparator: "$gte", has: 0, needs: 1 }),
    ).toBe(false)
  })

  it("computes $eq", () => {
    expect(
      computeCountWithOperator({ comparator: "$eq", has: 1, needs: 1 }),
    ).toBe(true)
    expect(
      computeCountWithOperator({ comparator: "$eq", has: 1, needs: 0 }),
    ).toBe(false)
    expect(
      computeCountWithOperator({ comparator: "$eq", has: 0, needs: 1 }),
    ).toBe(false)
  })
})
