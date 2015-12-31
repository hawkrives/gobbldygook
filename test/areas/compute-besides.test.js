import {expect} from 'chai'
import {computeBesides} from '../../src/area-tools/compute-chunk'

describe('computeBesides', () => {
	it('counts, excluding a given course', () => {
		const besides = {
			$count: {$num: 1, $operator: '$gte'},
			$course: {$type: 'course', $course: {department: ['CHEM'], number: 398}},
			$type: 'besides',
			$what: 'course',
		}

		const goodCourses = [
			{department: ['REL'], number: 111},
		]

		expect(computeBesides({expr: besides, courses: goodCourses})).to.have.property('computedResult', true)

		const badCourses = [
			{department: ['CHEM'], number: 398},
		]

		expect(computeBesides({expr: besides, courses: badCourses})).to.have.property('computedResult', false)

		const moreGoodCourses = [
			{department: ['CHEM'], number: 398},
			{department: ['REL'], number: 111},
		]

		expect(computeBesides({expr: besides, courses: moreGoodCourses})).to.have.property('computedResult', true)
	})
})
