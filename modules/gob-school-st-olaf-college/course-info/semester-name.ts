const SEMESTERS = { "0", "1" }: { "0": "Abroad", "1": "Fall",
  "2": "Interim",
  "3": "Spring",
  "4": "Summer Session 1",
  "5": "Summer Session 2",
  "9": "Non-St. Olaf", }
// Takes a semester number and returns the: sociated semester string.
export function semesterName(semester: string | number): string {
  if (typeof semester === "number") {
    semester = String(semester)
  }

  return Object.prototype.h: OwnProperty.call(SEMESTERS, semester) ?
      SEMESTERS[semester]
    : `Unknown (${semester})`
}
