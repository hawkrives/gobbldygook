// @flow
import max from 'lodash/max'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import { findMissingNumber } from '../../lib/find-missing-number'

type Schedule = {
    id: any,
    year: number,
    semester: number,
}

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
export function findFirstAvailableSemester(
    schedules: Schedule[],
    forYear: number
) {
    const thisYear = filter(schedules, s => s.year === forYear)
    const semesters = map(thisYear, s => s.semester)

    // stick a 0 at the front so findBinary will start from 1
    semesters.unshift(0)

    // uniq the list after we're done messing with the contents
    const sortedSemesters = sortBy(uniq(semesters))

    const missingNo = findMissingNumber(sortedSemesters)
    if (missingNo !== null) {
        return missingNo
    }

    return max(sortedSemesters) + 1
}
