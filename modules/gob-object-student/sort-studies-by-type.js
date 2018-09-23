// @flow
import sortBy from 'lodash/sortBy'

import {type AreaQuery} from './types'

const types = ['degree', 'major', 'concentration', 'emphasis']
export function sortStudiesByType(studies: Array<AreaQuery>) {
	return sortBy(studies, s => types.indexOf(s.type))
}
