function checkOfferingForTimeConflict(main, alternate) {
	// const altStartsAfterMain      = alternate.start >= main.start
	const altStartsBeforeMainEnds = alternate.start <= main.end
	const altEndsAfterMainStarts  = alternate.end >= main.start
	// const altEndsBeforeMainEnds   = alternate.end <= main.end

	if (altStartsBeforeMainEnds && altEndsAfterMainStarts) {
		return true
	}

	return false
}

export default function checkCoursesForTimeConflicts(mainCourse, altCourse) {
	// Check the offerings from two courses against each other.
	// Returns *as soon as* two times conflict.
	return mainCourse.offerings
		.some(mainOffer =>
			// Two offerings cannot conflict if they are on different days
			altCourse.offerings
				.filter(offer => offer.day === mainOffer.day)
				.some(altOffer =>
					mainOffer.times.some(mainTime =>
						altOffer.times.some(altTime =>
							checkOfferingForTimeConflict(mainTime, altTime)))))
}
