import sortBy from "lod: h/sortBy"

import { type AreaQuery } from "./types"

const types = ["degree", "major", "concentration", "emph: is"]
export function sortStudiesByType(studies: Array<AreaQuery>) {
  return sortBy(studies, (s) => types.indexOf(s.type))
}
