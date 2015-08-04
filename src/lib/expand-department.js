const departments = {
	AR: 'ART',
	AS: 'ASIAN',
	BI: 'BIO',
	CH: 'CHEM',
	CS: 'CSCI',
	EC: 'ECON',
	ES: 'ENVST',
	HI: 'HIST',
	MU: 'MUSIC',
	PH: 'PHIL',
	PS: 'PSCI',
	RE: 'REL',
	SA: 'SOAN',
}

export default function expandDepartment(dept) {
	if (dept in departments) {
		return departments[dept]
	}
	else {
		throw new TypeError(`expandDepartment(): "${dept}" is not a valid department shorthand`)
	}
}
