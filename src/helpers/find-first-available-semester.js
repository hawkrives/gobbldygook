import max from 'lodash/collection/max'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'
import uniq from 'lodash/array/uniq'
import sortBy from 'lodash/collection/sortBy'

import findMissingNumberBinarySearch from './find-missing-number-binary-search'

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
	let scheds = schedules.toJS ? schedules.toJS() : schedules
	let thisYear = filter(scheds, {year: forYear})

	let semesters = pluck(thisYear, 'semester')

	// stick a 0 at the front so findBinary will start from 1
	semesters.unshift(0)

	// uniq the list after we're done messing with the contents
	semesters = uniq(semesters)

	let sortedSemesters = sortBy(semesters)

	let missingNo = findMissingNumberBinarySearch(sortedSemesters)
	if (missingNo !== null) {
		return missingNo
	}

	return max(sortedSemesters) + 1
}

export default findFirstAvailableSemester
