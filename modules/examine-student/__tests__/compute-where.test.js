import { computeWhere } from '../compute-chunk'

describe('computeWhere', () => {
	it('requires "distinct" courses to be different courses', () => {
		const expr = {
			$type: 'boolean',
			$count: { $operator: '$gte', $num: 2 },
			$where: {
				$type: 'qualification',
				$key: 'gereqs',
				$operator: '$eq',
				$value: 'SPM',
			},
			$distinct: true,
		}

		const courses = [
			{ department: [ 'ESTH' ], number: 182, year: 2012, gereqs: [ 'SPM' ] },
			{ department: [ 'ESTH' ], number: 182, year: 2013, gereqs: [ 'SPM' ] },
		]

		const expected = {
			computedResult: false,
			matches: [ courses[0] ],
			counted: 1,
		}

		const actual = computeWhere({ expr, courses })

		expect(actual).toEqual(expected)

		const altCourses = [
			{ department: [ 'ESTH' ], number: 182, year: 2012, gereqs: [ 'SPM' ] },
			{ department: [ 'ESTH' ], number: 187, year: 2013, gereqs: [ 'SPM' ] },
		]

		let expected2 = {
			computedResult: true,
			matches: altCourses,
			counted: 2,
		}

		let actual2 = computeWhere({ expr, courses: altCourses })

		expect(actual2).toEqual(expected2)
	})
})
