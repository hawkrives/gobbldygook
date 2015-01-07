import _ from 'lodash'
import findMissingNumberBinarySearch from 'app/helpers/findMissingNumberBinarySearch'

/**
 * Takes a list of schedules and finds the first open semester.
 * If they go [1, 2, 4] findFirstAvailableSemester will
 * return 3. If it goes [1, 2, 3] findFirstAvailableSemester
 * will return 4. Etc.
 *
 * @param {Array|Immutable.List} schedules - the list of schedules
 * @param {Number} forYear - the year to look within
 * @returns {Number} - the first available semester slot
 */
function findFirstAvailableSemester(schedules, forYear) {
	let semesters = _(schedules.toJS ? schedules.toJS() : schedules)
		.filter(sch => sch.year === forYear)
		.map(sch => sch.semester)
		.uniq()
		// stick a 0 at the front so findBinary will start from 1
		.unshift(0)
		.sortBy()
		.value()

	let missingNo = findMissingNumberBinarySearch(semesters)
	if (missingNo !== null) {
		return missingNo
	}

	return _.max(semesters) + 1
}

export default findFirstAvailableSemester
