import { setOverride, removeOverride } from '../overrides'

import { SET_OVERRIDE, REMOVE_OVERRIDE } from '../../constants'

describe('setOverride action', () => {
    it('returns an action to add an override', () => {
        let action = setOverride('id', 'override/path', true)
        expect(action).toHaveProperty('type', SET_OVERRIDE)
        expect(action).toHaveProperty('payload')
        expect(action.payload).toEqual({
            studentId: 'id',
            key: 'override/path',
            value: true,
        })
    })
})

describe('removeOverride action', () => {
    it('returns an action to remove an override', () => {
        let action = removeOverride('id', 'override/path')
        expect(action).toHaveProperty('type', REMOVE_OVERRIDE)
        expect(action).toHaveProperty('payload')
        expect(action.payload).toEqual({
            studentId: 'id',
            override: 'override/path',
        })
    })
})
