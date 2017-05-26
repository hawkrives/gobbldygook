import { addFabrication, removeFabrication } from '../fabrications'

import { ADD_FABRICATION, REMOVE_FABRICATION } from '../../constants'

describe('addFabrication action', () => {
    it('returns an action to add a fabrication', () => {
        let action = addFabrication('id', { 'fab/path': true })
        expect(action).toHaveProperty('type', ADD_FABRICATION)
        expect(action.payload).toEqual({
            studentId: 'id',
            fabrication: { 'fab/path': true },
        })
    })
})

describe('removeFabrication action', () => {
    it('returns an action to remove a fabrication', () => {
        let action = removeFabrication('id', 'fab/path')
        expect(action).toHaveProperty('type', REMOVE_FABRICATION)
        expect(action.payload).toEqual({
            studentId: 'id',
            fabricationId: 'fab/path',
        })
    })
})
