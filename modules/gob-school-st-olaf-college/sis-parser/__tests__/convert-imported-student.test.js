import {convertStudent} from '../convert-imported-student'
import {sample} from './__support__/sample-student'
import expectedSchedules from './__support__/expected-schedules'
const getCourseMock = async course => course

describe('convertStudent', () => {
	it('converts a student from the imported data to a Gobbldygook student', async () => {
		let actual = await convertStudent(sample, getCourseMock)

		expect(actual.id).toBeDefined()
		expect(actual.name).toBeDefined()
		expect(actual.version).toBeDefined()
		// expect(actual.creditsNeeded).toBeDefined()
		expect(actual.matriculation).toBeDefined()
		expect(actual.graduation).toBeDefined()
		expect(actual.advisor).toBeDefined()
		expect(actual.dateLastModified).toBeDefined()
		expect(actual.dateCreated).toBeDefined()
		expect(actual.studies).toBeDefined()
		expect(actual.schedules).toBeDefined()
		expect(actual.overrides).toBeDefined()
		expect(actual.fabrications).toBeDefined()
		expect(actual.settings).toBeDefined()
	})

	it('the conversion maintained the integrity of the areas', async () => {
		let actual = await convertStudent(sample, getCourseMock)

		for (let study of actual.studies) {
			expect(study.name).toBeDefined()
			expect(study.type).toBeDefined()
			expect(study.revision).toBeDefined()
			expect(study.revision).toBe('latest')
		}
	})

	it('the conversion maintained the integrity of the schedules', async () => {
		let actual = await convertStudent(sample, getCourseMock)

		for (let study of actual.studies) {
			expect(study.name).toBeDefined()
			expect(study.type).toBeDefined()
			expect(study.revision).toBeDefined()
			expect(study.revision).toBe('latest')
		}
	})

	it('contains all of the expected areas of study', async () => {
		let actual = await convertStudent(sample, getCourseMock)

		let expectedStudies = [
			{name: 'Bachelor of Arts', type: 'degree', revision: 'latest'},
			{name: 'Computer Science', type: 'major', revision: 'latest'},
			{name: 'Asian Studies', type: 'major', revision: 'latest'},
			{name: 'Japan Studies', type: 'concentration', revision: 'latest'},
		]

		for (let expected of expectedStudies) {
			expect(actual.studies.toArray()).toContainEqual(
				expect.objectContaining(expected),
			)
		}
	})

	it('contains all of the expected schedules', async () => {
		let actual = await convertStudent(sample, getCourseMock)

		let actualSchedules = actual.schedules.toList().toJS()
		for (let expectedSched of expectedSchedules) {
			let expected = expect.objectContaining(expectedSched)
			expect(actualSchedules).toContainEqual(expected)
		}
	})
})
