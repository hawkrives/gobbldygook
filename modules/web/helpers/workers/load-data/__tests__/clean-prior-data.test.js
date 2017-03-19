/* eslint-env jest */
// @flow

jest.mock('../../../db')

import db from '../../../db'
import cleanPriorData, {
    getPriorCourses,
    getPriorAreas,
} from '../clean-prior-data'

describe('getPriorCourses', () => {
    beforeEach(async () => {
        await db.__clear()
    })

    test('foop', async () => {
        await db.store('courses').batch([
            {sourcePath: 'dir/file', clbid: '1'},
        ])
        expect(Object.keys(await getPriorCourses('dir/file'))).toHaveLength(1)
    })
})

describe('getPriorAreas', () => {
    beforeEach(async () => {
        await db.__clear()
    })

    test('foop', async () => {
        await db.store('areas').batch([
            {sourcePath: 'dir/file'},
        ])
        expect(Object.keys(await getPriorAreas('dir/file'))).toHaveLength(1)
    })
})

describe('cleanPriorData', () => {
    beforeEach(async () => {
        await db.__clear()
    })

    test('clears courses', async () => {
        await db.store('courses').batch([
            {sourcePath: 'dir/file', clbid: '1'},
        ])

        expect(await db.store('courses').getAll()).toHaveLength(1)

        await cleanPriorData('dir/file', 'courses')

        expect(await db.store('courses').getAll()).toHaveLength(0)
    })

    test('clears areas', async () => {
        await db.store('areas').batch([
            {sourcePath: 'dir/file'},
        ])

        expect(await db.store('areas').getAll()).toHaveLength(1)

        await cleanPriorData('dir/file', 'areas')

        expect(await db.store('areas').getAll()).toHaveLength(0)
    })
})
