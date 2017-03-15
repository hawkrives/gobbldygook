import { expect } from 'chai'

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
        expect(actionPromise instanceof Promise).to.be.true

        let action = await actionPromise
        expect(action).to.have.property('type', DESTROY_STUDENT)
        expect(action).to.have.property('payload')
        expect(action.payload).to.be.an.object
        expect(action.payload).to.deep.equal({
            studentId: 'student',
        })

        expect(localStorage.hasItem('student')).to.be.false
    })
})
