import {computeOf} from '../compute-chunk'

describe('computeOf', () => {
	it('computes a list of boolean-equivalent expressions against a desired count', () => {
		const expr = {
			$type: 'of',
			$count: {$operator: '$gte', $num: 2},
			$of: [
				{
					$type: 'course',
					$course: {department: 'CSCI', number: 121},
				},
				{
					$type: 'course',
					$course: {department: 'CSCI', number: 125},
				},
				{
					$type: 'course',
					$course: {department: 'CSCI', number: 150},
				},
			],
		}
		const req = {
			$type: 'requirement',
			result: expr,
		}

		const dirty = new Set()
		const courses = [
			{department: 'CSCI', number: 121},
			{department: 'CSCI', number: 125},
		]

		const {computedResult, matches, counted} = computeOf({
			expr,
			ctx: req,
			courses,
			dirty,
			isNeeded: true,
		})

		expect(computedResult).toBe(true)
		expect(matches).toEqual([
			{department: 'CSCI', number: 121},
			{department: 'CSCI', number: 125},
		])
		expect(counted).toBe(2)

		expect(expr).toEqual({
			$type: 'of',
			$count: {$operator: '$gte', $num: 2},
			$of: [
				{
					_checked: true,
					_taken: true,
					_result: true,
					$type: 'course',
					_request: {department: 'CSCI', number: 121},
					$course: {department: 'CSCI', number: 121},
				},
				{
					_checked: true,
					_taken: true,
					_result: true,
					$type: 'course',
					_request: {department: 'CSCI', number: 125},
					$course: {department: 'CSCI', number: 125},
				},
				{
					_result: false,
					_checked: true,
					$type: 'course',
					$course: {department: 'CSCI', number: 150},
				},
			],
		})
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
