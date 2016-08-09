import max from 'lodash/max'
import filter from 'lodash/filter'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'

import findMissingNumberBinarySearch from './find-missing-number-binary-search'

/**
 * Takes a list of schedules and finds the first open semester.
 * If they go [1, 2, 4] findFirstAvailableSemester will
 * return 3. If it goes [1, 2, 3] findFirstAvailableSemester
 * will return 4. Etc.
 *
 * @param {Array} schedules - the list of schedules
 * @param {Number} forYear - the year to look within
 * @returns {Number} - the first available semester slot
 */
export default function findFirstAvailableSemester(schedules, forYear) {
	let thisYear = filter(schedules, {year: forYear})

	let semesters = map(thisYear, s => s.semester)

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
