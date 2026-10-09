import uuid from "uuid/v4"
import { randomChar } from "@gob/lib"
import type { Result } from "@gob/types"

import { List, Record } from "immutable"
import type { CourseLookupFunc, CourseType } from "./types"
import type { Result as ValidationResult } from "./validate-schedule"
import { validateSchedule } from "./validate-schedule"

type ScheduleType = {
  id: string
  active: boolean
  index: number
  title: string
  clbids: List<string>
  year: number
  semester: number
}

// What a schedule can be built from: a saved schedule from JSON, or the
// fields of another Schedule. Older saves stored clbids as numbers.
export type ScheduleInput = Readonly<
  Partial<Omit<ScheduleType, "clbids">> & {
    clbids?: Iterable<string | number>
  }
>

const defaultValues: ScheduleType = {
  id: "unknown",
  active: false,
  index: 1,
  title: "no title",
  clbids: List(),
  year: 0,
  semester: 0,
}

const ScheduleRecord = Record(defaultValues)

function isListOfStrings(list: List<string | number>): list is List<string> {
  return list.every((item) => typeof item === "string")
}

// The Record defines a getter for each field, like `schedule.year`.
export class Schedule extends ScheduleRecord {
  constructor(data: ScheduleInput = {}) {
    let {
      id = uuid(),
      clbids = [],
      year,
      semester,
      active,
      index,
      title = `Schedule ${randomChar()}`,
    } = data

    // Older saves stored clbids as numbers; pad them back to the 10-digit
    // strings that course data uses
    let clbidList = List(clbids)
    let paddedClbids = isListOfStrings(clbidList)
      ? clbidList
      : clbidList.map((clbid) => String(clbid).padStart(10, "0"))

    super({
      ...(year !== undefined && { year }),
      ...(semester !== undefined && { semester }),
      ...(index !== undefined && { index }),
      ...(active !== undefined && { active }),
      title,
      id,
      clbids: paddedClbids,
    })
  }

  getTerm(): number {
    return parseInt(`${this.year}${this.semester}`, 10)
  }

  /////
  /// Helpers
  /////

  get recommendedCredits(): number {
    let semester = this.get("semester")
    if (semester === 1 || semester === 3) {
      return 4
    }
    if (semester === 4 || semester === 5) {
      return 2.5
    }
    return 1
  }

  async getCoursesWithErrors(
    getCourse: CourseLookupFunc,
    fabrications?: ReadonlyArray<CourseType> | List<CourseType>,
  ): Promise<List<Result<CourseType>>> {
    let term = this.getTerm()
    let promises = this.clbids.map((clbid) =>
      getCourse(clbid, term, fabrications),
    )
    return Promise.all(promises).then((results) => List(results))
  }

  async getCourses(
    getCourse: CourseLookupFunc,
    fabrications?: ReadonlyArray<CourseType> | List<CourseType>,
  ): Promise<List<CourseType>> {
    let coursesWithErrors = await this.getCoursesWithErrors(
      getCourse,
      fabrications,
    )

    return coursesWithErrors.flatMap((r) => (r.error ? [] : [r.result]))
  }

  isSpecificTerm(year: number, semester: number): boolean {
    return this.year === year && this.semester === semester
  }

  async validate(courses: List<CourseType>): Promise<ValidationResult> {
    return validateSchedule(this, courses)
  }
}
