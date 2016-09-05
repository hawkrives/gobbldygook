// @flow
import invert from 'lodash/invert'

const shortToLong = {
	AR: 'ART',
	AS: 'ASIAN',
	BI: 'BIO',
	CH: 'CHEM',
	CS: 'CSCI',
	EC: 'ECON',
	EN: 'ENGL',
	ES: 'ENVST',
	HI: 'HIST',
	LI: 'LING',
	MU: 'MUSIC',
	PH: 'PHIL',
	PS: 'PSCI',
	RE: 'REL',
	SA: 'SOAN',
}

const longToShort = invert(shortToLong)

export function expandDepartment(dept: string): Error|string {
	if (!(dept in shortToLong)) {
		return TypeError(`expandDepartment(): "${dept}" is not a valid department shorthand`)
	}
	return shortToLong[dept]
}

export function shrinkDepartment(dept: string): Error|string {
	if (!(dept in longToShort)) {
		return dept
	}
	return longToShort[dept]
}
