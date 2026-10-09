// Fixture course and area data for the Playwright suite.
//
// The app normally downloads this from stolaf.dev and github.io. The years
// are computed from today's date because the loader skips course files more
// than five years old, and a manually created student defaults to
// matriculating three years ago.

export const COURSE_DATA_BASE = "https://stolaf.dev/course-data"
export const AREA_DATA_BASE =
  "https://hawkrives.github.io/gobbldygook-area-data"

export const FALL = 1
export const SPRING = 3

const thisYear = new Date().getFullYear()
export const FIRST_YEAR = thisYear - 3
export const YEARS = [
  FIRST_YEAR,
  FIRST_YEAR + 1,
  FIRST_YEAR + 2,
  FIRST_YEAR + 3,
]

/** The catalog revision string for an academic year, like "2023-24". */
export function revisionFor(year: number): string {
  return `${year}-${String(year + 1).slice(2)}`
}

export type FixtureCourse = {
  readonly clbid: string
  readonly crsid: string
  readonly groupid: string
  readonly credits: number
  readonly department: string
  readonly number: number
  readonly name: string
  readonly section: string
  readonly status: string
  readonly type: string
  readonly level: number
  readonly year: number
  readonly semester: number
  readonly term: number
  readonly gereqs: ReadonlyArray<string>
  readonly instructors: ReadonlyArray<string>
  readonly description: ReadonlyArray<string>
  readonly notes: ReadonlyArray<string>
  readonly prerequisites: false
  readonly pf: boolean
  readonly enrolled: number
  readonly max: number
  readonly offerings: ReadonlyArray<{
    readonly day: string
    readonly start: string
    readonly end: string
    readonly location: string
  }>
  readonly revisions: ReadonlyArray<never>
}

type CatalogEntry = {
  readonly department: string
  readonly number: number
  readonly name: string
  readonly semester: number
  readonly gereqs: ReadonlyArray<string>
  readonly instructors: ReadonlyArray<string>
}

const catalog: CatalogEntry[] = [
  {
    department: "CSCI",
    number: 121,
    name: "Principles of Computer Science",
    semester: FALL,
    gereqs: ["AQR"],
    instructors: ["Ada Lovelace"],
  },
  {
    department: "CSCI",
    number: 241,
    name: "Hardware Design",
    semester: SPRING,
    gereqs: [],
    instructors: ["Grace Hopper"],
  },
  {
    department: "CSCI",
    number: 251,
    name: "Software Design",
    semester: FALL,
    gereqs: [],
    instructors: ["Barbara Liskov"],
  },
  {
    department: "CSCI",
    number: 253,
    name: "Algorithms and Data Structures",
    semester: SPRING,
    gereqs: [],
    instructors: ["Edsger Dijkstra"],
  },
  {
    department: "MATH",
    number: 120,
    name: "Calculus I",
    semester: FALL,
    gereqs: ["AQR"],
    instructors: ["Emmy Noether"],
  },
  {
    department: "ART",
    number: 102,
    name: "Drawing",
    semester: SPRING,
    gereqs: ["ALS-A"],
    instructors: ["Frida Kahlo"],
  },
]

function makeCourse(
  entry: CatalogEntry,
  year: number,
  index: number,
): FixtureCourse {
  let { department, number, name, semester, gereqs, instructors } = entry
  let clbid = String(year * 1000 + semester * 100 + index).padStart(10, "0")
  return {
    clbid,
    crsid: String(index + 1).padStart(10, "0"),
    groupid: String(index + 1).padStart(10, "0"),
    credits: 1,
    department,
    number,
    name,
    section: "A",
    status: "O",
    type: "Research",
    level: Math.floor(number / 100) * 100,
    year,
    semester,
    term: year * 10 + semester,
    gereqs,
    instructors,
    description: [`A fixture course about ${name.toLowerCase()}.`],
    notes: [],
    prerequisites: false,
    pf: false,
    enrolled: 10,
    max: 30,
    // each course gets its own hour so the schedules don't conflict
    offerings: ["Mo", "We", "Fr"].map((day) => ({
      day,
      start: `${8 + index}:00`,
      end: `${8 + index}:55`,
      location: "RNS 310",
    })),
    revisions: [],
  }
}

export function coursesForTerm(year: number, semester: number) {
  return catalog
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.semester === semester)
    .map(({ entry, index }) => makeCourse(entry, year, index))
}

export function allCourses(): FixtureCourse[] {
  return YEARS.flatMap((year) => [
    ...coursesForTerm(year, FALL),
    ...coursesForTerm(year, SPRING),
  ])
}

/** Looks up the fixture course for a department and number in a given year. */
export function course(deptnum: string, year: number = FIRST_YEAR) {
  let found = allCourses().find(
    (c) => `${c.department} ${c.number}` === deptnum && c.year === year,
  )
  if (!found) {
    throw new Error(`no fixture course ${deptnum} in ${year}`)
  }
  return found
}

export const COURSE_COUNT = allCourses().length

export function courseInfo() {
  let files = YEARS.flatMap((year) =>
    [FALL, SPRING].map((semester) => ({
      type: "json",
      year,
      term: year * 10 + semester,
      path: `terms/${year}${semester}.json`,
      hash: `fixture-${year}${semester}`,
    })),
  )
  return { type: "courses", files }
}

export const areas: Record<string, string> = {
  "majors/computer-science.yaml": `
name: Computer Science
type: Major
revision: '${revisionFor(FIRST_YEAR)}'

result: all of (Foundations, Upper Level)

Foundations:
  result: all of (CSCI 121, CSCI 241)

Upper Level:
  result: one of (CSCI 251, CSCI 253)
`.trimStart(),
  "majors/mathematics.yaml": `
name: Mathematics
type: Major
revision: '${revisionFor(FIRST_YEAR)}'

result: MATH 120
`.trimStart(),
}

export const AREA_COUNT = Object.keys(areas).length

export function areaInfo() {
  let files = Object.keys(areas).map((path) => ({
    type: "yaml",
    path,
    hash: `fixture-${path}`,
  }))
  return { type: "areas", files }
}
