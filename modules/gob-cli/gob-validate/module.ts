const usage = `
usage: gob-validate < file
validates the schedules of the given student
`

import meow from "meow"
import { getCourse } from "../lib/get-course"
import { loadJson } from "../lib/load-json"
import { Student } from "@gob/object-student"
import type { StudentInput } from "@gob/object-student"
import { toPrettyTerm, buildDeptNum } from "@gob/school-st-olaf-college"

function args() {
  return meow(usage, { booleanDefault: false })
}

const print = (indent: number, message: string) => {
  console.log("".padStart(indent * 2, " ") + message)
}

export default async function main() {
  let { input } = args()

  // student files are trusted to have the shape of a saved Student
  let student = new Student((await loadJson(input[0])) as StudentInput)

  let promises = student.schedules.toList().map(async (schedule) => {
    let courses = await schedule.getCourses(getCourse, student.fabrications)
    let { hasConflict, warnings } = await schedule.validate(courses)

    return {
      courses,
      term: schedule.getTerm(),
      hasConflict,
      warnings,
    }
  })

  let schedules = await Promise.all(promises)

  let anyConflicts = schedules.some((s) => s.hasConflict)

  for (let schedule of schedules) {
    let { courses, hasConflict, warnings } = schedule

    if (!hasConflict) {
      continue
    }

    print(0, toPrettyTerm(schedule.term))

    for (let course of courses) {
      print(1, buildDeptNum(course))

      let courseConflicts = warnings.get(course.clbid)

      if (!courseConflicts) {
        continue
      }

      let courseHasConflict = courseConflicts.some(Boolean)

      if (!courseHasConflict) {
        print(2, "No warnings")
        continue
      }

      for (let conflict of courseConflicts) {
        print(2, `- ${conflict.msg}`)
      }
    }
  }

  if (!anyConflicts) {
    console.log("No warnings")
  }
}
