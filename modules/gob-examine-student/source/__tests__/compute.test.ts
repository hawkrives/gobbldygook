import compute from "../compute"
import asRequirement from "../as-requirement"
import pathToOverride from "../path-to-override"
import type { Course, CourseExpression, Requirement } from "../types"

const course = (department: string, number: number): CourseExpression => ({
  $type: "course",
  $course: { department: [department], number },
})

describe("compute", () => {
  it("computes the result of a requirement", () => {
    const req: Requirement = {
      $type: "requirement",
      result: course("CSCI", 121),
    }
    const courses: Course[] = [{ department: ["CSCI"], number: 121 }]

    const actual = compute(req, { path: ["Req"], courses })

    expect(actual.computed).toBe(true)
    expect(actual.result?._result).toBe(true)
  })

  it("is false when the courses are missing", () => {
    const req: Requirement = {
      $type: "requirement",
      result: course("CSCI", 121),
    }

    const actual = compute(req, { path: ["Req"], courses: [] })

    expect(actual.computed).toBe(false)
  })

  it("computes child requirements before the parent's result", () => {
    const req: Requirement = {
      $type: "requirement",
      result: { $type: "reference", $requirement: "Child" },
      Child: { $type: "requirement", result: course("CSCI", 121) },
    }
    const courses: Course[] = [{ department: ["CSCI"], number: 121 }]

    const actual = compute(req, { path: ["Area"], courses })

    expect(asRequirement(actual.Child, "Child").computed).toBe(true)
    expect(actual.computed).toBe(true)
  })

  it("applies a filter before computing the result", () => {
    const req: Requirement = {
      $type: "requirement",
      filter: {
        $type: "filter",
        $distinct: false,
        $filterType: "of",
        $of: [course("CSCI", 125)],
      },
      result: course("CSCI", 121),
    }
    const courses: Course[] = [
      { department: ["CSCI"], number: 121 },
      { department: ["CSCI"], number: 125 },
    ]

    const actual = compute(req, { path: ["Req"], courses })

    expect(actual.filter?._matches).toEqual([
      { department: ["CSCI"], number: 125 },
    ])
    expect(actual.computed).toBe(false)
  })

  it("does not let sibling requirements share courses by default", () => {
    const req: Requirement = {
      $type: "requirement",
      result: {
        $type: "boolean",
        $booleanType: "and",
        $and: [
          { $type: "reference", $requirement: "A" },
          { $type: "reference", $requirement: "B" },
        ],
      },
      A: { $type: "requirement", result: course("CSCI", 121) },
      B: { $type: "requirement", result: course("CSCI", 121) },
    }
    const courses: Course[] = [{ department: ["CSCI"], number: 121 }]

    const actual = compute(req, { path: ["Area"], courses })

    expect(asRequirement(actual.A, "A").computed).toBe(true)
    expect(asRequirement(actual.B, "B").computed).toBe(false)
    expect(actual.computed).toBe(false)
  })

  it('lets sibling requirements share courses with "children share courses"', () => {
    const req: Requirement = {
      $type: "requirement",
      "children share courses": true,
      result: {
        $type: "boolean",
        $booleanType: "and",
        $and: [
          { $type: "reference", $requirement: "A" },
          { $type: "reference", $requirement: "B" },
        ],
      },
      A: { $type: "requirement", result: course("CSCI", 121) },
      B: { $type: "requirement", result: course("CSCI", 121) },
    }
    const courses: Course[] = [{ department: ["CSCI"], number: 121 }]

    const actual = compute(req, { path: ["Area"], courses })

    expect(asRequirement(actual.A, "A").computed).toBe(true)
    expect(asRequirement(actual.B, "B").computed).toBe(true)
    expect(actual.computed).toBe(true)
  })

  it("is false for message-only requirements", () => {
    const req = { message: "Talk to your advisor" }

    const actual = compute(req, { path: ["Req"], courses: [] })

    expect(actual.computed).toBe(false)
  })

  it("uses an override when one exists", () => {
    const req = { message: "Talk to your advisor" }
    const overrides = { [pathToOverride(["Req"])]: true }

    const actual = compute(req, { path: ["Req"], courses: [], overrides })

    expect(actual.overridden).toBe(true)
    expect(actual.computed).toBe(true)
  })

  it("throws if neither result nor message is present", () => {
    expect(() => compute({}, { path: ["Req"], courses: [] })).toThrowError(
      TypeError,
    )
  })

  it("throws if the result is empty", () => {
    expect(() =>
      compute({ result: "" }, { path: ["Req"], courses: [] }),
    ).toThrowError(SyntaxError)
  })
})
