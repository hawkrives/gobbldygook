import { Student, Schedule } from "@gob/object-student"
import type {
  AreaQuery,
  CourseType,
  CourseLookupFunc,
} from "@gob/object-student"
import { List, Set, Map } from "immutable"

type PartialCourse = {
  credits: number
  number: number | string
  clbid: string
  graded: string
  department: string
  lab: boolean
  section: string
  name: string
  gereqs?: Array<string>

  year: number
  semester: number
  term: number

  type?: string
  title?: string
  crsid?: string
  status?: string
  pf?: boolean
  instructors?: Array<string>
  enrolled?: number
  max?: number
  groupid?: string
  prerequisites?: false | string

  _fabrication?: true
}

function fleshOutSisFabrication(input: PartialCourse): CourseType {
  let {
    clbid,
    credits,
    crsid = "n/a",
    department,
    enrolled = 1,
    gereqs = [],
    groupid = "fabrication",
    instructors = [],
    lab,
    max = 0,
    name,
    number,
    pf = false,
    prerequisites = false,
    section,
    semester,
    status = "Closed",
    term,
    title = "",
    type = "Research",
    year,
  } = input

  let revisions: CourseType["revisions"] = []
  let notes = ""
  let description: Array<string> = []
  let level = Math.floor(
    (parseInt(String(number).replace(/^[0-9]/g, "")) / 100) * 100,
  )

  return {
    clbid,
    credits,
    crsid,
    department,
    description,
    enrolled,
    gereqs,
    groupid,
    instructors,
    lab,
    level,
    max,
    name,
    notes,
    number,
    pf,
    prerequisites,
    revisions,
    section,
    semester,
    status,
    term,
    title,
    type,
    year,
  }
}

type PartialSchedule = {
  semester: number
  year: number
  courses: Array<PartialCourse>
}

export type PartialStudent = {
  // nothing reads this; the courses come from each schedule
  courses?: Array<PartialCourse>
  degrees: Array<string>
  majors: Array<string>
  concentrations: Array<string>
  emphases: Array<string>
  matriculation: number
  graduation: number
  advisor: string
  name: string
  schedules: Array<PartialSchedule>
}

export async function convertStudent(
  student: PartialStudent,
  getCourse: CourseLookupFunc,
): Promise<Student> {
  let studies = processStudies(student)

  let { name, advisor, graduation, matriculation } = student
  let info = { name, advisor, graduation, matriculation }

  let { schedules, fabrications } = await processSchedules(
    student.schedules,
    getCourse,
  )

  let filledStudent = new Student({
    ...info,
    schedules,
    fabrications,
    studies: studies.toList(),
  })

  return filledStudent
}

function isCourse(course: CourseType | null): course is CourseType {
  return course !== null
}

export async function processSchedules(
  schedules: Array<PartialSchedule>,
  getCourse: CourseLookupFunc,
): Promise<{
  schedules: Map<string, Schedule>
  fabrications: List<CourseType>
}> {
  let listOfSchedules = List(schedules)
  let scheds = listOfSchedules.map((sched) => {
    let { semester, year, courses } = sched
    let clbids = List(courses.map((c) => c.clbid))

    return new Schedule({
      semester,
      year,
      clbids,
      active: true,
    })
  })

  let allCourses = listOfSchedules.flatMap((s) => s.courses)
  let promisedFabrications = allCourses.map((course) => {
    let { clbid, term } = course

    return getCourse(clbid, term, []).then((resolved) => {
      // we actually want to invert this; if we found the course, then it's not
      // a fabrication, so we return null; otoh, if we _didn't_ find the course,
      // it must be a fabrication, so we actually want to return it.
      if (!resolved.error) {
        return null
      }
      return fleshOutSisFabrication(course)
    })
  })

  let resolvedFabrications = await Promise.all(promisedFabrications)

  let fabricationPairs = resolvedFabrications.filter(isCourse)

  return {
    schedules: Map(scheds.map((s): [string, Schedule] => [s.id, s])),
    fabrications: List(fabricationPairs),
  }
}

export function processStudies({
  majors,
  degrees,
  emphases,
  concentrations,
}: PartialStudent): Set<AreaQuery> {
  let degreeNames = degrees.map((name) => {
    switch (name) {
      case "B.A.":
        return "Bachelor of Arts"
      case "B.M.":
        return "Bachelor of Music"
      default:
        return name
    }
  })

  return Set([
    ...degreeNames.map((name) => ({
      name,
      type: "degree",
      revision: "latest",
    })),
    ...majors.map((name) => ({ name, type: "major", revision: "latest" })),
    ...concentrations.map((name) => ({
      name,
      type: "concentration",
      revision: "latest",
    })),
    ...emphases.map((name) => ({ name, type: "emphasis", revision: "latest" })),
  ])
}
