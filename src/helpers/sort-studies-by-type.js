import {sortBy} from 'lodash-es'

const types = ['degree', 'major', 'concentration', 'emphasis']
export default function sortStudiesByType(studies) {
	return sortBy(studies, s => types.indexOf(s.type))
}
