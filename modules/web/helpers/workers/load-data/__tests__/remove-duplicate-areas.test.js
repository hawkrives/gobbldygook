/* eslint-env jest */
// @flow

jest.mock('../../../db')

import db from '../../../db'
import removeDuplicateAreas, {generateOps, buildRemoveAreaOps} from '../remove-duplicate-areas'

function mockArea(name, type, revision, sourcePath=null) {
    return {name, type, revision, sourcePath: sourcePath || `${type}/${name}.yaml`}
}

beforeEach(async () => {
    await db.__clear()
})

test('removeDuplicateAreas removes the shorter path when there are two duplicate areas', async () => {
    const areas = [
        // there was one major before the new revision was announced
        mockArea('CSCI', 'major', '2012-13', 'major/CSCI.yaml'),
        // now there are two
        mockArea('CSCI', 'major', '2012-13', 'major/CSCI-2012-13.yaml'),
        mockArea('CSCI', 'major', '2016-17', 'major/CSCI-2016-17.yaml'),
    ]

    await db.store('areas').batch(areas)

    await removeDuplicateAreas()

    const actual = await db.store('areas').getAll()
    expect(actual).toContainEqual(areas[1])
    expect(actual).toContainEqual(areas[2])
})

describe('generateOps', () => {
    test('returns an empty set of operations when there are no duplicates', () => {
        const areas = [
            mockArea('unique-name-1', 'type', 'rev'),
            mockArea('unique-name-2', 'type', 'rev'),
            mockArea('unique-name-3', 'type', 'rev'),
        ]
        expect(generateOps(areas)).toEqual({})
    })

    test('removes the shorter path when there are two duplicate areas', () => {
        const areas = [
            // there was one major before the new revision was announced
            mockArea('CSCI', 'major', '2012-13', 'major/CSCI.yaml'),
            // now there are two
            mockArea('CSCI', 'major', '2012-13', 'major/CSCI-2012-13.yaml'),
            mockArea('CSCI', 'major', '2016-17', 'major/CSCI-2016-17.yaml'),
        ]
        expect(generateOps(areas)).toEqual({
            'major/CSCI.yaml': null,
        })
    })

    test('removes invalid areas that got added somehow', () => {
        const areas = [
            // $FlowFixMe
            {
                name: 'invalid-area',
                type: 'type',
                revision: undefined,
                sourcePath: 'type/invalid-area.yaml',
            },
        ]
        expect(generateOps(areas)).toEqual({
            'type/invalid-area.yaml': null,
        })
    })
})

test('buildRemoveAreaOps', () => {
    const areas = [
        mockArea('name1', 'type', 'rev'),
        mockArea('name2', 'type', 'rev'),
        mockArea('name3', 'type', 'rev'),
    ]
    expect(buildRemoveAreaOps(areas)).toEqual({
        'type/name1.yaml': null,
        'type/name2.yaml': null,
        'type/name3.yaml': null,
    })
})
