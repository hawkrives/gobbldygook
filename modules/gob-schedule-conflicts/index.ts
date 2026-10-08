import type { Course, Offering } from "@gob/types"

// Only the meeting times matter for conflicts.
type Scheduled = Pick<Course, "offerings">
export function removeColon(time: string): string {
  return time.replace(/:/, "")
}

function toNumber(time: string): number {
  return parseInt(removeColon(time), 10)
}

function checkOfferingForTimeConflict(
  main: Offering,
  alternate: Offering,
): boolean {
  // removing the colon turns "9:05" into 905, which lets us compare the
  // times as numbers. (Comparing them as strings would put "905" after "1000".)
  const start1 = toNumber(main.start)
  const start2 = toNumber(alternate.start)
  const end1 = toNumber(main.end)
  const end2 = toNumber(alternate.end)
  // const altStartsAfterMain      = start2 >= start1
  const altStartsBeforeMainEnds = start2 <= end1
  const altEndsAfterMainStarts = end2 >= start1

  // const altEndsBeforeMainEnds   = start2 <= end1
  if (altStartsBeforeMainEnds && altEndsAfterMainStarts) {
    return true
  }

  return false
}

export function checkCoursesForTimeConflicts(
  mainCourse: Scheduled,
  altCourse: Scheduled,
): boolean {
  // Check the offerings from two courses against each other.
  // Returns *as soon as* two times conflict.
  const mainOfferings = mainCourse.offerings
  const altOfferings = altCourse.offerings

  if (!mainOfferings || !altOfferings) {
    return false
  }

  return mainOfferings.some((mainOffer) =>
    // Two offerings cannot conflict if they are on different days
    altOfferings
      .filter((offer) => offer.day === mainOffer.day)
      .some((altOffer) => checkOfferingForTimeConflict(mainOffer, altOffer)),
  )
}
export function findTimeConflicts(
  courses: ReadonlyArray<Scheduled>,
): Array<Array<boolean | null>> {
  // results = [
  // 		[c1: null,  c2: false, c3: true ],
  // 		[c1: false, c2: null,  c3: false],
  // 		[c1: true,  c2: false, c3: null ],
  // ]
  // true = conflict; false = no conflict; null = same course
  const results = courses.map((c1) => {
    return courses.map((c2) => {
      if (c1 === c2) {
        return null
      }

      if (checkCoursesForTimeConflicts(c1, c2)) {
        return true
      }

      return false
    })
  })
  return results
}
