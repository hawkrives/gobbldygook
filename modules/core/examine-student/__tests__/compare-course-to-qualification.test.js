import { expect } from 'chai'
import compareCourseToQualification from '../compare-course-to-qualification'

describe('compareCourseToQualification', () => {
	it('compares a course property against an operator', () => {
		const course = { department: [ 'ART' ], number: 310 }
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$eq', $value: 310 })).to.be.true
	})

	it('supports $eq', () => {
		const course = { department: [ 'ART' ], number: 310 }
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$eq', $value: 310 })).to.be.true
	})

	it('supports $ne', () => {
		const course = { department: [ 'ART' ], number: 310 }
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$ne', $value: 210 })).to.be.true
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$ne', $value: 310 })).to.be.false
	})

	it('supports $lt', () => {
		const course = { department: [ 'ART' ], number: 200 }
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$lt', $value: 300 })).to.be.true
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$lt', $value: 100 })).to.be.false
	})

	it('supports $lte', () => {
		const course = { department: [ 'ART' ], number: 310 }
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$lte', $value: 310 })).to.be.true
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$lte', $value: 200 })).to.be.false
	})

	it('supports $gt', () => {
		const course = { department: [ 'ART' ], number: 300 }
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$gt', $value: 200 })).to.be.true
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$gt', $value: 400 })).to.be.false
	})

	it('supports $gte', () => {
		const course = { department: [ 'ART' ], number: 310 }
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$gte', $value: 310 })).to.be.true
		expect(compareCourseToQualification(course, { $key: 'number', $operator: '$gte', $value: 400 })).to.be.false
	})

	it('compares checks for items within arrays', () => {
		const course = { department: [ 'ART', 'ASIAN' ], number: 310 }
		expect(compareCourseToQualification(course, { $key: 'department', $operator: '$eq', $value: 'ART' })).to.be.true
		expect(compareCourseToQualification(course, { $key: 'department', $operator: '$eq', $value: 'ASIAN' })).to.be.true
	})

	it('$ne checks if an item does not exist within an array', () => {
		const course = { department: [ 'ART', 'ASIAN' ], number: 310 }
		expect(compareCourseToQualification(course, { $key: 'department', $operator: '$ne', $value: 'CSCI' })).to.be.true
	})

	it('compares courses against a pre-determined query', () => {
		const course = { department: [ 'ART', 'ASIAN' ], year: 2015 }
		const qualification = { $key: 'year', $operator: '$lte', $value: { '$computed-value': 2016, $type: 'function' } }
		expect(compareCourseToQualification(course, qualification)).to.be.true
	})

	it('refuses to compare against an array', () => {
		const course = { department: [ 'ART', 'ASIAN' ], year: 2015 }
		const qualification = { $key: 'year', $operator: '$lte', $value: [ 2016 ] }
		expect(() => compareCourseToQualification(course, qualification)).to.throw(TypeError)
	})

	it('throws if $value is an object and has an unknown type', () => {
		const course = { department: [ 'ART', 'ASIAN' ], year: 2015 }
		const qualification = { $key: 'year', $operator: '$lte', $value: { $type: 'unknown' } }
		expect(() => compareCourseToQualification(course, qualification)).to.throw(TypeError)
	})

	it('handles $or boolean values', () => {
		const course1 = { department: [ 'ART', 'ASIAN' ], year: 2015 }
		const course2 = { department: [ 'ART', 'ASIAN' ], year: 2013 }
		const qualification = { $key: 'year', $operator: '$lte', $value: { $type: 'boolean', $or: [ 2013, 2015 ] } }
		expect(compareCourseToQualification(course1, qualification)).to.be.true
		expect(compareCourseToQualification(course2, qualification)).to.be.true
	})

	it('handles $and boolean values', () => {
		const course1 = { department: [ 'ART', 'ASIAN' ], year: 2015 }
		const qualification1 = { $key: 'year', $operator: '$lte', $value: { $type: 'boolean', $and: [ 2013, 2015 ] } }
		expect(compareCourseToQualification(course1, qualification1)).to.be.false

		const course2 = { department: [ 'ART', 'ASIAN' ], year: 2013 }
		const qualification2 = { $key: 'year', $operator: '$lte', $value: { $type: 'boolean', $and: [ 2013, 2013 ] } }
		expect(compareCourseToQualification(course2, qualification2)).to.be.true
	})

	it('throws if $value is a boolean but neither $and nor $or', () => {
		const course = { department: [ 'ART', 'ASIAN' ], year: 2015 }
		const qualification = { $key: 'year', $operator: '$lte', $value: { $type: 'boolean', $xor: [] } }
		expect(() => compareCourseToQualification(course, qualification)).to.throw(TypeError)
	})
})
