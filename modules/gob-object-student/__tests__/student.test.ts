import demoStudent from "../demo-student.json" with { type: "json" }
import stringify from "stabilize"
import { List, OrderedMap } from "immutable"

import { Student } from "../student.ts"
import { Schedule } from "../schedule.ts"
import type { CourseType } from "../types.ts"

// Reads a schedule the test expects to exist
function getSchedule(student: Student, id: string): Schedule {
  let schedule = student.schedules.get(id)
  if (!schedule) {
    throw new Error(`expected a schedule with an ID of "${id}"`)
  }
  return schedule
}

const fabrication = (clbid: string): CourseType => ({
  type: "Research",
  clbid,
  credits: 1,
  crsid: clbid,
  description: [],
  department: "CSCI",
  enrolled: 0,
  gereqs: [],
  groupid: clbid,
  instructors: [],
  level: 100,
  max: 0,
  name: "Independent Study",
  number: 298,
  pf: false,
  prerequisites: false,
  section: "A",
  status: "O",
  semester: 1,
  year: 2020,
  revisions: [],
})

describe("Student", () => {
  it("creates a unique ID for each new student without an ID prop", () => {
    let stu1 = new Student()
    let stu2 = new Student()
    expect(stu1.id).not.toBe(stu2.id)
  })

  it("holds a student", () => {
    let stu = new Student(demoStudent)

    let plain = stu.toJS()

    expect(plain).toBeDefined()
    expect(plain.id).toBeDefined()
    expect(plain.matriculation).toBe(2012)
    expect(plain.graduation).toBe(2016)
    // expect(plain.creditsNeeded).toBe(35)
    expect(plain.studies).toEqual(demoStudent.studies)
    expect(plain.schedules).toEqual(demoStudent.schedules)
    expect(plain.fabrications).toEqual(demoStudent.fabrications)
    expect(plain.settings).toEqual(demoStudent.settings)
    expect(plain.overrides).toEqual(demoStudent.overrides)
  })

  it("turns into JSON", () => {
    let stu = new Student()
    let result = stringify(stu)
    expect(result).toBeTruthy()
  })

  it("turns an array of schedules into an object", () => {
    let id = "123"
    let input = {
      schedules: [{ id: id }],
    }

    let student = new Student(input)

    expect(OrderedMap.isOrderedMap(student.schedules)).toBe(true)
  })

  it("migrates an array of schedules into an object", () => {
    let schedules = OrderedMap({
      "1": new Schedule({ id: "1" }),
      "2": new Schedule({ id: "2" }),
    })
    let stu = new Student({ schedules })
    expect(stu.schedules.get("2")).toBeDefined()
    expect(stu.schedules.get("2")).toEqual(schedules.get("2"))
  })

  it("copies from one Student to another", () => {
    let initial = new Student(demoStudent)
    let copy = new Student(initial)

    expect(copy.id).toBe(initial.id)
    expect(copy.name).toBe(initial.name)
    expect(copy.matriculation).toBe(initial.matriculation)
    expect(copy.version).toBe(initial.version)
    expect(copy.graduation).toBe(initial.graduation)
    expect(copy.advisor).toBe(initial.advisor)
    expect(copy.dateLastModified).toBe(initial.dateLastModified)
    expect(copy.dateCreated).toBe(initial.dateCreated)
    expect(copy.studies).toBe(initial.studies)
    expect(copy.schedules).toBe(initial.schedules)
    expect(copy.fabrications).toBe(initial.fabrications)
    expect(copy.fulfillments).toBe(initial.fulfillments)
    expect(copy.settings).toBe(initial.settings)
    expect(copy.overrides).toBe(initial.overrides)
  })
})

describe("addFabricationToStudent", () => {
  it("adds fabrications", () => {
    let stu = new Student()
    let addedFabrication = stu.addFabrication(fabrication("123"))
    expect(addedFabrication.getFabrication("123")).toEqual(fabrication("123"))
  })
})

describe("removeFabricationFromStudent", () => {
  it("removes fabrications", () => {
    let stu = new Student()
    stu = stu.addFabrication(fabrication("123"))
    stu = stu.removeFabrication("123")
    expect(stu.getFabrication("123")).not.toBeDefined()
  })
})

describe("setOverrideOnStudent", () => {
  it("adds overrides", () => {
    let stu = new Student()
    let addedOverride = stu.setOverride("nothing", "me!")
    expect(addedOverride.overrides.get("nothing")).toBe("me!")
  })

  it("sets overrides to falsy values if asked", () => {
    let stu = new Student()
    let addedOverride = stu.setOverride("nothing", false)
    expect(addedOverride.overrides.get("nothing")).toBe(false)
  })
})

describe("removeOverrideFromStudent", () => {
  it("removes overrides", () => {
    let stu = new Student()
    let removedOverride = stu.removeOverride("credits.taken")
    expect(removedOverride.overrides.get("credits.taken")).not.toBeDefined()
  })
})

describe("addAreaToStudent", () => {
  it("adds areas", () => {
    let stu = new Student()
    let query = {
      name: "Exercise Science",
      type: "major",
      revision: "2014-15",
    }
    let newArea = stu.addArea(query)
    expect(newArea.hasArea(query)).toBe(true)
  })
})

describe("hasArea", () => {
  it("returns true if an area exists", () => {
    let stu = new Student()
    let query = {
      name: "Exercise Science",
      type: "major",
      revision: "2014-15",
    }
    let newArea = stu.addArea(query)
    expect(newArea.hasArea(query)).toBe(true)
  })

  it("returns false if an area does not exist", () => {
    let stu = new Student()
    let query = {
      name: "Exercise Science",
      type: "major",
      revision: "2014-15",
    }
    let newArea = stu.addArea(query)
    let failedQuery = { ...query, revision: "2015-16" }
    expect(newArea.hasArea(failedQuery)).toBe(false)
  })
})

describe("removeAreaFromStudent", () => {
  it("removes areas", () => {
    let stu = new Student()
    let query = {
      type: "major",
      name: "Computer Science",
      revision: "latest",
    }
    stu = stu.addArea(query)
    let noCsci = stu.removeArea(query)
    expect(stu.hasArea(query)).toBe(true)
    expect(noCsci.hasArea(query)).toBe(false)
  })
})

describe("moveCourseToSchedule", () => {
  it("moves courses between schedules in one-ish operation", () => {
    let stu = new Student({
      schedules: OrderedMap([
        ["1", new Schedule({ clbids: List.of("a-course") })],
        ["2", new Schedule({ clbids: List() })],
      ]),
    })

    let movedCourse = stu.moveCourseToSchedule({
      from: "1",
      to: "2",
      clbid: "a-course",
    })

    let sched1 = getSchedule(movedCourse, "1")

    let sched2 = getSchedule(movedCourse, "2")

    expect(sched1.clbids).not.toContain("a-course")
    expect(sched2.clbids).toContain("a-course")
  })
})

describe("addScheduleToStudent", () => {
  it("adds schedules", () => {
    let stu = new Student()
    let newSchedule = stu.addSchedule(
      new Schedule({
        id: "10912",
        title: "a",
        active: false,
        clbids: List(),
        index: 1,
        semester: 0,
        year: 0,
      }),
    )

    let sched = getSchedule(newSchedule, "10912")

    expect(sched).toMatchInlineSnapshot(`
Immutable.Record {
  "id": "10912",
  "active": false,
  "index": 1,
  "title": "a",
  "clbids": Immutable.List [],
  "year": 0,
  "semester": 0,
}
`)
  })
})

describe("destroyScheduleFromStudent", () => {
  it("removes schedules", () => {
    let sched = new Schedule()
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let removedSchedule = initial.destroySchedule(sched.id)
    expect(removedSchedule.schedules.get(sched.id)).not.toBeDefined()
  })

  it("makes another schedule active if there is another schedule available for the same term", () => {
    let sched1 = new Schedule({
      year: 2012,
      semester: 1,
      index: 1,
      active: true,
    })
    let sched2 = new Schedule({ year: 2012, semester: 1, index: 2 })

    let stu = new Student()
    stu = stu.addSchedule(sched1)
    stu = stu.addSchedule(sched2)

    let removedSchedule = stu.destroySchedule(sched1.id)

    let extracted = getSchedule(removedSchedule, sched2.id)

    expect(extracted).toBeDefined()
    expect(extracted.active).toBe(true)
  })

  it(`throws if it cannot find the requested schedule id`, () => {
    let stu = new Student({ schedules: OrderedMap() })
    let shouldThrowBecauseNotAdded = () => stu.destroySchedule("unknown")
    expect(shouldThrowBecauseNotAdded).toThrow(ReferenceError)
  })
})

describe("destroySchedulesForYear", () => {
  it("removes schedules", () => {
    let sched1 = new Schedule({ year: 2014, semester: 1 })
    let sched2 = new Schedule({ year: 2014, semester: 2 })
    let initial = new Student({
      schedules: OrderedMap({ [sched1.id]: sched1, [sched2.id]: sched2 }),
    })

    let removedSchedule = initial.destroySchedulesForYear(2014)
    expect(removedSchedule.schedules.size).toBe(0)
  })
})

describe("destroySchedulesForTerm", () => {
  it("removes schedules", () => {
    let sched1 = new Schedule({ year: 2014, semester: 1 })
    let sched2 = new Schedule({ year: 2014, semester: 2 })
    let initial = new Student({
      schedules: OrderedMap({ [sched1.id]: sched1, [sched2.id]: sched2 }),
    })

    let actual = initial.destroySchedulesForTerm({ year: 2014, semester: 1 })

    expect(actual.schedules.get(sched1.id)).not.toBeDefined()
    expect(actual.schedules.get(sched2.id)).toBeDefined()
  })

  it('requires both the "year" and "semester" arguments', () => {
    let sched1 = new Schedule({ year: 2014, semester: 1 })
    let sched2 = new Schedule({ year: 2014, semester: 2 })
    let initial = new Student({
      schedules: OrderedMap({ [sched1.id]: sched1, [sched2.id]: sched2 }),
    })

    // @ts-expect-error: checks the warning when the semester is missing
    let onlyYear = initial.destroySchedulesForTerm({ year: 2014 })

    expect(onlyYear.schedules.get(sched1.id)).toBeDefined()
    expect(onlyYear.schedules.get(sched2.id)).toBeDefined()

    // @ts-expect-error: checks the warning when the year is missing
    let onlySemester = initial.destroySchedulesForTerm({ semester: 1 })

    expect(onlySemester.schedules.get(sched1.id)).toBeDefined()
    expect(onlySemester.schedules.get(sched2.id)).toBeDefined()
  })
})

describe("changeStudentName", () => {
  it(`changes the student's name`, () => {
    let initial = new Student()
    let actual = initial.setName("my name")
    expect(actual.name).toBeDefined()
    expect(actual.name).toBe("my name")
  })

  it("returns a new object", () => {
    let initial = new Student()
    let final = initial.setName("")
    expect(final).not.toBe(initial)
  })
})

describe("changeStudentAdvisor", () => {
  it(`changes the student's advisor`, () => {
    let initial = new Student()
    let actual = initial.setAdvisor("professor name")
    expect(actual.advisor).toBeDefined()
    expect(actual.advisor).toBe("professor name")
  })

  it("returns a new object", () => {
    let initial = new Student()
    let final = initial.setAdvisor("new name")
    expect(final).not.toBe(initial)
  })

  it("unless the value hasn't changed", () => {
    let initial = new Student({ advisor: "" })
    let final = initial.setAdvisor("")
    expect(final).toBe(initial)
  })
})

describe("changeStudentCreditsNeeded", () => {
  it(`changes the student's number of credits needed`, () => {
    let initial = new Student()
    let actual = initial.setCreditsNeeded(130)
    expect(actual.creditsNeeded).toBeDefined()
    expect(actual.creditsNeeded).toBe(130)
  })

  it("parses string values", () => {
    let initial = new Student()
    let actual = initial.setCreditsNeeded("33")
    expect(actual.creditsNeeded).toBe(33)
  })

  it("returns a new object", () => {
    let initial = new Student()
    let final = initial.setCreditsNeeded(0)
    expect(final).not.toBe(initial)
  })
})

describe("changeStudentMatriculation", () => {
  it(`changes the student's matriculation year`, () => {
    let initial = new Student()
    let actual = initial.setMatriculation(1800)
    expect(actual.matriculation).toBeDefined()
    expect(actual.matriculation).toBe(1800)
  })

  it("returns a new object", () => {
    let initial = new Student()
    let final = initial.setMatriculation(0)
    expect(final).not.toBe(initial)
  })
})

describe("changeStudentGraduation", () => {
  it(`changes the student's graduation year`, () => {
    let initial = new Student()
    let actual = initial.setGraduation(2100)
    expect(actual.graduation).toBe(2100)
  })

  it("returns a new object", () => {
    let initial = new Student()
    let final = initial.setGraduation(0)
    expect(final).not.toBe(initial)
  })
})

describe("changeStudentSetting", () => {
  it(`changes settings in the student `, () => {
    let initial = new Student()
    let actual = initial.setSetting("key", "value")
    expect(actual.settings).toBeDefined()
    expect(actual.settings).toEqual(OrderedMap({ key: "value" }))
  })

  it("returns a new object", () => {
    let initial = new Student()
    let final = initial.setSetting("key", "value2")
    expect(final).not.toBe(initial)
  })
})

describe("moveScheduleInStudent", () => {
  it("moves both a year and a semester", () => {
    let sched = new Schedule({ year: 2012, semester: 1 })
    let stu = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = stu.moveSchedule(sched.id, {
      year: 2014,
      semester: 3,
    })

    let plucked = getSchedule(actual, sched.id)

    expect(plucked.year).toBe(2014)
    expect(plucked.semester).toBe(3)
  })

  it("returns a new object", () => {
    let sched = new Schedule({ year: 2012 })
    let stu = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })

    let actual = stu.moveSchedule(sched.id, { year: 2014, semester: 2 })

    let plucked = getSchedule(actual, sched.id)

    expect(plucked).not.toBe(sched)
  })
})

describe("reorderScheduleInStudent", () => {
  it('changes the "index" property', () => {
    let sched = new Schedule({ index: 0 })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.reorderSchedule(sched.id, 5)

    let plucked = getSchedule(actual, sched.id)

    expect(plucked.index).toBe(5)
  })

  it("returns a new object", () => {
    let sched = new Schedule({ index: 0 })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.reorderSchedule(sched.id, 5)

    let plucked = getSchedule(actual, sched.id)

    expect(actual).not.toBe(initial)
    expect(plucked).not.toBe(sched)
  })
})

describe("renameScheduleInStudent", () => {
  it("renames the schedule", () => {
    let sched = new Schedule({ title: "Initial Title" })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.renameSchedule(sched.id, "My New Title")

    let plucked = getSchedule(actual, sched.id)

    expect(plucked.title).toBe("My New Title")
  })

  it("returns a new object", () => {
    let sched = new Schedule({ title: "Initial Title" })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.renameSchedule(sched.id, "My New Title")

    let plucked = getSchedule(actual, sched.id)

    expect(actual).not.toBe(initial)
    expect(plucked).not.toBe(sched)
  })
})

describe("addCourseToSchedule", () => {
  it("adds a course", () => {
    let sched = new Schedule({ clbids: List(["123"]) })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let addedCourse = initial.addCourseToSchedule(sched.id, "918")

    let plucked = getSchedule(addedCourse, sched.id)

    expect(plucked.clbids).toContain("918")
  })

  it("returns a new object", () => {
    let sched = new Schedule({ clbids: List(["123123"]) })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.addCourseToSchedule(sched.id, "a-new-course")

    let plucked = getSchedule(actual, sched.id)
    let initialPlucked = getSchedule(initial, sched.id)

    expect(actual).not.toBe(initial)
    expect(plucked).not.toBe(initialPlucked)
    expect(plucked).not.toBe(sched)
  })

  it("returns the same student if the clbid already exists in the schedule", () => {
    let sched = new Schedule({ clbids: List(["123"]) })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    expect(initial.addCourseToSchedule(sched.id, "123")).toBe(initial)
  })
})

describe("removeCourseFromSchedule", () => {
  it("removes a course", () => {
    let sched = new Schedule({ clbids: List(["123"]) })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let removedCourse = initial.removeCourseFromSchedule(sched.id, "123")

    let plucked = getSchedule(removedCourse, sched.id)

    expect(plucked.clbids).not.toContain("123")
  })

  it("returns a new object", () => {
    let sched = new Schedule({ clbids: List(["123"]) })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.removeCourseFromSchedule(sched.id, "123")

    let plucked = getSchedule(actual, sched.id)
    let initialPlucked = getSchedule(initial, sched.id)

    expect(actual).not.toBe(initial)
    expect(plucked).not.toBe(initialPlucked)
    expect(plucked).not.toBe(sched)
  })

  it("returns the same student if the clbid does not exist in the schedule", () => {
    let sched = new Schedule({ clbids: List(["123123123"]) })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    expect(initial.removeCourseFromSchedule(sched.id, "something-else")).toBe(
      initial,
    )
  })
})

describe("reorderCourseInSchedule", () => {
  it("rearranges courses", () => {
    let sched = new Schedule({ clbids: List(["123", "456", "789"]) })
    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.reorderCourseInSchedule(sched.id, {
      clbid: "123",
      index: 1,
    })

    let plucked = getSchedule(actual, sched.id)

    expect(plucked.clbids).not.toEqual(List.of("123", "456", "789"))
    expect(plucked.clbids).toEqual(List.of("456", "123", "789"))
  })

  it("returns a new object", () => {
    let sched = new Schedule({ clbids: List(["123", "456", "789"]) })

    let initial = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let actual = initial.reorderCourseInSchedule(sched.id, {
      clbid: "123",
      index: 1,
    })

    expect(actual).not.toBe(initial)

    let plucked = getSchedule(actual, sched.id)
    let initialPlucked = getSchedule(initial, sched.id)

    expect(plucked).not.toBe(initialPlucked)
    expect(plucked).not.toBe(sched)
  })

  it("requires that the clbid to be moved actually appear in the list of clbids", () => {
    let sched = new Schedule({ clbids: List(["123", "456", "789"]) })
    let stu = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    expect(() =>
      stu.reorderCourseInSchedule(sched.id, {
        clbid: "123456789",
        index: 0,
      }),
    ).toThrow(ReferenceError)
  })

  it("truncates the requested index if it is greater than the number of courses", () => {
    let sched = new Schedule({ clbids: List(["123456789", "123"]) })
    let stu = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let reordered = stu.reorderCourseInSchedule(sched.id, {
      clbid: "123456789",
      index: 10,
    })

    let plucked = getSchedule(reordered, sched.id)

    expect(plucked.clbids.findIndex((c) => c === "123456789")).toBe(1)
  })

  it("truncates the requested index if it is Infinity", () => {
    let sched = new Schedule({ clbids: List(["123456789", "123"]) })
    let stu = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let reordered = stu.reorderCourseInSchedule(sched.id, {
      clbid: "123456789",
      index: Infinity,
    })

    let plucked = getSchedule(reordered, sched.id)

    expect(plucked.clbids.findIndex((c) => c === "123456789")).toBe(1)
  })

  it("truncates the requested index if it is less than 0", () => {
    let sched = new Schedule({ clbids: List(["123456789", "123"]) })
    let stu = new Student({ schedules: OrderedMap({ [sched.id]: sched }) })
    let reordered = stu.reorderCourseInSchedule(sched.id, {
      clbid: "123",
      index: -10,
    })

    let plucked = getSchedule(reordered, sched.id)

    expect(plucked.clbids.findIndex((c) => c === "123")).toBe(0)
  })
})
