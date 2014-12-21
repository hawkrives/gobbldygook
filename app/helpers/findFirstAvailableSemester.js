import * as Immutable from 'immutable'
import findMissingNumberBinarySearch from 'helpers/findMissingNumberBinarySearch'

// Takes a list of schedules and finds the first open semester.
// If they go [1, 2, 4] findFirstAvailableYear will
// return 3. If it goes [1, 2, 3] findFirstAvailableSemester
// will return 4. Etc.

function findFirstAvailableSemester(schedules, forYear) {
	let semesters = schedules
		.filter(sch => sch.year === forYear)
		.map(sch => sch.semester)
		.toSet()

	// stick a 0 at the front so findBinary will start from 1
	semesters = semesters.add(0)

	semesters = semesters.sort()

	var missingNo = findMissingNumberBinarySearch(semesters.toJS())
	if (missingNo !== null) {
		return missingNo
	}

	return semesters.max() + 1
}

export default findFirstAvailableSemester
