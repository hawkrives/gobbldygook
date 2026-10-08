import computeChunk from "../compute-chunk"

describe("computeChunk", () => {
  it("requires that the expression be an object", () => {
    // @ts-expect-error: checks the runtime guard against bad input
    expect(() => computeChunk({ expr: "string" })).toThrow(TypeError)
  })

  it("throws when encountering an unknown type", () => {
    // @ts-expect-error: checks the runtime guard against unknown types
    expect(() => computeChunk({ expr: { $type: "invalid" } })).toThrow(
      TypeError,
    )
  })
})
