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

    test('returns the deletion batch', async () => {
        const actions = [{ sourcePath: 'dir/file', clbid: '1' }]
        await db.store('courses').batch(actions)
        expect(Object.keys(await getPriorCourses('dir/file'))).toHaveLength(1)
    })
})

describe('getPriorAreas', () => {
    beforeEach(async () => {
        await db.__clear()
    })

    test('returns the deletion batch', async () => {
        const actions = [{ sourcePath: 'dir/file' }]
        await db.store('areas').batch(actions)
        expect(Object.keys(await getPriorAreas('dir/file'))).toHaveLength(1)
    })
})

describe('cleanPriorData', () => {
    beforeEach(async () => {
        await db.__clear()
    })

    test('clears courses', async () => {
        const actions = [{ sourcePath: 'dir/file', clbid: '1' }]
        await db.store('courses').batch(actions)

        expect(await db.store('courses').getAll()).toHaveLength(1)

        await cleanPriorData('dir/file', 'courses')

        expect(await db.store('courses').getAll()).toHaveLength(0)
    })

    test('clears areas', async () => {
        const actions = [{ sourcePath: 'dir/file' }]
        await db.store('areas').batch(actions)

        expect(await db.store('areas').getAll()).toHaveLength(1)

        await cleanPriorData('dir/file', 'areas')

        expect(await db.store('areas').getAll()).toHaveLength(0)
    })

    test('throws on an unknown type', async () => {
        expect.assertions(1)

        try {
            // $FlowFixMe
            await cleanPriorData('path', 'invalid_type')
        } catch (err) {
            expect(err.message).toMatchSnapshot()
        }
    })
})
