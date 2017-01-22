import { expect } from 'chai'
import { computeCourse } from '../compute-chunk'

describe('computeCourse', () => {
	it('checks if a course exists in the list of courses', () => {
		const courses = [
			{ department: [ 'ASIAN', 'ART' ], number: 130 },
			{ department: [ 'ASIAN', 'ART' ], number: 170 },
			{ department: [ 'ART' ], number: 250 },
		]

		const query = {
			$type: 'course',
			$course: { department: [ 'ART' ], number: 250 },
		}

		const { computedResult, match } = computeCourse({
			expr: query, courses, dirty: new Set(), isNeeded: true,
		})

		expect(computedResult)
			.to.be.true

		expect(match)
			.to.deep.equal({ department: [ 'ART' ], number: 250 })
	})

	it('adds the course to the dirty set if it matches', () => {
		const courses = [ { department: [ 'ART' ], number: 130, type: 'Research' } ]
		const query = { $type: 'course', $course: { department: [ 'ART' ], number: 130, type: 'Research' } }

		const dirty = new Set()

		computeCourse({ expr: query, courses, dirty, isNeeded: true })

		expect(dirty)
			.to.have.property('size', 1)

		expect([ ...dirty ])
			.to.deep.equal([ 'ART 130 Research' ])
	})

	it('does not add the course to the dirty set if it did not match', () => {
		const courses = [ { department: [ 'ASIAN', 'ART' ], number: 130, type: 'Research' } ]
		const query = { $type: 'course', $course: { department: [ 'ART' ], number: 999, type: 'Lab' } }

		const dirty = new Set()

		computeCourse({ expr: query, courses, dirty, isNeeded: true })

		expect(dirty)
			.to.have.property('size', 0)

		expect([ ...dirty ])
			.to.deep.equal([])
	})

	it('returns false if the course is in the dirty set', () => {
		const courses = [ { department: [ 'ART' ], number: 130, type: 'Research' } ]
		const query = { $type: 'course', $course: { department: [ 'ART' ], number: 130, type: 'Research' } }

		const dirty = new Set([ 'ART 130 Research' ])

		const { computedResult, match } = computeCourse({ expr: query, courses, dirty, isNeeded: true })

		expect(computedResult)
			.to.be.false

		expect(match)
			.to.deep.equal({ department: [ 'ART' ], number: 130, type: 'Research' })
	})

	it('merges a query and the found course', () => {
		const courses = [
			{ department: [ 'ASIAN', 'ART' ], number: 130 },
			{ department: [ 'ASIAN', 'ART' ], number: 170 },
			{ department: [ 'ART' ], number: 250 },
		]

		const query = {
			$type: 'course',
			$course: { department: [ 'ART' ], number: 250, crsid: 20951 },
		}

		const { computedResult, match } = computeCourse({
			expr: query, courses, dirty: new Set(), isNeeded: true,
		})

		expect(computedResult)
			.to.be.true
		expect(match)
			.to.deep.equal({
				department: [ 'ART' ],
				number: 250,
				crsid: 20951,
				_extraKeys: [ 'crsid' ],
			})
	})
})
