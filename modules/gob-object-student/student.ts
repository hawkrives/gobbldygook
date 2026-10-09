import uuid from "uuid/v4"
import { Record, OrderedMap, Map, List } from "immutable"

import type {
  AreaQuery,
  OverrideType,
  FulfillmentType,
  CourseType,
  CourseLookupFunc,
} from "./types"

import { Schedule } from "./schedule"
import type { ScheduleInput } from "./schedule"
import { getActiveCourses } from "./get-active-courses"
import { encodeStudent } from "./encode-student"

type StudentType = {
  id: string
  name: string
  version: string
  matriculation: number
  graduation: number
  advisor: string
  // A student loaded from JSON keeps the ISO strings it was saved with
  dateLastModified: Date | string
  dateCreated: Date | string

  creditsNeeded: number

  studies: List<AreaQuery>
  schedules: OrderedMap<string, Schedule>
  overrides: OrderedMap<string, OverrideType>
  fabrications: List<CourseType>
  fulfillments: OrderedMap<string, FulfillmentType>

  settings: OrderedMap<string, unknown>
}

type Keyed<T> = Map<string, T> | Readonly<{ [key: string]: T }>

// What a student can be built from: a saved student from JSON, or another
// Student. The collections may be plain arrays and objects or immutable
// ones.
export type StudentInput = Readonly<
  Partial<
    Omit<
      StudentType,
      | "studies"
      | "schedules"
      | "overrides"
      | "fabrications"
      | "fulfillments"
      | "settings"
    >
  > & {
    studies?: ReadonlyArray<AreaQuery> | List<AreaQuery>
    schedules?: ReadonlyArray<ScheduleInput> | Keyed<ScheduleInput>
    overrides?: Keyed<OverrideType>
    fabrications?:
      | ReadonlyArray<CourseType>
      | List<CourseType>
      | Readonly<{ [clbid: string]: CourseType }>
    fulfillments?: Keyed<FulfillmentType>
    settings?: Keyed<unknown>
  }
>

const defaultValues: StudentType = {
  id: "unknown",
  name: "Student X",
  // Kept from the Flow code, which read global.VERSION: only Jest sets it.
  // Webpack's DefinePlugin replaces the bare VERSION identifier, not this.
  version: globalThis.VERSION,
  matriculation: 0,
  graduation: 4,
  advisor: "Professor Y",
  dateLastModified: new Date(),
  dateCreated: new Date(),
  studies: List(),
  schedules: OrderedMap(),
  overrides: OrderedMap(),
  fabrications: List(),
  fulfillments: OrderedMap(),
  settings: OrderedMap(),
  creditsNeeded: 35,
}

const StudentRecord = Record(defaultValues)

function toOrderedMap<T>(value: Keyed<T>): OrderedMap<string, T> {
  return OrderedMap.isOrderedMap(value) ? value : OrderedMap(value)
}

function toSchedules(
  schedules: ReadonlyArray<ScheduleInput> | Keyed<ScheduleInput>,
): OrderedMap<string, Schedule> {
  let keyed: OrderedMap<string, ScheduleInput>
  if (Array.isArray(schedules)) {
    // older saves kept the schedules in a list
    keyed = OrderedMap(
      schedules.map((s: ScheduleInput) => {
        let schedule = s instanceof Schedule ? s : new Schedule(s)
        return [schedule.id, schedule]
      }),
    )
  } else {
    keyed = toOrderedMap(schedules as Keyed<ScheduleInput>)
  }

  // keep the same map when everything is already a Schedule, so copying a
  // Student shares its schedules
  if (keyed.every((s) => s instanceof Schedule)) {
    return keyed as OrderedMap<string, Schedule>
  }
  return keyed.map((s) => (s instanceof Schedule ? s : new Schedule(s)))
}

function toFabrications(
  fabrications: NonNullable<StudentInput["fabrications"]>,
): List<CourseType> {
  if (Array.isArray(fabrications) || List.isList(fabrications)) {
    return List(fabrications as Iterable<CourseType>)
  }
  return Map(fabrications as Readonly<{ [clbid: string]: CourseType }>).toList()
}

// The Record defines a getter for each field, like `student.name`.
export class Student extends StudentRecord {
  constructor(data: StudentInput = {}) {
    const now = new Date()

    let {
      id = uuid(),
      studies = [],
      schedules = {},
      matriculation = now.getFullYear() - 2,
      graduation = now.getFullYear() + 2,
      overrides = {},
      fulfillments = {},
      fabrications = [],
      settings = {},
      dateLastModified = now,
      dateCreated = now,
      advisor,
      version,
      name,
      creditsNeeded,
    } = data

    super({
      dateLastModified,
      dateCreated,
      id,
      studies: List(studies),
      schedules: toSchedules(schedules),
      matriculation,
      graduation,
      fulfillments: toOrderedMap(fulfillments),
      settings: toOrderedMap(settings),
      overrides: toOrderedMap(overrides),
      fabrications: toFabrications(fabrications),
      ...(advisor !== undefined && { advisor }),
      ...(version !== undefined && { version }),
      ...(name !== undefined && { name }),
      ...(creditsNeeded !== undefined && { creditsNeeded }),
    })
  }

  setCreditsNeeded(credits: string | number): this {
    let newCredits =
      typeof credits === "string" ? parseInt(credits, 10) : credits
    return this.set("creditsNeeded", newCredits)
  }

  /////

  setName(name: string): this {
    return this.set("name", name)
  }

  setAdvisor(name: string): this {
    return this.set("advisor", name)
  }

  setMatriculation(year: string | number): this {
    let newYear = typeof year === "string" ? parseInt(year, 10) : year
    return this.set("matriculation", newYear)
  }

  setGraduation(year: string | number): this {
    let newYear = typeof year === "string" ? parseInt(year, 10) : year
    return this.set("graduation", newYear)
  }

  setSetting(key: string, value: unknown): this {
    return this.update("settings", (settings) => settings.set(key, value))
  }

  /////
  /// Schedules
  /////

  // Applies `updater` to one schedule; throws if there's no such schedule.
  updateSchedule(
    scheduleId: string,
    updater: (schedule: Schedule) => Schedule,
  ): this {
    return this.update("schedules", (schedules) => {
      let schedule = schedules.get(scheduleId)
      if (!schedule) {
        throw new ReferenceError(
          `Could not find a schedule with an ID of "${scheduleId}".`,
        )
      }
      return schedules.set(scheduleId, updater(schedule))
    })
  }

  addSchedule(schedule: Schedule): this {
    return this.update("schedules", (schedules) =>
      schedules.set(schedule.id, schedule),
    )
  }

  getScheduleForTerm(
    args: Readonly<{
      year: number
      semester: number
    }>,
  ): Schedule | undefined {
    let { year, semester } = args
    return this.schedules.find(
      // oxlint-disable-next-line typescript/no-unnecessary-boolean-literal-compare -- `active` comes from saved data unchecked; only a literal true counts
      (s) => s.active === true && s.year === year && s.semester === semester,
    )
  }

  findSchedulesForTerm(
    args: Readonly<{
      year: number
      semester: number
    }>,
  ): List<Schedule> {
    let { year, semester } = args
    return this.schedules
      .filter((s) => s.year === year && s.semester === semester)
      .toList()
  }

  destroySchedule(scheduleId: string): this {
    let deleted = this.schedules.get(scheduleId)

    if (!deleted) {
      throw new ReferenceError(
        `Could not find a schedule with an ID of ${scheduleId}.`,
      )
    }

    let { active, year, semester } = deleted

    return this.update("schedules", (schedules) => {
      schedules = schedules.delete(scheduleId)

      if (active) {
        let otherSchedKey = schedules.findKey((s) =>
          s.isSpecificTerm(year, semester),
        )

        if (otherSchedKey != null && otherSchedKey !== "") {
          schedules = schedules.update(otherSchedKey, (s) =>
            s ? s.set("active", true) : s,
          )
        }
      }

      return schedules
    })
  }

  destroySchedulesForYear(year: number): this {
    return this.update("schedules", (schedules) =>
      schedules.filterNot((s) => s.year === year),
    )
  }

  destroySchedulesForTerm(
    args: Readonly<{ year: number; semester: number }>,
  ): this {
    let { year, semester } = args

    // oxlint-disable-next-line typescript/no-unnecessary-condition -- guards untyped callers that leave one out; the tests check this warning
    if (year == null || semester == null) {
      console.warn("year and semester must both be provided")
    }

    return this.update("schedules", (schedules) =>
      schedules.filterNot((s) => s.isSpecificTerm(year, semester)),
    )
  }

  moveSchedule(
    scheduleId: string,
    { year, semester }: Readonly<{ year: number; semester: number }>,
  ): this {
    return this.updateSchedule(scheduleId, (s) => s.merge({ year, semester }))
  }

  reorderSchedule(scheduleId: string, index: number): this {
    return this.updateSchedule(scheduleId, (s) => s.set("index", index))
  }

  renameSchedule(scheduleId: string, title: string): this {
    return this.updateSchedule(scheduleId, (s) => s.set("title", title))
  }

  /////
  /// Courses, within schedules
  /////

  addCourseToSchedule(scheduleId: string, clbid: string): this {
    let hasClbid = this.hasCourseInSchedule(scheduleId, clbid)

    if (hasClbid) {
      return this
    }

    return this.updateSchedule(scheduleId, (s) =>
      s.update("clbids", (ids) => ids.push(clbid)),
    )
  }

  removeCourseFromSchedule(scheduleId: string, clbid: string): this {
    let hasClbid = this.hasCourseInSchedule(scheduleId, clbid)

    if (!hasClbid) {
      return this
    }

    return this.updateSchedule(scheduleId, (s) =>
      s.update("clbids", (ids) => ids.filterNot((id) => id === clbid)),
    )
  }

  hasCourseInSchedule(scheduleId: string, clbid: string): boolean {
    let schedule = this.schedules.get(scheduleId)
    if (!schedule) {
      return false
    }
    return schedule.clbids.some((id) => id === clbid)
  }

  moveCourseToSchedule(
    args: Readonly<{
      from: string
      to: string
      clbid: string
    }>,
  ): this {
    let { from, to, clbid } = args

    return this.removeCourseFromSchedule(from, clbid).addCourseToSchedule(
      to,
      clbid,
    )
  }

  reorderCourseInSchedule(
    scheduleId: string,
    { clbid, index }: Readonly<{ clbid: string; index: number }>,
  ): this {
    return this.updateSchedule(scheduleId, (s) =>
      s.update("clbids", (ids) => {
        if (!ids.includes(clbid)) {
          throw new ReferenceError(
            `${clbid} is not in schedule "${scheduleId}"`,
          )
        }

        let newIndex = Math.min(Math.max(0, index), ids.size)

        const oldIndex = ids.indexOf(clbid)
        return ids.delete(oldIndex).insert(newIndex, clbid)
      }),
    )
  }

  /////
  /// Areas of Study
  /////

  addArea(area: AreaQuery): this {
    return this.update("studies", (studies) => studies.push(area))
  }

  removeArea(area: AreaQuery): this {
    let index = this.findAreaIndex(area)
    if (index === -1) {
      return this
    }
    return this.update("studies", (studies) => studies.delete(index))
  }

  findAreaIndex({ name, type, revision }: AreaQuery): number {
    return this.studies.findIndex(
      (a) => a.name === name && a.type === type && a.revision === revision,
    )
  }

  hasArea({ name, type, revision }: AreaQuery): boolean {
    return (
      this.studies.find(
        (a) => a.name === name && a.type === type && a.revision === revision,
      ) !== undefined
    )
  }

  /////
  /// Overrides
  /////

  hasOverride(key: string): boolean {
    return this.overrides.has(key)
  }

  setOverride(key: string, value: OverrideType): this {
    return this.update("overrides", (overrides) => overrides.set(key, value))
  }

  removeOverride(key: string): this {
    return this.update("overrides", (overrides) => overrides.delete(key))
  }

  /////
  /// Fabrications
  /////

  addFabrication(fabrication: CourseType): this {
    return this.update("fabrications", (list) => list.push(fabrication))
  }

  getFabrication(fabricationId: string): CourseType | undefined {
    return this.fabrications.find(({ clbid }) => clbid === fabricationId)
  }

  removeFabrication(fabricationId: string): this {
    return this.update("fabrications", (list) =>
      list.filterNot(({ clbid }) => clbid === fabricationId),
    )
  }

  /////
  /// Helpers
  /////

  activeCourses(getCourse: CourseLookupFunc): Promise<Array<CourseType>> {
    return getActiveCourses(this, getCourse)
  }

  urlEncode(): string {
    return encodeStudent(this)
  }

  dataUrlEncode(): string {
    return `data:text/json;charset=utf-8,${this.urlEncode()}`
  }
}
