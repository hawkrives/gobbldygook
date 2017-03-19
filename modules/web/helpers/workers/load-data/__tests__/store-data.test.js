/* eslint-env jest */
// @flow

jest.mock('../../../db')

import db from '../../../db'
import storeData, { storeArea, storeCourses } from '../store-data'

import { mockArea } from './area.support'
import { mockCourse } from './course.support'

beforeEach(async () => {
    await db.__clear()
})

describe('storeArea', () => {
    test('stores the passed area', async () => {
        const area = mockArea('CSCI', 'major', '2012-13')
        await storeArea(area.sourcePath, area)

        const actual = (await db.store('areas').getAll())[0]
        expect(actual).toMatchObject(area)
    })
})

describe('storeCourses', () => {
    test('stores the given courses', async () => {
        const courses = [
            mockCourse({ clbid: 1, number: 101, name: 'florp' }),
            mockCourse({ clbid: 2, number: 102, name: 'bord' }),
            mockCourse({ clbid: 3, title: 'bar' }),
            mockCourse({ clbid: 4, times: ['T 1130-1230'] }),
        ]

        await storeCourses('terms/20161.json', courses)

        const actual = await db.store('courses').getAll()

        expect(actual[0]).toMatchObject(courses[0])
        expect(actual[1]).toMatchObject(courses[1])
        expect(actual[2]).toMatchObject(courses[2])
        expect(actual[3]).toMatchObject(courses[3])
    })
})

describe('storeData', () => {
    test('does not throw when storing "courses"', async () => {
        const handleError = jest.fn()

        try {
            await storeData('terms/20161.json', 'courses', [])
        } catch (err) {
            handleError()
        }

        expect(handleError).not.toHaveBeenCalled()
    })

    test('does not throw when storing "areas"', async () => {
        const handleError = jest.fn()

        try {
            const area = mockArea('CSCI', 'major', '2012-13')
            await storeData('majors/csci.yaml', 'areas', area)
        } catch (err) {
            handleError()
        }

        expect(handleError).not.toHaveBeenCalled()
    })
})
