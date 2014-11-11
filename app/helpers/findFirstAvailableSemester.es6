'use strict';

import * as _ from 'lodash'
import findMissingNumberBinarySearch from './findMissingNumberBinarySearch'

// Takes a list of schedules and finds the first open semester.
// If they go [1, 2, 4] findFirstAvailableYear will
// return 3. If it goes [1, 2, 3] findFirstAvailableSemester
// will return 4. Etc.

function findFirstAvailableSemester(schedules, forYear) {
	var semesters = _(schedules)
			.filter({year: forYear})
			.sortBy('semester')
			.pluck('semester')
			.uniq()
			.value()

	// stick a 0 at the front so findBinary will start from 1
	semesters.unshift(0)

	var missingNo = findMissingNumberBinarySearch(semesters)
	if (!_.isNull(missingNo)) {
		return missingNo
	}

	return _.max(semesters) + 1
}

export default findFirstAvailableSemester
