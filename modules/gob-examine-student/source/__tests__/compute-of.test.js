import {computeOf} from '../compute-chunk'

describe('computeOf', () => {
	it('computes a list of boolean-equivalent expressions against a desired count', () => {
		const expr = {
			$type: 'of',
			$count: {$operator: '$gte', $num: 2},
			$of: [
				{
					$type: 'course',
					department: ['CSCI'],
					number: 121,
				},
				{
					$type: 'course',
					department: ['CSCI'],
					number: 125,
				},
				{
					$type: 'course',
					department: ['CSCI'],
					number: 150,
				},
			],
		}
		const req = {
			$type: 'requirement',
			result: expr,
		}

		const dirty = new Set()
		const courses = [
			{department: ['CSCI'], number: 121},
			{department: ['CSCI'], number: 125},
		]

		const {computedResult, matches, counted} = computeOf({
			expr,
			ctx: req,
			courses,
			dirty,
			isNeeded: true,
		})

		expect(computedResult).toBe(true)
		expect(matches).toMatchInlineSnapshot(`
Array [
  Object {
    "$type": "course",
    "_checked": true,
    "_request": Object {
      "department": Array [
        "CSCI",
      ],
      "number": 121,
    },
    "_result": true,
    "_taken": true,
    "department": Array [
      "CSCI",
    ],
    "number": 121,
  },
  Object {
    "$type": "course",
    "_checked": true,
    "_request": Object {
      "department": Array [
        "CSCI",
      ],
      "number": 125,
    },
    "_result": true,
    "_taken": true,
    "department": Array [
      "CSCI",
    ],
    "number": 125,
  },
]
`)
		expect(counted).toBe(2)

		expect(expr).toMatchInlineSnapshot(`
Object {
  "$count": Object {
    "$num": 2,
    "$operator": "$gte",
  },
  "$of": Array [
    Object {
      "$type": "course",
      "_checked": true,
      "_request": Object {
        "department": Array [
          "CSCI",
        ],
        "number": 121,
      },
      "_result": true,
      "_taken": true,
      "department": Array [
        "CSCI",
      ],
      "number": 121,
    },
    Object {
      "$type": "course",
      "_checked": true,
      "_request": Object {
        "department": Array [
          "CSCI",
        ],
        "number": 125,
      },
      "_result": true,
      "_taken": true,
      "department": Array [
        "CSCI",
      ],
      "number": 125,
    },
    Object {
      "$type": "course",
      "_checked": true,
      "_result": false,
      "department": Array [
        "CSCI",
      ],
      "number": 150,
    },
  ],
  "$type": "of",
}
`)
	})

	xit('stores the number of matches in its containing expression', () => {})

	xit('handles counting boolean expressions', () => {})
	xit('handles counting course expressions', () => {})
	xit('handles counting modifier expressions', () => {})
	xit('handles counting occurrence expressions', () => {})
	xit('handles counting nested of-expressions', () => {})
	xit('handles counting requirement references', () => {})
	xit('handles counting where-expressions', () => {})
})
