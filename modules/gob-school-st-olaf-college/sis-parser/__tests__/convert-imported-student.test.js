import {convertStudent} from '../convert-imported-student'
import {sample} from './__support__/sample-student'
const getCourseMock = async course => course

describe('convertStudent', () => {
	it('converts a student from the imported data to a Gobbldygook student', async () => {
		const actual = await convertStudent(sample, getCourseMock)

		expect(actual).toMatchSnapshot()
	})
})
