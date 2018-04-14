// @flow
import sortBy from 'lodash/sortBy'

const types = ['degree', 'major', 'concentration', 'emphasis']
export function sortStudiesByType(studies: Array<{type: string}>) {
    return sortBy(studies, s => types.indexOf(s.type))
}
