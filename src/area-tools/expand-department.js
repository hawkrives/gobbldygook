/* globals module */

const departments = {
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

function expandDepartment(dept) {
	if (dept in departments) {
		return departments[dept]
	}
	else {
		throw new TypeError(`expandDepartment(): "${dept}" is not a valid department shorthand`)
	}
}

module.exports = {__esModule: true, default: expandDepartment}
