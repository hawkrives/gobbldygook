import {sortBy} from 'lodash'

const types = ['degree', 'major', 'concentration', 'emphasis']
export function sortStudiesByType(studies) {
	return sortBy(studies, s => types.indexOf(s.type))
}
