import {expect} from 'chai'
import computeChunk, {computeBoolean} from '../compute-chunk'

describe('computeBoolean', () => {
	it('computes the boolean result of and-clauses', () => {
		const clause = {
			$type: 'boolean',
			$and: [
				{$type: 'course', $course: {department: ['CSCI'], number: 121}},
				{$type: 'course', $course: {department: ['CSCI'], number: 125}},
			],
		}
		const requirement = {result: clause}
		const courses = [
			{department: ['CSCI'], number: 121},
			{department: ['CSCI'], number: 125},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$type: 'boolean',
			$and: [
				{
					_result: true,
					_taken: true,
					_checked: true,
					_request: {department: ['CSCI'], number: 121},
					$type: 'course',
					$course: {department: ['CSCI'], number: 121},
				},
				{
					_result: true,
					_taken: true,
					_checked: true,
					_request: {department: ['CSCI'], number: 125},
					$type: 'course',
					$course: {department: ['CSCI'], number: 125},
				},
			],
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['CSCI'], number: 121},
			{department: ['CSCI'], number: 125},
		])
	})

	it('computes the boolean result of or-clauses', () => {
		const clause = {
			$type: 'boolean',
			$or: [
				{$type: 'course', $course: {department: ['CSCI'], number: 121}},
				{$type: 'course', $course: {department: ['CSCI'], number: 125}},
			],
		}
		const requirement = {result: clause}
		const courses = [
			{department: ['CSCI'], number: 121},
			{department: ['CSCI'], number: 125},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					_taken: true,
					_result: true,
					_checked: true,
					_request: {department: ['CSCI'], number: 121},
					$type: 'course',
					$course: {department: ['CSCI'], number: 121},
				},
				{
					_taken: true,
					_result: false,
					_checked: true,
					_request: {department: ['CSCI'], number: 125},
					$type: 'course',
					$course: {department: ['CSCI'], number: 125},
				},
			],
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['CSCI'], number: 121},
		])
	})

	it('computes an or-clause even if the first item is false', () => {
		const clause = {
			$type: 'boolean',
			$or: [
				{$type: 'course', $course: {department: ['CSCI'], number: 121}},
				{$type: 'course', $course: {department: ['CSCI'], number: 125}},
			],
		}
		const requirement = {result: clause}
		const courses = [
			{department: ['CSCI'], number: 151},
			{department: ['CSCI'], number: 125},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					_result: false,
					_checked: true,
					$type: 'course',
					$course: {department: ['CSCI'], number: 121},
				},
				{
					_taken: true,
					_result: true,
					_checked: true,
					_request: {department: ['CSCI'], number: 125},
					$type: 'course',
					$course: {department: ['CSCI'], number: 125},
				},
			],
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['CSCI'], number: 125},
		])
	})

	it('can compute the result of several other boolean expressions', () => {
		const clause = {
			$type: 'boolean',
			$and: [
				{
					$type: 'boolean',
					$or: [
						{$type: 'course', $course: {department: ['CSCI'], number: 121}},
						{$type: 'course', $course: {department: ['CSCI'], number: 125}},
					],
				},
				{
					$type: 'boolean',
					$or: [
						{$type: 'course', $course: {department: ['CSCI'], number: 130}},
						{$type: 'course', $course: {department: ['CSCI'], number: 131}},
					],
				},
			],
		}
		const requirement = {result: clause}

		const courses = [
			{department: ['CSCI'], number: 130},
			{department: ['CSCI'], number: 125},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$and: [
				{
					$or: [
						{
							_result: false,
							_checked: true,
							$type: 'course',
							$course: {department: ['CSCI'], number: 121},
						},
						{
							_taken: true,
							_result: true,
							_checked: true,
							_request: {department: ['CSCI'], number: 125},
							$type: 'course',
							$course: {department: ['CSCI'], number: 125},
						},
					],
					$type: 'boolean',
					_result: true,
					_checked: true,
					_matches: [
						{department: ['CSCI'], number: 125},
					],
				},
				{
					$or: [
						{
							_taken: true,
							_result: true,
							_checked: true,
							$type: 'course',
							_request: {department: ['CSCI'], number: 130},
							$course: {department: ['CSCI'], number: 130},
						},
						{
							_checked: true,
							_result: false,
							$type: 'course',
							$course: {department: ['CSCI'], number: 131},
						},
					],
					$type: 'boolean',
					_result: true,
					_checked: true,
					_matches: [
						{department: ['CSCI'], number: 130},
					],
				},
			],
			$type: 'boolean',
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['CSCI'], number: 125},
			{department: ['CSCI'], number: 130},
		])
	})

	it('can compute the result of several course expressions', () => {
		const clause = {
			$or: [
				{$type: 'course', $course: {department: ['CSCI'], number: 121}},
				{$type: 'course', $course: {department: ['CSCI'], number: 125}},
			],
			$type: 'boolean',
		}
		const requirement = {result: clause}

		const courses = [
			{department: ['CSCI'], number: 130},
			{department: ['CSCI'], number: 125},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$or: [
				{
					_result: false,
					_checked: true,
					$type: 'course',
					$course: {department: ['CSCI'], number: 121},
				},
				{
					_taken: true,
					_result: true,
					_checked: true,
					_request: {department: ['CSCI'], number: 125},
					$type: 'course',
					$course: {department: ['CSCI'], number: 125},
				},
			],
			$type: 'boolean',
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['CSCI'], number: 125},
		])
	})

	it('can compute the result of several modifier expressions', () => {
		const clause = {
			$and: [
				{
					$children: '$all',
					$count: {$operator: '$gte', $num: 3},
					$from: 'children',
					$type: 'modifier',
					$what: 'course',
				},
				{
					$children: [
						{
							$requirement: 'A',
							$type: 'reference',
						},
						{
							$requirement: 'C',
							$type: 'reference',
						},
					],
					$count: {$operator: '$gte', $num: 2},
					$from: 'children',
					$type: 'modifier',
					$what: 'credit',
				},
			],
			$type: 'boolean',
		}
		const requirement = {
			A: {$type: 'requirement', result: {
				$type: 'course',
				$course: {department: ['ART'], number: 120},
			}},
			C: {$type: 'requirement', result: {
				$count: {$operator: '$gte', $num: 2},
				$of: [
					{$type: 'course', $course: {department: ['ART'], number: 103}},
					{$type: 'course', $course: {department: ['ART'], number: 104}},
					{$type: 'course', $course: {department: ['ART'], number: 105}},
				],
				$type: 'of',
			}},
			result: clause,
		}

		const courses = [
			{department: ['ART'], number: 120, credits: 1.0},
			{department: ['ART'], number: 104, credits: 1.0},
			{department: ['ART'], number: 105, credits: 1.0},
		]
		const dirty = new Set()

		requirement.A.computed = computeChunk({expr: requirement.A.result, ctx: requirement, courses, dirty})
		requirement.C.computed = computeChunk({expr: requirement.C.result, ctx: requirement, courses, dirty})

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty, isNeeded: true})
		expect(clause).to.deep.equal({
			$and: [
				{
					$children: '$all',
					$count: {$operator: '$gte', $num: 3},
					$from: 'children',
					$type: 'modifier',
					$what: 'course',
					_checked: true,
					_result: true,
					_counted: 3,
					_matches: [
						{department: ['ART'], number: 120, credits: 1.0, _extraKeys: ['credits']},
						{department: ['ART'], number: 104, credits: 1.0, _extraKeys: ['credits']},
						{department: ['ART'], number: 105, credits: 1.0, _extraKeys: ['credits']},
					],
				},
				{
					$children: [
						{$requirement: 'A', $type: 'reference'},
						{$requirement: 'C', $type: 'reference'},
					],
					$count: {$operator: '$gte', $num: 2},
					$from: 'children',
					$type: 'modifier',
					$what: 'credit',
					_checked: true,
					_result: true,
					_counted: 3,
					_matches: [
						{department: ['ART'], number: 120, credits: 1.0, _extraKeys: ['credits']},
						{department: ['ART'], number: 104, credits: 1.0, _extraKeys: ['credits']},
						{department: ['ART'], number: 105, credits: 1.0, _extraKeys: ['credits']},
					],
				},
			],
			$type: 'boolean',
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['ART'], number: 120, credits: 1.0, _extraKeys: ['credits']},
			{department: ['ART'], number: 104, credits: 1.0, _extraKeys: ['credits']},
			{department: ['ART'], number: 105, credits: 1.0, _extraKeys: ['credits']},
		])
	})

	it('can compute the result of several occurrence expressions', () => {
		const clause = {
			$or: [
				{
					$count: {$operator: '$gte', $num: 1},
					$course: {department: ['THEAT'], number: 222},
					$type: 'occurrence',
				},
				{
					$count: {$operator: '$gte', $num: 3},
					$course: {department: ['THEAT'], number: 266},
					$type: 'occurrence',
				},
			],
			$type: 'boolean',
		}

		const requirement = {result: clause}

		const courses = [
			{department: ['THEAT'], number: 266, year: 2014, semester: 1},
			{department: ['THEAT'], number: 266, year: 2014, semester: 3},
			{department: ['THEAT'], number: 266, year: 2015, semester: 1},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$or: [
				{
					$count: {$operator: '$gte', $num: 1},
					$course: {department: ['THEAT'], number: 222},
					$type: 'occurrence',
					_checked: true,
					_result: false,
					_counted: 0,
					_matches: [],
				},
				{
					$count: {$operator: '$gte', $num: 3},
					$course: {department: ['THEAT'], number: 266},
					$type: 'occurrence',
					_checked: true,
					_result: true,
					_counted: 3,
					_matches: [
						{department: ['THEAT'], number: 266, year: 2014, semester: 1},
						{department: ['THEAT'], number: 266, year: 2014, semester: 3},
						{department: ['THEAT'], number: 266, year: 2015, semester: 1},
					],
				},
			],
			$type: 'boolean',
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['THEAT'], number: 266, year: 2014, semester: 1},
			{department: ['THEAT'], number: 266, year: 2014, semester: 3},
			{department: ['THEAT'], number: 266, year: 2015, semester: 1},
		])
	})

	it('can compute the result of several of-expressions', () => {
		const clause = {
			$and: [
				{
					$count: {$operator: '$gte', $num: 1},
					$of: [
						{$course: {department: ['CSCI'], number: 121}, $type: 'course'},
						{$course: {department: ['CSCI'], number: 125}, $type: 'course'},
					],
					$type: 'of',
				},
				{
					$count: {$operator: '$gte', $num: 1},
					$of: [
						{$course: {department: ['ART'], number: 102}, $type: 'course'},
						{$course: {department: ['ART'], number: 103}, $type: 'course'},
					],
					$type: 'of',
				},
			],
			$type: 'boolean',
		}

		const requirement = {result: clause}

		const courses = [
			{department: ['CSCI'], number: 125},
			{department: ['ART'], number: 102},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$and: [
				{
					$count: {$operator: '$gte', $num: 1},
					$of: [
						{
							_result: false,
							_checked: true,
							$course: {department: ['CSCI'], number: 121},
							$type: 'course',
						},
						{
							_taken: true,
							_result: true,
							_checked: true,
							_request: {department: ['CSCI'], number: 125},
							$course: {department: ['CSCI'], number: 125},
							$type: 'course',
						},
					],
					$type: 'of',
					_counted: 1,
					_matches: [
						{department: ['CSCI'], number: 125},
					],
					_result: true,
					_checked: true,
				},
				{
					$count: {$operator: '$gte', $num: 1},
					$of: [
						{
							_taken: true,
							_result: true,
							_checked: true,
							_request: {department: ['ART'], number: 102},
							$course: {department: ['ART'], number: 102},
							$type: 'course',
						},
						{
							_checked: true,
							_result: false,
							$course: {department: ['ART'], number: 103},
							$type: 'course',
						},
					],
					$type: 'of',
					_counted: 1,
					_matches: [
						{department: ['ART'], number: 102},
					],
					_result: true,
					_checked: true,
				},
			],
			$type: 'boolean',
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['CSCI'], number: 125},
			{department: ['ART'], number: 102},
		])
	})

	it('can compute the result of several requirement references', () => {
		const clause = {
			$and: [
				{$requirement: 'A', $type: 'reference'},
				{$requirement: 'C', $type: 'reference'},
			],
			$type: 'boolean',
		}
		const requirement = {
			A: {$type: 'requirement', result: {
				$type: 'course', $course: {department: ['ART'], number: 120},
			}},
			C: {$type: 'requirement', result: {
				$count: {$operator: '$gte', $num: 2},
				$of: [
					{$type: 'course', $course: {department: ['ART'], number: 103}},
					{$type: 'course', $course: {department: ['ART'], number: 104}},
					{$type: 'course', $course: {department: ['ART'], number: 105}},
				],
				$type: 'of',
			}},
			result: clause,
		}

		const courses = [
			{department: ['ART'], number: 120},
			{department: ['ART'], number: 104},
			{department: ['ART'], number: 105},
		]
		const dirty = new Set()

		requirement.A.computed = computeChunk({expr: requirement.A.result, ctx: requirement, courses, dirty})
		requirement.C.computed = computeChunk({expr: requirement.C.result, ctx: requirement, courses, dirty})

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty, isNeeded: true})
		expect(clause).to.deep.equal({
			$and: [
				{
					$requirement: 'A',
					$type: 'reference',
					_result: true,
					_checked: true,
					_matches: [
						{department: ['ART'], number: 120},
					],
				},
				{
					$requirement: 'C',
					$type: 'reference',
					_result: true,
					_checked: true,
					_matches: [
						{department: ['ART'], number: 104},
						{department: ['ART'], number: 105},
					],
				},
			],
			$type: 'boolean',
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['ART'], number: 120},
			{department: ['ART'], number: 104},
			{department: ['ART'], number: 105},
		])
	})

	it('can compute the result of several where-expressions', () => {
		const clause = {
			$and: [
				{
					$count: {$operator: '$gte', $num: 1},
					$type: 'where',
					$where: {
						$key: 'gereqs',
						$operator: '$eq',
						$type: 'qualification',
						$value: 'WRI',
					},
					$distinct: false,
				},
				{
					$count: {$operator: '$gte', $num: 1},
					$type: 'where',
					$where: {
						$key: 'gereqs',
						$operator: '$eq',
						$type: 'qualification',
						$value: 'BTS-T',
					},
					$distinct: false,
				},
			],
			$type: 'boolean',
		}

		const requirement = {result: clause}

		const courses = [
			{department: ['CSCI'], number: 125, gereqs: ['WRI']},
			{department: ['ART'], number: 102, gereqs: ['BTS-T']},
		]

		const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set(), isNeeded: true})
		expect(clause).to.deep.equal({
			$and: [
				{
					$count: {$operator: '$gte', $num: 1},
					$type: 'where',
					$where: {
						$key: 'gereqs',
						$operator: '$eq',
						$type: 'qualification',
						$value: 'WRI',
					},
					$distinct: false,
					_counted: 1,
					_matches: [
						{department: ['CSCI'], number: 125, gereqs: ['WRI']},
					],
					_result: true,
					_checked: true,
				},
				{
					$count: {$operator: '$gte', $num: 1},
					$type: 'where',
					$where: {
						$key: 'gereqs',
						$operator: '$eq',
						$type: 'qualification',
						$value: 'BTS-T',
					},
					$distinct: false,
					_counted: 1,
					_matches: [
						{department: ['ART'], number: 102, gereqs: ['BTS-T']},
					],
					_result: true,
					_checked: true,
				},
			],
			$type: 'boolean',
		})
		expect(computedResult).to.be.true
		expect(matches).to.deep.equal([
			{department: ['CSCI'], number: 125, gereqs: ['WRI']},
			{department: ['ART'], number: 102, gereqs: ['BTS-T']},
		])
	})

	it('throws when neither $and nor $or were present', () => {
		expect(() => computeBoolean({expr: {$neither: []}, isNeeded: true})).to.throw(TypeError)
	})
})
