// @flow

import groupBy from 'lodash/groupBy'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import fromPairs from 'lodash/fromPairs'
import sortBy from 'lodash/sortBy'
import map from 'lodash/map'

import db from '../db'

export default function removeDuplicateAreas() {
    return db.store('areas').getAll().then(allAreas => {
        // now de-duplicate, based on name, type, and revision
        // reasons for duplicates:
        // - a major adds a new revision
        //      - the old one will have already been replaced by the new one, because of cleanPriorData
        // - a major … are there any other cases?

        const grouped = groupBy(
            allAreas,
            area => `{${area.name}, ${area.type}, ${area.revision}}`
        )
        const withDuplicates = filter(grouped, list => list.length > 1)

        let ops = {}
        forEach(withDuplicates, duplicatesList => {
            duplicatesList = sortBy(
                duplicatesList,
                area => area.sourcePath.length
            )
            duplicatesList.shift() // take off the shortest one
            ops = {
                ...ops,
                ...fromPairs(
                    map(duplicatesList, item => [item.sourcePath, null])
                ),
            }
        })

        // remove any that are invalid
        // --- something about any values that aren't objects

        const invalidAreas = filter(allAreas, area =>
            ['name', 'revision', 'type'].some(key => area[key] === undefined))
        ops = {
            ...ops,
            ...fromPairs(map(invalidAreas, item => [item.sourcePath, null])),
        }

        return db.store('areas').batch(ops)
    })
}
