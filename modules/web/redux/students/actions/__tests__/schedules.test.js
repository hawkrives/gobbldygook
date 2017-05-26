import {
    addSchedule,
    destroySchedule,
    destroySchedules,
    renameSchedule,
    reorderSchedule,
    moveSchedule,
} from '../schedules'

import {
    ADD_SCHEDULE,
    DESTROY_SCHEDULE,
    DESTROY_SCHEDULES,
    RENAME_SCHEDULE,
    REORDER_SCHEDULE,
    MOVE_SCHEDULE,
} from '../../constants'

describe('addSchedule action', () => {
    it('returns an action to add a schedule to a student', () => {
        let action = addSchedule('id', { year: 2012 })
        expect(action).toHaveProperty('type', ADD_SCHEDULE)
        expect(typeof action.payload).toBe('object')
    })
})

describe('destroySchedule action', () => {
    it('returns an action to remove a schedule from a student', () => {
        let action = destroySchedule('id', 'sid')
        expect(action).toHaveProperty('type', DESTROY_SCHEDULE)
        expect(action.payload).toEqual({
            studentId: 'id',
            scheduleId: 'sid',
        })
    })
})

describe('destroySchedules action', () => {
    it('returns an action to remove several schedules from a student', () => {
        let action = destroySchedules('id', 'sid', 'sid2')
        expect(action).toHaveProperty('type', DESTROY_SCHEDULES)
        expect(action.payload).toEqual({
            studentId: 'id',
            scheduleIds: ['sid', 'sid2'],
        })
    })
})

describe('renameSchedule action', () => {
    it('returns an action to rename a schedule', () => {
        let action = renameSchedule('id', 'sid', 'name')
        expect(action).toHaveProperty('type', RENAME_SCHEDULE)
        expect(action.payload).toEqual({
            studentId: 'id',
            scheduleId: 'sid',
            newTitle: 'name',
        })
    })
})

describe('reorderSchedule action', () => {
    it('returns an action to reorder a schedule', () => {
        let action = reorderSchedule('id', 'sid', 1)
        expect(action).toHaveProperty('type', REORDER_SCHEDULE)
        expect(action.payload).toEqual({
            studentId: 'id',
            scheduleId: 'sid',
            newIndex: 1,
        })
    })
})

describe('moveSchedule action', () => {
    it('returns an action to move a schedule', () => {
        let action = moveSchedule('id', 'sid', 2012, 3)
        expect(action).toHaveProperty('type', MOVE_SCHEDULE)
        expect(action.payload).toEqual({
            studentId: 'id',
            scheduleId: 'sid',
            year: 2012,
            semester: 3,
        })
    })
})
