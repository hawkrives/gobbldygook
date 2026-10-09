import groupBy from "lodash/groupBy.js"
import flatten from "lodash/flatten.js"
import sortBy from "lodash/sortBy.js"
import values from "lodash/values.js"
import findLast from "lodash/findLast.js"

// The fields filterAreaList reads, which both area files and parsed areas
// have
type AreaSummary = {
  name?: string | undefined
  type?: string | undefined
  revision?: string | undefined
  "available through"?: number | undefined
}

function convertRevisionToYear(rev: string | undefined): number {
  // The +1 is because the year is the beginning of the academic year, but
  // the graduation is the end.
  return Number((rev ?? "").split("-")[0]) + 1
}

// Matricated in: 2014
// Graduates in:  2018
// Physics (2011-12)
// Physics (2015-16)
// If there's only one Physics major, then anyone can see and choose it.
// Otherwise, if there are more than one, then the list gets culled.
// The newest revision of a major is always available, unless the 'available
// through' key is set.
// You can only enroll in a major if there isn't a newer one, unless your
// class year is between the previous one and the newest.
export function filterAreaList<T extends AreaSummary>(
  areas: ReadonlyArray<T>,
  availableThrough: number,
): Array<T> {
  // Remove all areas that are closed to new class years.
  let onlyAvailableAreas = areas.filter(
    (area) =>
      area["available through"] == null ||
      area["available through"] === 0 ||
      Number.isNaN(area["available through"]) ||
      area["available through"] > availableThrough,
  )
  // Group them together to filter them down
  let groupedAreas = groupBy(
    onlyAvailableAreas,
    (area) => `${area.name}|${area.type}`,
  )
  let filtered = values(groupedAreas).map((areaSet) => {
    // The newest revision of a major is always available, unless the
    // 'available through' key is set. (We took care of that up above.)
    if (areaSet.length === 1) {
      return areaSet
    }

    // You can only enroll in a major if there isn't a newer one, unless
    // your class year is between the prior revision and the newest
    // revision.
    // We'll start out by sorting them.
    areaSet = sortBy(areaSet, (area) => area.revision)
    let newestApplicableArea = findLast(areaSet, (area) => {
      let revision = convertRevisionToYear(area.revision)
      return revision <= availableThrough
    })
    return newestApplicableArea ?? []
  })
  return flatten(filtered)
}
