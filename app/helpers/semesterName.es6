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

export default semesterName
