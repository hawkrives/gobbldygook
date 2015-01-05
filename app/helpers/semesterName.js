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

function expandYear(year) {
	let thisYear = String(year)
	let nextYear = parseInt(year, 10)
	// : parseInt(year.substr(2, 2), 10)
	return thisYear + '—' + (nextYear + 1)
}

function toPrettyTerm(term) {
	term = String(term)
	let year = term.substr(0, 4)
	let sem = parseInt(term.substr(4, 1), 10)

	return semesterName(sem) + ' ' + expandYear(year)
}

export default semesterName
export {
	semesterName,
	toPrettyTerm,
	expandYear
}
