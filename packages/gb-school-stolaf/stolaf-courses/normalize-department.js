// @flow
import {fullToAbbr} from './mapping-departments'

export function normalizeDepartment(dept: string): string {
	if (!(dept in fullToAbbr)) {
		return dept.toUpperCase()
	}
	return fullToAbbr[dept]
}
