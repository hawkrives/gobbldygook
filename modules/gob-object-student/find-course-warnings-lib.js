function checkOfferingForTimeConflict(main, alternate) {
	// let altStartsAfterMain      = alternate.start >= main.start
	let altStartsBeforeMainEnds = alternate.start <= main.end
	let altEndsAfterMainStarts  = alternate.end >= main.start
	// let altEndsBeforeMainEnds   = alternate.end <= main.end

	if (altStartsBeforeMainEnds && altEndsAfterMainStarts) {
		return true
	}

	return false
}

function checkCoursesForTimeConflicts(mainCourse, altCourse) {
	// Check the offerings from two courses against each other.
	// Returns *as soon as* two times conflict.

	return mainCourse.offerings.times.some(function (mainOffer) {
		// Two offerings cannot conflict if they are on different days
		return altCourse.offerings.times.some(function (altOffer) {
			if (altOffer.day !== mainOffer.day) {
				return false
			}
			return checkOfferingForTimeConflict(mainOffer, altOffer)
		})
	})
}

export function findScheduleTimeConflicts(courses) {
	// results = [
	//		[c1: null,  c2: false, c3: true],
	// 		[c1: false, c2: null,  c3: false],
	// 		[c1: true,  c2: false, c3: null],
	// ]
	// where true = conflict, false = no conflict, null = same course

	let results = courses.map(function (c1) {
		return courses.map(function (c2) {
			if (c1 === c2) {
				return null
			} else if (checkCoursesForTimeConflicts(c1, c2)) {
				return true
			} else {
				return false
			}
		})
	})

	return results
}
