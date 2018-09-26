// @flow
import type {Course} from './types'
import flatMap from 'lodash/flatMap'
import toPairs from 'lodash/toPairs'

// Gets the list of unique departments from a list of courses
export default function getDepartments(courses: Array<Course>): Array<string> {
	// $FlowFixMe _.flatMap should _not_ be complaining about me passing in an array
	let departments = flatMap(courses, c => c.department.split('/')).map(
		dept => DEPT_LOOKUP.get(dept) || dept,
	)

	return [...new Set(departments)]
}

const DEPT_LOOKUP = new Map(
	toPairs({
		AR: 'ART',
		AS: 'ASIAN',
		BI: 'BIO',
		CH: 'CHEM',
		CS: 'CSCI',
		EC: 'ECON',
		EN: 'ENGL',
		ES: 'ENVST',
		HI: 'HIST',
		LI: 'LNGST',
		MU: 'MUSIC',
		PH: 'PHIL',
		PS: 'PSCI',
		RE: 'REL',
		SA: 'SOAN',
	}),
)
