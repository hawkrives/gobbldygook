import computeChunk, { computeBoolean } from "../compute-chunk"
import type {
  BooleanExpression,
  Course,
  Expression,
  Requirement,
} from "../types"

describe("computeBoolean", () => {
  it("computes the boolean result of and-clauses", () => {
    const clause: BooleanExpression = {
      $type: "boolean",
      $booleanType: "and",
      $and: [
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 121 },
        },
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 125 },
        },
      ],
    }
    const requirement: Requirement = { $type: "requirement", result: clause }
    const courses: Course[] = [
      { department: ["CSCI"], number: 121 },
      { department: ["CSCI"], number: 125 },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("computes the boolean result of or-clauses", () => {
    const clause: BooleanExpression = {
      $type: "boolean",
      $booleanType: "or",
      $or: [
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 121 },
        },
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 125 },
        },
      ],
    }
    const requirement: Requirement = { $type: "requirement", result: clause }
    const courses: Course[] = [
      { department: ["CSCI"], number: 121 },
      { department: ["CSCI"], number: 125 },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("computes an or-clause even if the first item is false", () => {
    const clause: BooleanExpression = {
      $type: "boolean",
      $booleanType: "or",
      $or: [
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 121 },
        },
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 125 },
        },
      ],
    }
    const requirement: Requirement = { $type: "requirement", result: clause }
    const courses: Course[] = [
      { department: ["CSCI"], number: 151 },
      { department: ["CSCI"], number: 125 },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("can compute the result of several other boolean expressions", () => {
    const clause: BooleanExpression = {
      $type: "boolean",
      $booleanType: "and",
      $and: [
        {
          $type: "boolean",
          $booleanType: "or",
          $or: [
            {
              $type: "course",
              $course: { department: ["CSCI"], number: 121 },
            },
            {
              $type: "course",
              $course: { department: ["CSCI"], number: 125 },
            },
          ],
        },
        {
          $type: "boolean",
          $booleanType: "or",
          $or: [
            {
              $type: "course",
              $course: { department: ["CSCI"], number: 130 },
            },
            {
              $type: "course",
              $course: { department: ["CSCI"], number: 131 },
            },
          ],
        },
      ],
    }
    const requirement: Requirement = { $type: "requirement", result: clause }

    const courses: Course[] = [
      { department: ["CSCI"], number: 130 },
      { department: ["CSCI"], number: 125 },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("can compute the result of several course expressions", () => {
    const clause: BooleanExpression = {
      $or: [
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 121 },
        },
        {
          $type: "course",
          $course: { department: ["CSCI"], number: 125 },
        },
      ],
      $type: "boolean",
      $booleanType: "or",
    }
    const requirement: Requirement = { $type: "requirement", result: clause }

    const courses: Course[] = [
      { department: ["CSCI"], number: 130 },
      { department: ["CSCI"], number: 125 },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("can compute the result of several modifier expressions", () => {
    const clause: BooleanExpression = {
      $and: [
        {
          $children: "$all",
          $count: { $operator: "$gte", $num: 3 },
          $from: "children",
          $type: "modifier",
          $what: "course",
        },
        {
          $children: [
            {
              $requirement: "A",
              $type: "reference",
            },
            {
              $requirement: "C",
              $type: "reference",
            },
          ],
          $count: { $operator: "$gte", $num: 2 },
          $from: "children",
          $type: "modifier",
          $what: "credit",
        },
      ],
      $type: "boolean",
      $booleanType: "and",
    }
    const requirement: Requirement &
      Record<"A" | "C", Requirement & { result: Expression }> = {
      $type: "requirement",
      A: {
        $type: "requirement",
        result: {
          $type: "course",
          $course: { department: ["ART"], number: 120 },
        },
      },
      C: {
        $type: "requirement",
        result: {
          $count: { $operator: "$gte", $num: 2 },
          $of: [
            {
              $type: "course",
              $course: { department: ["ART"], number: 103 },
            },
            {
              $type: "course",
              $course: { department: ["ART"], number: 104 },
            },
            {
              $type: "course",
              $course: { department: ["ART"], number: 105 },
            },
          ],
          $type: "of",
        },
      },
      result: clause,
    }

    const courses: Course[] = [
      { department: ["ART"], number: 120, credits: 1.0 },
      { department: ["ART"], number: 104, credits: 1.0 },
      { department: ["ART"], number: 105, credits: 1.0 },
    ]
    const dirty = new Set<string>()

    requirement.A.computed = computeChunk({
      expr: requirement.A.result,
      ctx: requirement,
      courses,
      dirty,
    })
    requirement.C.computed = computeChunk({
      expr: requirement.C.result,
      ctx: requirement,
      courses,
      dirty,
    })

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty,
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("can compute the result of several occurrence expressions", () => {
    const clause: BooleanExpression = {
      $or: [
        {
          $count: { $operator: "$gte", $num: 1 },
          $course: { department: ["THEAT"], number: 222 },
          $type: "occurrence",
        },
        {
          $count: { $operator: "$gte", $num: 3 },
          $course: { department: ["THEAT"], number: 266 },
          $type: "occurrence",
        },
      ],
      $type: "boolean",
      $booleanType: "or",
    }

    const requirement: Requirement = { $type: "requirement", result: clause }

    const courses: Course[] = [
      { department: ["THEAT"], number: 266, year: 2014, semester: 1 },
      { department: ["THEAT"], number: 266, year: 2014, semester: 3 },
      { department: ["THEAT"], number: 266, year: 2015, semester: 1 },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("can compute the result of several of-expressions", () => {
    const clause: BooleanExpression = {
      $and: [
        {
          $count: { $operator: "$gte", $num: 1 },
          $of: [
            {
              $course: { department: ["CSCI"], number: 121 },
              $type: "course",
            },
            {
              $course: { department: ["CSCI"], number: 125 },
              $type: "course",
            },
          ],
          $type: "of",
        },
        {
          $count: { $operator: "$gte", $num: 1 },
          $of: [
            {
              $course: { department: ["ART"], number: 102 },
              $type: "course",
            },
            {
              $course: { department: ["ART"], number: 103 },
              $type: "course",
            },
          ],
          $type: "of",
        },
      ],
      $type: "boolean",
      $booleanType: "and",
    }

    const requirement: Requirement = { $type: "requirement", result: clause }

    const courses: Course[] = [
      { department: ["CSCI"], number: 125 },
      { department: ["ART"], number: 102 },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("can compute the result of several requirement references", () => {
    const clause: BooleanExpression = {
      $and: [
        { $requirement: "A", $type: "reference" },
        { $requirement: "C", $type: "reference" },
      ],
      $type: "boolean",
      $booleanType: "and",
    }
    const requirement: Requirement &
      Record<"A" | "C", Requirement & { result: Expression }> = {
      $type: "requirement",
      A: {
        $type: "requirement",
        result: {
          $type: "course",
          $course: { department: ["ART"], number: 120 },
        },
      },
      C: {
        $type: "requirement",
        result: {
          $count: { $operator: "$gte", $num: 2 },
          $of: [
            {
              $type: "course",
              $course: { department: ["ART"], number: 103 },
            },
            {
              $type: "course",
              $course: { department: ["ART"], number: 104 },
            },
            {
              $type: "course",
              $course: { department: ["ART"], number: 105 },
            },
          ],
          $type: "of",
        },
      },
      result: clause,
    }

    const courses: Course[] = [
      { department: ["ART"], number: 120 },
      { department: ["ART"], number: 104 },
      { department: ["ART"], number: 105 },
    ]
    const dirty = new Set<string>()

    requirement.A.computed = computeChunk({
      expr: requirement.A.result,
      ctx: requirement,
      courses,
      dirty,
    })
    requirement.C.computed = computeChunk({
      expr: requirement.C.result,
      ctx: requirement,
      courses,
      dirty,
    })

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty,
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("can compute the result of several where-expressions", () => {
    const clause: BooleanExpression = {
      $and: [
        {
          $count: { $operator: "$gte", $num: 1 },
          $type: "where",
          $where: {
            $key: "gereqs",
            $operator: "$eq",
            $type: "qualification",
            $value: "WRI",
          },
          $distinct: false,
        },
        {
          $count: { $operator: "$gte", $num: 1 },
          $type: "where",
          $where: {
            $key: "gereqs",
            $operator: "$eq",
            $type: "qualification",
            $value: "BTS-T",
          },
          $distinct: false,
        },
      ],
      $type: "boolean",
      $booleanType: "and",
    }

    const requirement: Requirement = { $type: "requirement", result: clause }

    const courses: Course[] = [
      { department: ["CSCI"], number: 125, gereqs: ["WRI"] },
      { department: ["ART"], number: 102, gereqs: ["BTS-T"] },
    ]

    const { computedResult, matches } = computeBoolean({
      expr: clause,
      ctx: requirement,
      courses,
      dirty: new Set<string>(),
      isNeeded: true,
    })
    expect(clause).toMatchSnapshot()
    expect(computedResult).toBe(true)
    expect(matches).toMatchSnapshot()
  })

  it("throws when neither $and nor $or were present", () => {
    expect(() =>
      computeBoolean({
        // @ts-expect-error: checks the runtime guard against bad input
        expr: { $neither: [] },
        isNeeded: true,
      }),
    ).toThrowError(TypeError)
  })
})
