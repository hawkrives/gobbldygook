// @flow
import {expect} from 'chai'
import every from 'lodash/every'
import find from 'lodash/find'
import {
	convertStudent,
	// processSchedules,
	// processDegrees,
	// resolveSingularDataPoints,
} from '../convert-imported-student'
import {sample} from './__support__/sample-student'
const getCourseMock = async course => course

describe('convertStudent', () => {
	it('converts a student from the imported data to a Gobbldygook student', async () => {
		const actual = await convertStudent(sample, getCourseMock)

		const expectedStudies = [
			{'name': 'Bachelor of Arts', 'type': 'degree', 'revision': 'latest'},
			{'name': 'Computer Science', 'type': 'major', 'revision': 'latest'},
			{'name': 'Asian Studies', 'type': 'major', 'revision': 'latest'},
			{'name': 'Japan Studies', 'type': 'concentration', 'revision': 'latest'},
		]

		const expectedPartialSchedules = [
			{
				active: true,
				index: 1,
				title: 'Schedule 0',
				clbids: [87891, 81526],
				year: 2011,
				semester: 9,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule G',
				clbids: [82908, 83505, 82768, 82771, 82792],
				year: 2012,
				semester: 1,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule I',
				clbids: [85898],
				year: 2012,
				semester: 2,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule S',
				clbids: [84513, 84461, 85991, 85992, 84378, 84381],
				year: 2012,
				semester: 3,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule 3',
				clbids: [89090, 88273, 88630, 88593, 88681, 88682],
				year: 2013,
				semester: 1,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule Z',
				clbids: [89466],
				year: 2013,
				semester: 2,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule T',
				clbids: [90719, 89957, 90339, 90340, 90172],
				year: 2013,
				semester: 3,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule L',
				clbids: [97217, 97413, 97120, 97119, 97125],
				year: 2014,
				semester: 1,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule W',
				clbids: [99351],
				year: 2014,
				semester: 2,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule 5',
				clbids: [97582, 97407, 95594, 95842, 97333],
				year: 2014,
				semester: 3,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule G',
				clbids: [102748, 100423, 100346, 103276, 99504],
				year: 2015,
				semester: 1,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule D',
				clbids: [101017, 101018],
				year: 2015,
				semester: 2,
			},
			{
				active: true,
				index: 1,
				title: 'Schedule O',
				clbids: [103314, 103404, 104968, 102075, 103170, 103157],
				year: 2015,
				semester: 3,
			},
		]

		expect(actual).to.have.property('id')
		expect(actual).to.have.property('name')
		expect(actual).to.have.property('version')
		expect(actual).to.have.property('creditsNeeded')
		expect(actual).to.have.property('matriculation')
		expect(actual).to.have.property('graduation')
		expect(actual).to.have.property('advisor')
		expect(actual).to.have.property('dateLastModified')
		expect(actual).to.have.property('dateCreated')
		expect(actual).to.have.property('studies')
		expect(actual).to.have.property('schedules')
		expect(actual).to.have.property('overrides')
		expect(actual).to.have.property('fabrications')
		expect(actual).to.have.property('settings')

		for (let study of actual.studies) {
			expect(study).to.have.property('name')
			expect(study).to.have.property('type')
			expect(study).to.have.property('revision', 'latest')
		}

		for (let schedule of Object.values(actual.schedules)) {
			expect(schedule).to.have.property('id')
			expect(schedule).to.have.property('active')
			expect(schedule).to.have.property('index')
			expect(schedule).to.have.property('title')
			expect(schedule).to.have.property('clbids')
			expect(schedule).to.have.property('year')
			expect(schedule).to.have.property('semester')
		}

		expect(every(expectedStudies, study => find(actual.studies, study)))
		expect(every(expectedPartialSchedules, sched => find(actual.schedules, sched)))
	})
})


xdescribe('processSchedules', () => {})
xdescribe('processDegrees', () => {})
xdescribe('resolveSingularDataPoints', () => {})
