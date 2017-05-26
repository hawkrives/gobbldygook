import { initStudent } from '../init-student'

import { INIT_STUDENT } from '../../constants'

describe('initStudent action', () => {
    it('returns an action to create a student', () => {
        let action = initStudent()

        expect(action).toHaveProperty('type', INIT_STUDENT)
        expect(action).toHaveProperty('payload')
        expect(typeof action.payload).toBe('object')
    })
})
