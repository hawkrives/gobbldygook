import { sortStudiesByType } from "../sort-studies-by-type"
import type { AreaQuery } from "../types"

describe("sortStudiesByType", () => {
  it("sorts a list of areas of study by type", () => {
    const input = [
      { type: "degree" },
      { type: "concentration" },
      { type: "emphasis" },
      { type: "major" },
      // sorting only reads the type
    ] as AreaQuery[]

    expect(sortStudiesByType(input)).toMatchSnapshot()
  })
})
