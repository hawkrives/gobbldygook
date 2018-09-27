// @flow
import type {Course} from './types'

import flatten from 'lodash/flatten'
import toPairs from 'lodash/toPairs'

/**
 * Gets the list of unique departments from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {string[]} - the list of unique departments
 */
export default function getDepartments(courses: Array<Course>): Array<string> {
	let departments = flatten(courses.map(c => c.department.split('/'))).map(
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
