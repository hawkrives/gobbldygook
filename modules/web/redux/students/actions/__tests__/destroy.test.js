import { destroyStudent } from '../destroy-student'
import { DESTROY_STUDENT } from '../../constants'

describe('destroyStudent action', () => {
    beforeEach(() => {
        localStorage.setItem('student', JSON.stringify({ id: 'student' }))
        localStorage.setItem('studentIds', JSON.stringify(['student']))
    })
    afterEach(() => {
        localStorage.clear()
    })

    it('destroys a student and returns an action to remove it from memory', async () => {
        let actionPromise = destroyStudent('student')
        expect(actionPromise instanceof Promise).toBe(true)

        let action = await actionPromise
        expect(action).toHaveProperty('type', DESTROY_STUDENT)
        expect(action.payload).toEqual({
            studentId: 'student',
        })

        expect(localStorage.hasItem('student')).toBe(false)
    })
})
