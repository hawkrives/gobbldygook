'use strict'

let semesterName = (semester) => {
	let semesters = {
		1: 'Fall',
		2: 'Interim',
		3: 'Spring',
		4: 'Early Summer',
		5: 'Late Summer',
	}
	return semesters[semester] || 'Unknown (' + semester + ')'
}

function toPrettyTerm(term) {
	term = String(term)
	var year = term.substr(0, 4)
	var sem = parseInt(term.substr(4, 1), 10)

	return semesterName(sem) + ' ' + year + '-' + (parseInt(year.substr(2, 2), 10) + 1)
}

export default semesterName
export {
	semesterName,
	toPrettyTerm
}
