import {action as initStudent} from '../init-student'
import {Student} from '@gob/object-student'
import {INIT_STUDENT} from '../../constants'

describe('initStudent action', () => {
	it('returns an action to create a student', () => {
		let action = initStudent(new Student())

		expect(action).toHaveProperty('type', INIT_STUDENT)
		expect(action).toHaveProperty('payload')
		expect(typeof action.payload).toBe('object')
	})
})
