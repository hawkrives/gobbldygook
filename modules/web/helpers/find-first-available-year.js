// @flow
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import max from 'lodash/max'
import includes from 'lodash/includes'
import { findMissingNumber } from '../../lib/find-missing-number'

type Schedule = {
    id: any,
    year: number,
    semester: number,
}

/**
 * Takes a list of schedules and finds the first open year.
 * If they go [2012, 2013, 2015] findFirstAvailableYear will
 * return 2014. If it goes [2013, 2014, 2015] findFirstAvailableYear
 * will return 2016. If schedules is empty, it will return the
 * current year.
 *
 * @param {Array} schedules - the list of schedules
 * @param {Number} matriculation - the year of matriculation
 * @returns {Number} - the first available semester slot
 */
export function findFirstAvailableYear(
    schedules: Schedule[],
    matriculation: number
) {
    if (schedules && schedules.length === 0 && matriculation === undefined) {
        return new Date().getFullYear()
    }

    let years = map(schedules, s => s.year)

    // put the matriculation year at the front to give a starting point
    if (matriculation !== undefined && !includes(years, matriculation)) {
        years.unshift(matriculation - 1)
    }

    years = sortBy(years)

    // only uniq after we're done messing with the contents
    years = uniq(years)

    let missingNo = findMissingNumber(years)
    if (missingNo !== null) {
        return missingNo
    }

    return max(years) + 1
}
