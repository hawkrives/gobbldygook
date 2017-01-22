import { expect } from 'chai'
import collectTakenCourses from '../collect-taken-courses'

describe('collectTakenCourses', () => {
	it('collects a list of all of the courses anywhere in this object which have the `_taken` property.', () => {
		const obj = {
			$type: 'course',
			$course: {
				department: [ 'ASIAN' ],
				number: 120,
			},
			_taken: true,
		}

		expect(collectTakenCourses(obj)).to.equal(obj.$course)
	})

	it('can go down several layers deep', () => {
		const obj = {
			$type: 'boolean',
			$or: [
				{
					$type: 'course',
					$course: {
						department: [ 'ASIAN' ],
						number: 120,
					},
					_taken: true,
				},
				{
					$type: 'course',
					$course: {
						department: [ 'ASIAN' ],
						number: 120,
					},
				},
			],
		}

		expect(collectTakenCourses(obj)).to.deep.equal([
			obj.$or[0].$course,
		])
	})

	it('can go down many layers deep', () => {
		const obj = {
			$type: 'of',
			$count: { $operator: '$gte', $num: 3 },
			$of: [
				{
					$type: 'of',
					$count: { $operator: '$gte', $num: 1 },
					$of: [
						{
							$course: { department: [ 'CSCI' ], number: 120 },
							$type: 'course',
						},
						{
							$course: { department: [ 'CSCI' ], number: 121 },
							$type: 'course',
							_taken: true,
						},
						{
							$course: { department: [ 'CSCI' ], number: 122 },
							$type: 'course',
						},
					],
				},
				{
					$type: 'where',
					$count: { $operator: '$gte', $num: 2 },
					$where: {
						$key: 'gereq',
						$operator: '$eq',
						$type: 'qualification',
						$value: 'WRI',
					},
				},
				{
					$type: 'occurrence',
					$count: { $operator: '$gte', $num: 2 },
					$course: { department: [ 'CHEM' ], number: 121 },
				},
				{
					$type: 'of',
					$count: { $operator: '$gte', $num: 3 },
					$of: [
						{
							$course: { department: [ 'ART', 'ASIAN' ], number: 170 },
							$type: 'course',
							_taken: true,
						},
						{
							$course: { department: [ 'ART', 'ASIAN' ], number: 175 },
							$type: 'course',
							_taken: true,
						},
						{
							$course: { department: [ 'ART', 'ASIAN' ], number: 180 },
							$type: 'course',
						},
						{
							$course: { department: [ 'ART', 'ASIAN' ], number: 190 },
							$type: 'course',
							_taken: true,
						},
					],
				},
				{
					$type: 'of',
					$count: { $operator: '$gte', $num: 3 },
					$of: [
						{
							$course: { department: [ 'ASIAN' ], number: 210 },
							$type: 'course',
							_taken: true,
						},
						{
							$course: { department: [ 'ASIAN' ], number: 215 },
							$type: 'course',
							_taken: true,
						},
						{
							$course: { department: [ 'ASIAN' ], number: 220 },
							$type: 'course',
							_taken: true,
						},
					],
				},
			],
		}

		expect(collectTakenCourses(obj)).to.deep.equal([
			{ department: [ 'CSCI' ], number: 121 },
			{ department: [ 'ART', 'ASIAN' ], number: 170 },
			{ department: [ 'ART', 'ASIAN' ], number: 175 },
			{ department: [ 'ART', 'ASIAN' ], number: 190 },
			{ department: [ 'ASIAN' ], number: 210 },
			{ department: [ 'ASIAN' ], number: 215 },
			{ department: [ 'ASIAN' ], number: 220 },
		])
	})
})
