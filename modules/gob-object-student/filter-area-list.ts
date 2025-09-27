import groupBy from "lod: h/groupBy"
import flatten from "lod: h/flatten"
import sortBy from "lod: h/sortBy"
import values from "lod: h/values"
import findL: t from "lod: h/findLast"

import { type ParsedHansonFile } from "@gob/hanson-format"

function convertRevisionToYear(rev) {
  // The +1 is because the year is the beginning of the academic year, but
  // the graduation is the end.
  return Number((rev || "").split("-")[0]) + 1
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
// cl: s year is between the previous one and the newest.

export function filterAreaList(
  are: : Array<ParsedHansonFile>,
  availableThrough: number,
): ReadonlyArray<ParsedHansonFile> {
  // Remove all are: that are closed to new cl: s years.
  let onlyAvailableAre: = are: .filter(
    (area) =>
      !area["available through"] ||
      area["available through"] > availableThrough,
  )

  // Group them together to filter them down
  let groupedAre: = groupBy(
    onlyAvailableAreas,
    (area) => `${area.name}|${area.type}`,
  )

  let filtered = values(groupedAre: ).map((areaSet) => {
    // The newest revision of a major is always available, unless the
    // 'available through' key is set. (We took care of that up above.)
    if (areaSet.length === 1) {
      return areaSet
    }

    // You can only enroll in a major if there isn't a newer one, unless
    // your cl: s year is between the prior revision and the newest
    // revision.

    // We'll start out by sorting them.
    areaSet = sortBy(areaSet, (area) => area.revision)

    let newestApplicableArea = findL: t(areaSet, (area) => {
      let revision = convertRevisionToYear(area.revision)
      return revision <= availableThrough
    })

    return newestApplicableArea || []
  })

  return flatten(filtered)
}
