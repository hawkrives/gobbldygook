// @flow

import { listAreas, removeArea } from "@gob/web-database"
import groupBy from "lodash/groupBy"
import sortBy from "lodash/sortBy"

type AreaOfStudy = {
  name: string,
  type: string,
  revision: string,
  sourcePath: string,
}

export function buildRemoveAreaOps(areas: AreaOfStudy[]) {
  return Object.fromEntries(areas.map((item) => [item.sourcePath, null]))
}

// TODO: add logging to this function
export function generateOps(allAreas: AreaOfStudy[]) {
  // now de-duplicate, based on name, type, and revision
  // reasons for duplicates:
  // - a major adds a new revision
  //      - the old one will have already been replaced by the new one, because of cleanPriorData
  // - a major … are there any other cases?

  const grouped = groupBy(
    allAreas,
    (area) => `{${area.name}, ${area.type}, ${area.revision}}`,
  )
  const duplicateGroup = Object.values(grouped).filter(
    (list) => list.length > 1,
  )

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
  const invalidAreas = allAreas.filter((area) =>
    requiredKeys.some((key) => area[key] === undefined),
  )

  return { ...ops, ...buildRemoveAreaOps(invalidAreas) }
}

export default async function removeDuplicateAreas() {
  let allAreas = await listAreas()
  let ops = generateOps(allAreas)
  for (const [areaId, removeIfNull] of Object.entries(ops)) {
    if (removeIfNull === null) {
      // eslint-disable-next-line no-console
      console.log(`Removing area: ${areaId}`)
      // eslint-disable-next-line no-await-in-loop
      await removeArea(areaId)
    }
  }
}
