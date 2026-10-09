import { filterByQualification } from "../filter-by-where-clause.ts"
import type { Course, Qualification } from "../types.ts"

describe("filterByQualification", () => {
  it("filters an array of courses by a qualification", () => {
    const basicQualification: Qualification = {
      $type: "qualification",
      $key: "gereqs",
      $value: "EIN",
      $operator: "$eq",
    }

    const courses: Course[] = [
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["ASIAN"], number: 275, year: 2016 },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ]

    expect(filterByQualification(courses, basicQualification)).toEqual([
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
    ])
  })

  it("filters an array of courses by a boolean qualification-value", () => {
    const basicQualification: Qualification = {
      $type: "qualification",
      $key: "gereqs",
      $value: {
        $type: "boolean",
        $booleanType: "or",
        $or: ["EIN", "BTS-T"],
      },
      $operator: "$eq",
    }

    const courses: Course[] = [
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["ASIAN"], number: 275, year: 2016 },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ]

    expect(filterByQualification(courses, basicQualification)).toEqual([
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ])
  })

  it("requires that a boolean qualification-value be either $and or $or", () => {
    const basicQualification: Qualification = {
      $type: "qualification",
      $key: "gereqs",
      $value: {
        $type: "boolean",
        // @ts-expect-error: checks the runtime guard against other types
        $booleanType: "xor",
        $xor: ["EIN", "BTS-T"],
      },
      $operator: "$eq",
    }

    const courses: Course[] = [
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["ASIAN"], number: 275, year: 2016 },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ]

    expect(() => filterByQualification(courses, basicQualification)).toThrow(
      TypeError,
    )
  })

  it("filters an array based on a nested where-query with the max function", () => {
    const advancedQualificationMax: Qualification = {
      $type: "qualification",
      $key: "year",
      $operator: "$lte",
      $value: {
        $name: "max",
        $prop: "year",
        $type: "function",
        $where: {
          $type: "qualification",
          $key: "gereqs",
          $operator: "$eq",
          $value: "BTS-T",
        },
      },
    }

    const courses: Course[] = [
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["ASIAN"], number: 275, year: 2016 },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ]

    expect(filterByQualification(courses, advancedQualificationMax)).toEqual([
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ])
  })

  it("filters an array based on a nested where-query with the min function", () => {
    const advancedQualificationMin: Qualification = {
      $type: "qualification",
      $key: "year",
      $operator: "$lte",
      $value: {
        $name: "min",
        $prop: "year",
        $type: "function",
        $where: {
          $type: "qualification",
          $key: "gereqs",
          $operator: "$eq",
          $value: "BTS-T",
        },
      },
    }

    const courses: Course[] = [
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["ASIAN"], number: 275, year: 2016 },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ]

    expect(filterByQualification(courses, advancedQualificationMin)).toEqual([
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
    ])
  })

  it("must use either min or max as a function for a nested where-query", () => {
    const advancedQualificationBad: Qualification = {
      $type: "qualification",
      $key: "year",
      $operator: "$lte",
      $value: {
        $name: "not-max-nor-min",
        $prop: "year",
        $type: "function",
        $where: {
          $type: "qualification",
          $key: "gereqs",
          $operator: "$eq",
          $value: "BTS-T",
        },
      },
    }

    const courses: Course[] = [
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["ASIAN"], number: 275, year: 2016 },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ]

    expect(() =>
      filterByQualification(courses, advancedQualificationBad),
    ).toThrow(ReferenceError)
  })

  it("must specify a function when utilizing a nested where-query", () => {
    const advancedQualificationBad: Qualification = {
      $type: "qualification",
      $key: "year",
      $operator: "$lte",
      $value: {
        $name: "max",
        $prop: "year",
        // @ts-expect-error: checks the runtime guard against a missing type
        $type: "",
        $where: {
          $type: "qualification",
          $key: "gereqs",
          $operator: "$eq",
          $value: "BTS-T",
        },
      },
    }

    const courses: Course[] = [
      {
        department: ["ART", "ASIAN"],
        number: 310,
        lab: true,
        year: 2012,
      },
      { department: ["ASIAN"], number: 275, year: 2016 },
      { department: ["CSCI"], number: 375, gereqs: ["EIN"], year: 2013 },
      {
        department: ["REL"],
        number: 111,
        section: "C",
        gereqs: ["BTS-T"],
        year: 2012,
      },
      { department: ["REL"], number: 115, gereqs: ["BTS-T"], year: 2013 },
    ]

    expect(() =>
      filterByQualification(courses, advancedQualificationBad),
    ).toThrow(TypeError)
  })

  it("can require that the courses be distinct", () => {
    const clause: Qualification = {
      $type: "qualification",
      $key: "gereqs",
      $operator: "$eq",
      $value: "SPM",
    }

    const courses: Course[] = [
      { department: ["ESTH"], number: 182, year: 2012, gereqs: ["SPM"] },
      { department: ["ESTH"], number: 182, year: 2013, gereqs: ["SPM"] },
    ]

    const expected = [courses[0]]
    const actual = filterByQualification(courses, clause, {
      distinct: true,
    })

    expect(actual).toEqual(expected)
  })

  it('does not count things that don\'t count when matching "distinct"', () => {
    const clause: Qualification = {
      $type: "qualification",
      $key: "gereqs",
      $operator: "$eq",
      $value: "SPM",
    }

    const courses: Course[] = [
      { department: ["ESTH"], number: 182, year: 2012, gereqs: ["FYW"] },
      { department: ["ESTH"], number: 182, year: 2013, gereqs: ["SPM"] },
    ]

    const expected = [courses[1]]
    const actual = filterByQualification(courses, clause, {
      distinct: true,
    })

    expect(actual).toEqual(expected)
  })
})
