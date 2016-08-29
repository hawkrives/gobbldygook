// @flow

import sortBy from 'lodash/sortBy'
import type {Study, StudyTypes} from '../models/types'

const types: StudyTypes[] = ['degree', 'major', 'concentration', 'emphasis']
export default function sortStudiesByType(studies: Study[]): Study[] {
	return sortBy(studies, (s: Study) => types.indexOf(s.type))
}
