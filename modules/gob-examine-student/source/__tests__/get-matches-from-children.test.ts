import getMatchesFromChildren from "../get-matches-from-children.ts"
import type { ModifierChildrenExpression, Requirement } from "../types.ts"

// The children here are written in an older, flatter shape (course
// expressions without $course), so they are left untyped; only the
// modifier being computed is checked.

describe("getMatchesFromChildren", () => {
  it("extracts matches from a requirement's children", () => {
    const child = {
      $type: "requirement",
      result: {
        $type: "of",
        $count: { $operator: "$gte", $num: 2 },
        $of: [
          {
            $type: "course",
            department: ["CSCI"],
            number: 121,
            _result: true,
          },
          {
            $type: "of",
            $count: { $operator: "$gte", $num: 2 },
            $of: [
              {
                $type: "course",
                department: ["ASIAN"],
                number: 130,
                _result: true,
              },
              {
                $type: "course",
                department: ["ASIAN"],
                number: 275,
                _result: true,
              },
            ],
          },
          {
            $type: "where",
            $count: { $operator: "$gte", $num: 1 },
            $where: {
              $type: "qualification",
              $key: "gereqs",
              $value: { $eq: "EIN", $type: "operator" },
            },
            _matches: [],
          },
          {
            $type: "occurrence",
            $count: { $operator: "$gte", $num: 2 },
            course: {
              $type: "course",
              department: ["THEAT"],
              number: 222,
            },
            _matches: [
              {
                $type: "course",
                department: ["THEAT"],
                number: 222,
                _result: true,
                year: 2014,
              },
              {
                $type: "course",
                department: ["THEAT"],
                number: 222,
                _result: true,
                year: 2015,
              },
            ],
          },
        ],
        _matches: [
          {
            $type: "course",
            department: ["CSCI"],
            number: 121,
            _result: true,
          },
          {
            $type: "course",
            department: ["ASIAN"],
            number: 130,
            _result: true,
          },
          {
            $type: "course",
            department: ["ASIAN"],
            number: 275,
            _result: true,
          },
          {
            $type: "course",
            department: ["THEAT"],
            number: 222,
            _result: true,
            year: 2014,
          },
          {
            $type: "course",
            department: ["THEAT"],
            number: 222,
            _result: true,
            year: 2015,
          },
        ],
      },
    }

    const requirement: Requirement & { result: ModifierChildrenExpression } = {
      $type: "requirement",
      result: {
        $type: "modifier",
        $count: { $operator: "$gte", $num: 2 },
        $what: "course",
        $from: "children",
        $children: "$all",
      },
      Child: child,
    }

    expect(getMatchesFromChildren(requirement.result, requirement)).toEqual(
      child.result._matches,
    )
  })

  it("de-duplicates matched courses", () => {
    const requirement: Requirement & { result: ModifierChildrenExpression } = {
      $type: "requirement",
      result: {
        $type: "modifier",
        $count: { $operator: "$gte", $num: 2 },
        $what: "course",
        $from: "children",
        $children: "$all",
      },
      Child: {
        $type: "requirement",
        result: {
          $type: "of",
          $count: { $operator: "$gte", $num: 2 },
          $of: [
            {
              $type: "course",
              department: ["CSCI"],
              gereqs: ["AQR"],
              number: 121,
              _result: true,
            },
            {
              $type: "of",
              $count: { $operator: "$gte", $num: 2 },
              $of: [
                {
                  $type: "course",
                  department: ["ASIAN"],
                  number: 130,
                  _result: true,
                },
                {
                  $type: "course",
                  department: ["ASIAN"],
                  number: 275,
                  _result: true,
                },
              ],
            },
            {
              $type: "where",
              $count: { $operator: "$gte", $num: 1 },
              $where: {
                $type: "qualification",
                $key: "gereqs",
                $value: { $eq: "AQR", $type: "operator" },
              },
              _matches: [
                {
                  $type: "course",
                  department: ["CSCI"],
                  gereqs: ["AQR"],
                  number: 121,
                  _result: true,
                },
              ],
            },
            {
              $type: "occurrence",
              $count: { $operator: "$gte", $num: 2 },
              course: {
                $type: "course",
                department: ["THEAT"],
                number: 222,
              },
              _matches: [
                {
                  $type: "course",
                  department: ["THEAT"],
                  number: 222,
                  _result: true,
                  year: 2014,
                },
                {
                  $type: "course",
                  department: ["THEAT"],
                  number: 222,
                  _result: true,
                  year: 2015,
                },
              ],
            },
          ],
          _matches: [
            {
              $type: "course",
              department: ["CSCI"],
              gereqs: ["AQR"],
              number: 121,
              _result: true,
            },
            {
              $type: "course",
              department: ["CSCI"],
              gereqs: ["AQR"],
              number: 121,
              _result: true,
            },
            {
              $type: "course",
              department: ["ASIAN"],
              number: 130,
              _result: true,
            },
            {
              $type: "course",
              department: ["ASIAN"],
              number: 275,
              _result: true,
            },
            {
              $type: "course",
              department: ["THEAT"],
              number: 222,
              _result: true,
              year: 2014,
            },
            {
              $type: "course",
              department: ["THEAT"],
              number: 222,
              _result: true,
              year: 2015,
            },
          ],
        },
      },
    }

    expect(getMatchesFromChildren(requirement.result, requirement)).toEqual([
      {
        $type: "course",
        department: ["CSCI"],
        gereqs: ["AQR"],
        number: 121,
        _result: true,
      },
      {
        $type: "course",
        department: ["ASIAN"],
        number: 130,
        _result: true,
      },
      {
        $type: "course",
        department: ["ASIAN"],
        number: 275,
        _result: true,
      },
      {
        $type: "course",
        department: ["THEAT"],
        number: 222,
        _result: true,
        year: 2014,
      },
      {
        $type: "course",
        department: ["THEAT"],
        number: 222,
        _result: true,
        year: 2015,
      },
    ])
  })
})
