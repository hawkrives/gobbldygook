import { expect } from 'chai'
import countDepartments from '../count-departments'

describe('countDepartments', () => {
	it('counts the number of distinct departments in an array of courses', () => {
		const courses = [
			{ department: [ 'ART' ] },
			{ department: [ 'ART', 'ASIAN' ] },
			{ department: [ 'CHEM', 'BIO' ] },
		]
		expect(countDepartments(courses)).to.equal(4)
	})
})
