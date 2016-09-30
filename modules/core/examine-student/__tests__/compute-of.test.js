import {expect} from 'chai'
import {computeOf} from '../compute-chunk'

describe('computeOf', () => {
	it('computes a list of boolean-equivalent expressions against a desired count', () => {
		const expr = {
			$type: 'of',
			$count: {$operator: '$gte', $num: 2},
			$of: [
				{$type: 'course', $course: {department: ['CSCI'], number: 121}},
				{$type: 'course', $course: {department: ['CSCI'], number: 125}},
				{$type: 'course', $course: {department: ['CSCI'], number: 150}},
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

		const {computedResult, matches, counted} = computeOf({expr, ctx: req, courses, dirty, isNeeded: true})

		expect(computedResult)
			.to.be.true
		expect(matches)
			.to.deep.equal([
				{department: ['CSCI'], number: 121},
				{department: ['CSCI'], number: 125},
			])
		expect(counted)
			.to.equal(2)

		expect(expr).to.deep.equal({
			$type: 'of',
			$count: {$operator: '$gte', $num: 2},
			$of: [
				{
					_checked: true,
					_taken: true,
					_result: true,
					$type: 'course',
					_request: {department: ['CSCI'], number: 121},
					$course: {department: ['CSCI'], number: 121},
				},
				{
					_checked: true,
					_taken: true,
					_result: true,
					$type: 'course',
					_request: {department: ['CSCI'], number: 125},
					$course: {department: ['CSCI'], number: 125},
				},
				{
					_result: false,
					_checked: true,
					$type: 'course',
					$course: {department: ['CSCI'], number: 150},
				},
			],
		})
	})

	it('stores the number of matches in its containing expression')

	it('handles counting boolean expressions')
	it('handles counting course expressions')
	it('handles counting modifier expressions')
	it('handles counting occurrence expressions')
	it('handles counting nested of-expressions')
	it('handles counting requirement references')
	it('handles counting where-expressions')
})
