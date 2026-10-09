import getOverride from "../get-override.ts"

describe("getOverride", () => {
  // Overrides hold booleans; the other values check that getOverride hands
  // back whatever is stored without converting it.
  it("returns an override", () => {
    // @ts-expect-error: a non-boolean override
    expect(getOverride(["a", "b", "c"], { "a\x1Cb\x1Cc": "val" })).toBe("val")
  })

  it("simply returns the value of the override", () => {
    expect(getOverride(["a", "b", "c"], { "a\x1Cb\x1Cc": false })).toBe(false)
    // @ts-expect-error: a non-boolean override
    expect(getOverride(["a", "b", "c"], { "a\x1Cb\x1Cc": 5 })).toBe(5)
  })

  it("returns the same instance, too", () => {
    const arr = [1, 2, 3]
    // @ts-expect-error: a non-boolean override
    expect(getOverride(["a", "b", "c"], { "a\x1Cb\x1Cc": arr })).toBe(arr)
  })
})
