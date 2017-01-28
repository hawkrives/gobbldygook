import { expect } from 'chai'
import collectMatches from '../collect-matches'

describe('collectMatches', () => {
	it('throws an error if confronted with an unknown type', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'odd',
			},
		}

		expect(() => collectMatches(expr)).to.throw(TypeError)
	})

	it('collects matches from child requirements', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'boolean',
				$and: [
					{
						$type: 'reference',
						requirement: 'Child',
						_matches: [
							{ department: [ 'ASIAN' ], number: 121 },
						],
					},
					{
						$type: 'reference',
						requirement: 'Child2',
						_matches: [
							{ department: [ 'CSCI' ], number: 121 },
						],
					},
				],
			},
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121 },
				{ department: [ 'CSCI' ], number: 121 },
			])
	})

	it('does not try to collect matches from requirements with no result key', () => {
		const expr = {
			$type: 'requirement',
			message: 'hi',
		}

		expect(collectMatches(expr)).to.deep.equal([])
	})

	it('collects matches from boolean expressions', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'boolean',
				$and: [
					{ _result: true, $type: 'course', $course: { department: [ 'ASIAN' ], number: 121 } },
					{
						$type: 'reference',
						requirement: 'Child2',
						_matches: [
							{ department: [ 'CSCI' ], number: 121 },
						],
					},
				],
			},
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121 },
				{ department: [ 'CSCI' ], number: 121 },
			])
	})

	it('collects matches from course expressions', () => {
		const expr = {
			$type: 'requirement',
			result: { _result: true, $type: 'course', $course: { department: [ 'ASIAN' ], number: 121 } },
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121 },
			])
	})

	it('collects matches from "courses" modifiers', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'modifier',
				$count: { $operator: '$gte', $num: 2 },
				$what: 'children',
				$children: 'all',
				_matches: [
					{ department: [ 'ASIAN' ], number: 121 },
					{ department: [ 'CSCI' ], number: 121 },
				],
			},
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121 },
				{ department: [ 'CSCI' ], number: 121 },
			])
	})

	it('collects matches from occurrences', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'occurrence',
				// the occurrence is empty because the _matches are calculated
				// in computeOccurrence
				_matches: [
					{ department: [ 'ASIAN' ], number: 121, year: 2014 },
					{ department: [ 'ASIAN' ], number: 121, year: 2015 },
				],
			},
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121, year: 2014 },
				{ department: [ 'ASIAN' ], number: 121, year: 2015 },
			])
	})

	it('collects matches from of-expressions', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'of',
				$count: { $operator: '$gte', $num: 1 },
				$of: [
					{
						$type: 'boolean',
						$and: [
							{ $type: 'course', _result: true, $course: { department: [ 'ASIAN' ], number: 121 } },
							{
								$type: 'reference',
								requirement: 'Child2',
								_matches: [
									{ department: [ 'CSCI' ], number: 121 },
								],
							},
						],
					},
					{
						$type: 'modifier',
						$count: { $operator: '$gte', $num: 2 },
						$what: 'children',
						$children: 'all',
						_matches: [
							{ department: [ 'MUSIC' ], number: 121 },
							{ department: [ 'ESTH' ], number: 121 },
						],
					},
				],
			},
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121 },
				{ department: [ 'CSCI' ], number: 121 },
				{ department: [ 'MUSIC' ], number: 121 },
				{ department: [ 'ESTH' ], number: 121 },
			])
	})

	it('collects matches from where-expressions', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'where',
				// $where is empty because the _matches are calculated in computeWhere
				$where: {},
				_matches: [
					{ department: [ 'ASIAN' ], number: 121 },
					{ department: [ 'CSCI' ], number: 121 },
				],
			},
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121 },
				{ department: [ 'CSCI' ], number: 121 },
			])
	})

	it('collects matches from requirement references', () => {
		const expr = {
			$type: 'requirement',
			result: {
				$type: 'reference',
				requirement: 'Child',
				_matches: [
					{ department: [ 'ASIAN' ], number: 121 },
				],
			},
		}

		expect(collectMatches(expr))
			.to.deep.equal([
				{ department: [ 'ASIAN' ], number: 121 },
			])
	})
})
