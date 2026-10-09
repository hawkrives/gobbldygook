import sortBy from "lodash/sortBy.js"
import type { AreaQuery } from "./types.ts"
const types = ["degree", "major", "concentration", "emphasis"]
export function sortStudiesByType(studies: ReadonlyArray<AreaQuery>) {
  return sortBy(studies, (s) => types.indexOf(s.type))
}
