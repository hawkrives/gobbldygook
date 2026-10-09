/* oxlint-disable typescript/prefer-readonly-parameter-types -- these helpers build expressions for computeOf, which writes its results onto them */
import computeChunk, { computeOf } from "../compute-chunk"
import type {
  Course,
  CourseExpression,
  Expression,
  OfExpression,
  Qualification,
  QualificationValue,
  Requirement,
} from "../types"

const csci = (number: number): Course => ({ department: ["CSCI"], number })
const course = (department: string, number: number): CourseExpression => ({
  $type: "course",
  $course: { department: [department], number },
})
const of = (num: number, items: Expression[]): OfExpression => ({
  $type: "of",
  $count: { $operator: "$gte", $num: num },
  $of: items,
})
const qualification = (
  key: string,
  value: QualificationValue,
): Qualification => ({
  $type: "qualification",
  $key: key,
  $operator: "$eq",
  $value: value,
})
const clone = <T>(expr: T): T => JSON.parse(JSON.stringify(expr)) as T

function run(expr: OfExpression, courses: Course[]) {
  const { computedResult, counted } = computeOf({
    expr,
    ctx: { $type: "requirement", result: expr },
    courses,
    dirty: new Set<string>(),
    isNeeded: true,
  })
  return { computedResult, counted }
}

describe("computeOf", () => {
  it("computes a list of boolean-equivalent expressions against a desired count", () => {
    const expr: OfExpression = {
      $type: "of",
      $count: { $operator: "$gte", $num: 2 },
      $of: [
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 121 },
        },
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 125 },
        },
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 150 },
        },
      ],
    }
    const req: Requirement = {
      $type: "requirement",
      result: expr,
    }

    const dirty = new Set<string>()
    const courses: Course[] = [
      { department: ["CSCI"], number: 121 },
      { department: ["CSCI"], number: 125 },
    ]

    const { computedResult, matches, counted } = computeOf({
      expr,
      ctx: req,
      courses,
      dirty,
      isNeeded: true,
    })

    expect(computedResult).toBe(true)
    expect(matches).toEqual([
      { department: ["CSCI"], number: 121 },
      { department: ["CSCI"], number: 125 },
    ])
    expect(counted).toBe(2)

    expect(expr).toEqual({
      $type: "of",
      $count: { $operator: "$gte", $num: 2 },
      $of: [
        {
          _checked: true,
          _taken: true,
          _result: true,
          $type: "course",
          _request: { department: ["CSCI"], number: 121 },
          $course: { department: ["CSCI"], number: 121 },
        },
        {
          _checked: true,
          _taken: true,
          _result: true,
          $type: "course",
          _request: { department: ["CSCI"], number: 125 },
          $course: { department: ["CSCI"], number: 125 },
        },
        {
          _result: false,
          _checked: true,
          $type: "course",
          $course: { department: ["CSCI"], number: 150 },
        },
      ],
    })
  })

  it("stores the number of matches in its containing expression", () => {
    const expr = of(2, [course("CSCI", 121), course("CSCI", 125)])
    const req: Requirement = { $type: "requirement", result: expr }

    const result = computeChunk({
      expr,
      ctx: req,
      courses: [csci(121), csci(125)],
      dirty: new Set<string>(),
    })

    expect(result).toBe(true)
    expect(expr._result).toBe(true)
    expect(expr._counted).toBe(2)
    expect(expr._matches).toEqual([csci(121), csci(125)])
  })

  it("handles counting boolean expressions", () => {
    const expr = of(2, [
      {
        $type: "boolean",
        $booleanType: "and",
        $and: [course("CSCI", 121), course("CSCI", 125)],
      },
      {
        $type: "boolean",
        $booleanType: "or",
        $or: [course("CSCI", 150), course("CSCI", 251)],
      },
    ])

    expect(run(expr, [csci(121), csci(125), csci(251)])).toEqual({
      computedResult: true,
      counted: 2,
    })
    expect(run(clone(expr), [csci(121), csci(251)])).toEqual({
      computedResult: false,
      counted: 1,
    })
  })

  it("handles counting course expressions", () => {
    const expr = of(2, [
      course("CSCI", 121),
      course("CSCI", 125),
      course("CSCI", 150),
    ])

    expect(run(expr, [csci(125)])).toEqual({
      computedResult: false,
      counted: 1,
    })
  })

  it("handles counting modifier expressions", () => {
    const expr = of(1, [
      {
        $type: "modifier",
        $what: "course",
        $from: "where",
        $count: { $operator: "$gte", $num: 2 },
        $where: qualification("gereqs", "WRI"),
      },
    ])

    const courses: Course[] = [
      { ...csci(121), gereqs: ["WRI"] },
      { ...csci(125), gereqs: ["WRI"] },
    ]

    expect(run(expr, courses)).toEqual({ computedResult: true, counted: 1 })
    expect(run(clone(expr), courses.slice(0, 1))).toEqual({
      computedResult: false,
      counted: 0,
    })
  })

  it("handles counting occurrence expressions", () => {
    const expr = of(1, [
      {
        $type: "occurrence",
        $count: { $operator: "$gte", $num: 2 },
        $course: { department: ["THEAT"], number: 222 },
      },
    ])

    const theat = { department: ["THEAT"], number: 222 }

    expect(run(expr, [theat, theat])).toEqual({
      computedResult: true,
      counted: 1,
    })
    expect(run(clone(expr), [theat])).toEqual({
      computedResult: false,
      counted: 0,
    })
  })

  it("handles counting nested of-expressions", () => {
    const expr = of(2, [
      of(1, [course("CSCI", 121), course("CSCI", 125)]),
      of(2, [course("CSCI", 150), course("CSCI", 251)]),
      of(1, [course("CSCI", 273)]),
    ])

    expect(run(expr, [csci(125), csci(150), csci(273)])).toEqual({
      computedResult: true,
      counted: 2,
    })
    expect(run(clone(expr), [csci(125), csci(150)])).toEqual({
      computedResult: false,
      counted: 1,
    })
  })

  it("handles counting requirement references", () => {
    const expr = of(2, [
      { $type: "reference", $requirement: "A" },
      { $type: "reference", $requirement: "B" },
      { $type: "reference", $requirement: "C" },
    ])
    const ctx: Requirement = {
      $type: "requirement",
      result: expr,
      A: { computed: true },
      B: { computed: false },
      C: { computed: true },
    }

    const { computedResult, counted } = computeOf({
      expr,
      ctx,
      courses: [],
      dirty: new Set<string>(),
      isNeeded: true,
    })

    expect(computedResult).toBe(true)
    expect(counted).toBe(2)
  })

  it("handles counting where-expressions", () => {
    const expr = of(1, [
      {
        $type: "where",
        $count: { $operator: "$gte", $num: 2 },
        $where: qualification("gereqs", "SPM"),
        $distinct: false,
      },
      {
        $type: "where",
        $count: { $operator: "$gte", $num: 1 },
        $where: qualification("gereqs", "WRI"),
        $distinct: false,
      },
    ])

    const courses: Course[] = [
      { ...csci(121), gereqs: ["SPM"] },
      { ...csci(125), gereqs: ["WRI"] },
    ]

    expect(run(expr, courses)).toEqual({ computedResult: true, counted: 1 })
    expect(run(clone(expr), courses.slice(0, 1))).toEqual({
      computedResult: false,
      counted: 0,
    })
  })
})
