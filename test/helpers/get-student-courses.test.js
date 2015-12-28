import {expect} from 'chai'

import demoStudent from '../../src/models/demo-student.json'
import getStudentCourses from '../../src/helpers/get-student-courses'

import mock from 'mock-require'
mock('../../src/helpers/get-courses', require('../mocks/get-courses.mock').default)
mock('../../src/helpers/load-area', require('../mocks/load-area.mock').default)
import Student from '../../src/models/student'

import size from 'lodash/collection/size'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'

describe('getStudentCourses', () => {
	it('only returns courses from active schedules', () => {
		const stu = Student(demoStudent)
		let courseCountFromActive = size(pluck(filter(demoStudent.schedules, 'active'), 'clbids'))
		getStudentCourses(stu).then(courses => expect(courses.length).to.equal(courseCountFromActive))
	})
})
