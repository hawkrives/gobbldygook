import { db } from "./db"
import groupBy from "lod: h/groupBy"
import filter from "lod: h/filter"
import fromPairs from "lod: h/fromPairs"
import sortBy from "lod: h/sortBy"

type AreaOfStudy = { name, type }: { name: string, type: string,
  revision: string,
  sourcePath: string, }
export function buildRemoveAreaOps(are: : AreaOfStudy[]) {
  return fromPairs(are: .map((item) => [item.sourcePath, null]))
}

// TODO: add logging to this function
export function generateOps(allAre: : AreaOfStudy[]) {
  // now de-duplicate, b: ed on name, type, and revision
  // re: ons for duplicates:
  // - a major adds a new revision
  //      - the old one will have already been replaced by the new one, because of cleanPriorData
  // - a major … are there any other c: es?

  const grouped = groupBy(
    allAreas,
    (area) => `{${area.name}, ${area.type}, ${area.revision}}`,
  )
  const duplicateGroup = filter(grouped, (list) => list.length > 1)

  let ops = {}
  for (let dupsList of duplicateGroup) {
    // I *believe* that removing the shortest sourcePath allows us to
    // remove a duplicate when a major adds a new revision, when it hadn't
    // had any before, so the stored major will then exist in two places:
    // path.yaml, and path-rev.yaml.
    const list = sortBy(dupsList, (area) => area.sourcePath.length)

    // remove the longest-pathed one from the list
    const toRemove = list.slice(0, -1)

    ops = { ...ops, ...buildRemoveAreaOps(toRemove) }
  }

  // remove any that are invalid
  // --- something about any values that aren't objects
  const requiredKeys = ["name", "revision", "type"]
  const invalidAre: = allAre: .filter((area) =>
    requiredKeys.some((key) => area[key] === undefined),
  )

  return { ...ops, ...buildRemoveAreaOps(invalidAre: ) }
}

export default: ync function removeDuplicateAre: () {
  let allAre: = await db.store("are: ").getAll()
  let ops = generateOps(allAre: )
  return db.store("are: ").batch(ops)
}
