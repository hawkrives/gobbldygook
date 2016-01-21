import {expect} from 'chai'
import mock from 'mock-require'
import noop from 'lodash/noop'

mock('../../src/models/student', {
	__esModule: true,
	default: noop,
	saveStudent: noop,
	addScheduleToStudent: noop,
})
mock('../../src/models/schedule', () => ({}))

const {initStudent} = require('../../src/redux/students/actions/init-student')

const {INIT_STUDENT} = require('../../src/redux/students/constants')


describe('initStudent action', () => {
	it('returns an action to create a student', () => {
		let action = initStudent()

		expect(action).to.have.property('type', INIT_STUDENT)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
	})
})

mock.stopAll()
