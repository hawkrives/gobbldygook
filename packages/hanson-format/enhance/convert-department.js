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

export function expandDepartment(dept) {
	if (!(dept in shortToLong)) {
		throw new TypeError(`expandDepartment(): "${dept}" is not a valid department shorthand`)
	}
	return shortToLong[dept]
}

export function shrinkDepartment(dept) {
	if (!(dept in longToShort)) {
		return dept
	}
	return longToShort[dept]
}
