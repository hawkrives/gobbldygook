import cloneDeep from 'lodash/cloneDeep'
import computeChunk, { computeModifier } from '../compute-chunk'
import applyFilter from '../apply-filter'

describe('computeModifier', () => {
	it('checks for <things> from all children', () => {
		const modifier = {
			$type: 'modifier',
			$count: { $operator: '$gte', $num: 1 },
			$what: 'course',
			$from: 'children',
			$children: '$all',
		}

		const req = {
			Bible: {
				$type: 'requirement',
				result: {
					$type: 'boolean',
					$booleanType: 'or',
					$or: [
						{ $type: 'course', $course: { department: ['REL'], number: 111 } },
						{ $type: 'course', $course: { department: ['REL'], number: 112 } },
						{ $type: 'course', $course: { department: ['REL'], number: 251 } },
					],
				},
			},
			result: modifier,
		}

		const dirty = new Set()
		const courses = [
			{ department: ['REL'], number: 111 },
			{ department: ['REL'], number: 112 },
			{ department: ['CSCI'], number: 251 },
		]

		req.Bible.computed = computeChunk({ expr: req.Bible.result, ctx: req, courses, dirty })

		const { computedResult, matches, counted } = computeModifier({ expr: modifier, ctx: req, courses, dirty })

		expect(computedResult).toBe(true)
		expect(matches).toMatchSnapshot()
		expect(counted).toBe(1)
		expect(modifier).toMatchSnapshot()
	})

	it('checks for <things> from specified children', () => {
		const modifier = {
			$type: 'modifier',
			$count: { $operator: '$gte', $num: 1 },
			$what: 'course',
			$from: 'children',
			$children: [{ $type: 'reference', $requirement: 'Bible' }],
		}

		const req = {
			Bible: {
				$type: 'requirement',
				result: {
					$type: 'boolean',
					$booleanType: 'or',
					$or: [
						{ $type: 'course', $course: { department: ['REL'], number: 111 } },
						{ $type: 'course', $course: { department: ['REL'], number: 112 } },
						{ $type: 'course', $course: { department: ['REL'], number: 251 } },
					],
				},
			},
			result: modifier,
		}

		const dirty = new Set()
		const courses = [
			{ department: ['REL'], number: 111 },
			{ department: ['REL'], number: 112 },
			{ department: ['CSCI'], number: 251 },
		]

		req.Bible.computed = computeChunk({ expr: req.Bible.result, ctx: req, courses, dirty })

		const { computedResult, matches, counted } = computeModifier({ expr: modifier, ctx: req, courses, dirty })

		expect(computedResult).toBe(true)
		expect(matches).toMatchSnapshot()
		expect(counted).toBe(1)
		expect(modifier).toMatchSnapshot()
	})

	it('checks for <things> from the filter', () => {
		const modifier = {
			$type: 'modifier',
			$count: { $operator: '$gte', $num: 1 },
			$what: 'course',
			$from: 'filter',
		}

		const req = {
			filter: {
				$type: 'filter',
				$filterType: 'where',
				$where: {
					$type: 'qualification',
					$key: 'department',
					$operator: '$eq',
					$value: 'REL',
				},
			},
			result: modifier,
		}

		const dirty = new Set()
		let courses = [
			{ department: ['REL'], number: 111 },
			{ department: ['REL'], number: 112 },
			{ department: ['CSCI'], number: 251 },
		]

		courses = applyFilter(req.filter, courses)

		const { computedResult, matches, counted } = computeModifier({ expr: modifier, ctx: req, courses, dirty })

		expect(computedResult).toBe(true)
		expect(matches).toMatchSnapshot()
		expect(counted).toBe(2)
		expect(modifier).toMatchSnapshot()
	})

	it('counts, excluding a given course', () => {
		const modifier = {
			$besides: { $type: 'course', $course: { 'department': ['CHEM'], 'number': 398 } },
			$count: { $num: 1, $operator: '$gte' },
			$from: 'filter',
			$type: 'modifier',
			$what: 'course',
		}

		const req = {
			filter: {
				$type: 'filter',
				$filterType: 'where',
				$where: {
					$type: 'qualification',
					$key: 'department',
					$operator: '$eq',
					$value: {
						$or: ['CHEM', 'REL'],
						$type: 'boolean',
						$booleanType: 'or',
					},
				},
			},
			result: modifier,
		}

		let goodCourses = [
			{ department: ['REL'], number: 111 },
		]
		goodCourses = applyFilter(req.filter, goodCourses)

		const { computedResult: one } = computeModifier({ expr: cloneDeep(modifier), ctx: cloneDeep(req), courses: goodCourses, dirty: new Set() })
		expect(one).toBe(true)

		let badCourses = [
			{ department: ['CHEM'], number: 398 },
		]
		badCourses = applyFilter(req.filter, badCourses)

		const { computedResult: two } = computeModifier({ expr: cloneDeep(modifier), ctx: cloneDeep(req), courses: badCourses, dirty: new Set() })
		expect(two).toBe(false)

		let moreGoodCourses = [
			{ department: ['CHEM'], number: 398 },
			{ department: ['REL'], number: 111 },
		]
		moreGoodCourses = applyFilter(req.filter, moreGoodCourses)

		const { computedResult: three } = computeModifier({ expr: cloneDeep(modifier), ctx: cloneDeep(req), courses: moreGoodCourses, dirty: new Set() })
		expect(three).toBe(true)
	})

	it('checks for <things> from the given where-clause', () => {
		const modifier = {
			$type: 'modifier',
			$count: { $operator: '$gte', $num: 1 },
			$what: 'course',
			$from: 'where',
			$where: {
				$type: 'qualification',
				$key: 'department',
				$operator: '$eq',
				$value: 'REL',
			},
		}

		const req = { result: modifier }

		const dirty = new Set()
		const courses = [
			{ department: ['REL'], number: 111 },
			{ department: ['REL'], number: 112 },
			{ department: ['CSCI'], number: 251 },
		]

		const { computedResult, matches, counted } = computeModifier({ expr: modifier, ctx: req, courses, dirty })

		expect(computedResult).toBe(true)
		expect(matches).toMatchSnapshot()
		expect(counted).toBe(2)

		expect(modifier).toMatchSnapshot()
	})

	it('supports counting courses', () => {
		const modifier = {
			$type: 'modifier',
			$count: { $operator: '$gte', $num: 3 },
			$what: 'course',
			$from: 'children',
			$children: '$all',
		}

		const req = {
			Bible: {
				$type: 'requirement',
				result: {
					$type: 'boolean',
					$booleanType: 'and',
					$and: [
						{ $type: 'course', $course: { department: ['REL'], number: 111 } },
						{ $type: 'course', $course: { department: ['REL'], number: 112 } },
					],
				},
			},
			A: {
				$type: 'requirement',
				result: {
					$type: 'course',
					$course: { department: ['CSCI'], number: 251 },
				},
			},
			result: modifier,
		}

		const dirty = new Set()
		const courses = [
			{ department: ['REL'], number: 111, credits: 1.0 },
			{ department: ['REL'], number: 112, credits: 1.0 },
			{ department: ['CSCI'], number: 251, credits: 1.0 },
		]

		req.Bible.computed = computeChunk({ expr: req.Bible.result, ctx: req, courses, dirty })
		req.A.computed = computeChunk({ expr: req.A.result, ctx: req, courses, dirty })

		const { computedResult, matches, counted } = computeModifier({ expr: modifier, ctx: req, courses, dirty })

		expect(computedResult).toBe(true)
		expect(matches).toMatchSnapshot()
		expect(counted).toBe(3)
		expect(modifier).toMatchSnapshot()
	})

	it('supports counting departments', () => {
		const modifier = {
			$type: 'modifier',
			$count: { $operator: '$gte', $num: 3 },
			$what: 'department',
			$from: 'children',
			$children: '$all',
		}

		const req = {
			CHBI: {
				$type: 'requirement',
				result: {
					$type: 'boolean',
					$booleanType: 'and',
					$and: [
						{ $type: 'course', $course: { department: ['CHEM', 'BIO'], number: 111 } },
						{ $type: 'course', $course: { department: ['CHEM', 'BIO'], number: 112 } },
					],
				},
			},
			A: {
				$type: 'requirement',
				result: {
					$type: 'course',
					$course: { department: ['CSCI'], number: 251 },
				},
			},
			result: modifier,
		}

		const dirty = new Set()
		const courses = [
			{ department: ['CHEM', 'BIO'], number: 111, credits: 1.0 },
			{ department: ['CHEM', 'BIO'], number: 112, credits: 1.0 },
			{ department: ['CSCI'], number: 251, credits: 1.0 },
		]

		req.CHBI.computed = computeChunk({ expr: req.CHBI.result, ctx: req, courses, dirty })
		req.A.computed = computeChunk({ expr: req.A.result, ctx: req, courses, dirty })

		const { computedResult, matches, counted } = computeModifier({ expr: modifier, ctx: req, courses, dirty })

		expect(computedResult).toBe(true)
		expect(matches).toMatchSnapshot()
		expect(counted).toBe(3)
		expect(modifier).toMatchSnapshot()
	})

	it('supports counting credits', () => {
		const modifier = {
			$type: 'modifier',
			$count: { $operator: '$gte', $num: 2 },
			$what: 'credit',
			$from: 'children',
			$children: '$all',
		}

		const req = {
			Bible: {
				$type: 'requirement',
				result: {
					$type: 'boolean',
					$booleanType: 'or',
					$or: [
						{ $type: 'course', $course: { department: ['REL'], number: 111 } },
						{ $type: 'course', $course: { department: ['REL'], number: 112 } },
						{ $type: 'course', $course: { department: ['REL'], number: 251 } },
					],
				},
			},
			A: {
				$type: 'requirement',
				result: {
					$type: 'course',
					$course: { department: ['CSCI'], number: 251 },
				},
			},
			result: modifier,
		}

		const dirty = new Set()
		const courses = [
			{ department: ['REL'], number: 111, credits: 1.0 },
			{ department: ['REL'], number: 112, credits: 1.0 },
			{ department: ['CSCI'], number: 251, credits: 1.0 },
		]

		req.Bible.computed = computeChunk({ expr: req.Bible.result, ctx: req, courses, dirty })
		req.A.computed = computeChunk({ expr: req.A.result, ctx: req, courses, dirty })

		const { computedResult, matches, counted } = computeModifier({ expr: modifier, ctx: req, courses, dirty })

		expect(computedResult).toBe(true)
		expect(matches).toMatchSnapshot()
		expect(counted).toBe(2)
		expect(modifier).toMatchSnapshot()
	})

	it('can be used to ensure that the student has taken two courses across two departments', () => {
		const modifier = {
			$type: 'boolean',
			$booleanType: 'and',
			$and: [
				{
					$type: 'modifier',
					$count: { $operator: '$gte', $num: 2 },
					$what: 'course',
					$from: 'children',
					$children: '$all',
				},
				{
					$type: 'modifier',
					$count: { $operator: '$gte', $num: 2 },
					$what: 'department',
					$from: 'children',
					$children: '$all',
				},
			],
		}

		const req = {
			A: {
				$type: 'requirement',
				result: {
					$type: 'course',
					$course: { department: ['CHEM', 'BIO'], number: 111 },
				},
			},
			B: {
				$type: 'requirement',
				result: {
					$type: 'course',
					$course: { department: ['CHEM', 'BIO'], number: 112 },
				},
			},
			result: modifier,
		}

		const dirty = new Set()
		const courses = [
			{ department: ['CHEM', 'BIO'], number: 111, credits: 1.0 },
			{ department: ['CHEM', 'BIO'], number: 112, credits: 1.0 },
		]

		req.A.computed = computeChunk({ expr: req.A.result, ctx: req, courses, dirty })
		req.A.computed = computeChunk({ expr: req.B.result, ctx: req, courses, dirty })

		const courseResults = computeModifier({ expr: modifier.$and[0], ctx: req, courses, dirty })
		const departmentResults = computeModifier({ expr: modifier.$and[1], ctx: req, courses, dirty })

		expect(modifier).toEqual({
			$type: 'boolean',
			$booleanType: 'and',
			$and: [
				{
					$type: 'modifier',
					$count: { $operator: '$gte', $num: 2 },
					$what: 'course',
					$from: 'children',
					$children: '$all',
				},
				{
					$type: 'modifier',
					$count: { $operator: '$gte', $num: 2 },
					$what: 'department',
					$from: 'children',
					$children: '$all',
				},
			],
		})

		expect(courseResults.computedResult).toBe(true)
		expect(courseResults.matches).toMatchSnapshot()
		expect(courseResults.counted).toBe(2)

		expect(departmentResults.computedResult).toBe(true)
		expect(departmentResults.matches).toMatchSnapshot()
		expect(departmentResults.counted).toBe(2)
	})

	it('throws when $what is none of "course", "credit", nor "department"', () => {
		expect(() => computeModifier({ expr: { $what: 'invalid', $from: {}, $count: {} } })).toThrowError(TypeError)
	})
})
