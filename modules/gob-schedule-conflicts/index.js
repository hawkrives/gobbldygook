// @flow

import type {Course, Offering} from '@gob/types'

export function removeColon(time: string): string {
	return time.replace(/:/, '')
}

function checkOfferingForTimeConflict(main: Offering, alternate: Offering) {
	let {start: start1, end: end1} = main
	let {start: start2, end: end2} = alternate

	// removing the colon allows us to sort the times as strings
	// ie.,
	start1 = removeColon(start1)
	start2 = removeColon(start2)
	end1 = removeColon(end1)
	end2 = removeColon(end2)

	// const altStartsAfterMain      = start2 >= start1
	const altStartsBeforeMainEnds = start2 <= end1
	const altEndsAfterMainStarts = end2 >= start1
	// const altEndsBeforeMainEnds   = start2 <= end1

	if (altStartsBeforeMainEnds && altEndsAfterMainStarts) {
		return true
	}

	return false
}

export function checkCoursesForTimeConflicts(
	mainCourse: Course,
	altCourse: Course,
) {
	// Check the offerings from two courses against each other.
	// Returns *as soon as* two times conflict.

	let {offerings: mainOfferings} = mainCourse
	let {offerings: altOfferings} = altCourse

	if (!mainOfferings || !altOfferings) {
		return false
	}

	return mainOfferings.some(mainOffer =>
		// Two offerings cannot conflict if they are on different days
		altOfferings
			.filter(offer => offer.day === mainOffer.day)
			.some(altOffer =>
				checkOfferingForTimeConflict(mainOffer, altOffer),
			),
	)
}

export function findTimeConflicts(
	courses: Array<Course>,
): Array<Array<null | boolean>> {
	// results = [
	// 		[c1: null,  c2: false, c3: true ],
	// 		[c1: false, c2: null,  c3: false],
	// 		[c1: true,  c2: false, c3: null ],
	// ]

	// true = conflict; false = no conflict; null = same course

	let results = courses.map(c1 => {
		return courses.map(c2 => {
			if (c1 === c2) {
				return null
			}

			if (checkCoursesForTimeConflicts(c1, c2)) {
				return true
			}

			return false
		})
	})

	return results
}
