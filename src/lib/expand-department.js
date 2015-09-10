const departments = new Map(Object.entries({
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
}))

export default function expandDepartment(dept) {
	if (departments.has(dept)) {
		return departments.get(dept)
	}
	else {
		throw new TypeError(`expandDepartment(): "${dept}" is not a valid department shorthand`)
	}
}
