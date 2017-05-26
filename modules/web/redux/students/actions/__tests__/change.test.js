import {
    changeName,
    changeAdvisor,
    changeCreditsNeeded,
    changeMatriculation,
    changeGraduation,
    changeSetting,
} from '../change'

import {
    CHANGE_NAME,
    CHANGE_ADVISOR,
    CHANGE_CREDITS_NEEDED,
    CHANGE_MATRICULATION,
    CHANGE_GRADUATION,
    CHANGE_SETTING,
} from '../../constants'

describe('changeName action', () => {
    it('returns an action to change the name of a student', () => {
        let action = changeName('id', 'new name')
        expect(action).toHaveProperty('type', CHANGE_NAME)
        expect(action.payload).toEqual({
            studentId: 'id',
            name: 'new name',
        })
    })
})

describe('changeAdvisor action', () => {
    it('returns an action to change the advisor of a student', () => {
        let action = changeAdvisor('id', 'new advisor')
        expect(action).toHaveProperty('type', CHANGE_ADVISOR)
        expect(action.payload).toEqual({
            studentId: 'id',
            advisor: 'new advisor',
        })
    })
})

describe('changeCreditsNeeded action', () => {
    it('returns an action to change the creditsNeeded of a student', () => {
        let action = changeCreditsNeeded('id', 30)
        expect(action).toHaveProperty('type', CHANGE_CREDITS_NEEDED)
        expect(action.payload).toEqual({
            studentId: 'id',
            credits: 30,
        })
    })
})

describe('changeMatriculation action', () => {
    it('returns an action to change the matriculation of a student', () => {
        let action = changeMatriculation('id', 1800)
        expect(action).toHaveProperty('type', CHANGE_MATRICULATION)
        expect(action.payload).toEqual({
            studentId: 'id',
            matriculation: 1800,
        })
    })
})

describe('changeGraduation action', () => {
    it('returns an action to change the graduation of a student', () => {
        let action = changeGraduation('id', 2100)
        expect(action).toHaveProperty('type', CHANGE_GRADUATION)
        expect(action.payload).toEqual({
            studentId: 'id',
            graduation: 2100,
        })
    })
})

describe('changeSetting action', () => {
    it('returns an action to change the setting of a student', () => {
        let action = changeSetting('id', 'key', 'val')
        expect(action).toHaveProperty('type', CHANGE_SETTING)
        expect(action.payload).toEqual({
            studentId: 'id',
            key: 'key',
            value: 'val',
        })
    })
})
