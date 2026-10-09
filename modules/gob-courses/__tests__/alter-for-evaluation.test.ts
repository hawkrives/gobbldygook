import type { Course } from "@gob/types"
import { alterForEvaluation } from "../alter-for-evaluation.ts"

const course: Course = {
  type: "Research",
  clbid: "0000000001",
  credits: 1,
  crsid: "0000000002",
  description: ["A course about computers."],
  department: "CSCI",
  enrolled: 20,
  gereqs: ["AQR"],
  groupid: "0000000003",
  instructors: ["Someone"],
  level: 100,
  max: 30,
  name: "Principles of Computer Science",
  notes: "Open to first-years.",
  number: 121,
  pf: false,
  prerequisites: false,
  section: "A",
  status: "O",
  semester: 1,
  year: 2020,
  revisions: [],
}

describe("alterForEvaluation", () => {
  it("keeps only the fields that examine-student reads", () => {
    expect(alterForEvaluation(course)).toEqual({
      type: "Research",
      clbid: "0000000001",
      credits: 1,
      crsid: "0000000002",
      department: "CSCI",
      gereqs: ["AQR"],
      groupid: "0000000003",
      level: 100,
      name: "Principles of Computer Science",
      number: 121,
      pf: false,
      semester: 1,
      year: 2020,
    })
  })

  it("does not change the course it is given", () => {
    const before = { ...course }
    alterForEvaluation(course)
    expect(course).toEqual(before)
  })
})
