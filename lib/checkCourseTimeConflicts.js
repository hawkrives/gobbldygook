import {forEach} from 'lodash'

function checkCourseTimeConflicts(mainCourse, altCourse) {
	let conflict = false

	forEach(mainCourse.offerings, (mainOffer) => {
		forEach(altCourse.offerings, (altOffer) => {
			// Cannot conflict if on different days.
			if (mainOffer.day === altOffer.day) {
				forEach(mainOffer.times, (mainTime) => {
					forEach(altOffer.times, (altTime) => {
						// let altStartsAfterMain      = altTime.start >= mainTime.start
						let altStartsBeforeMainEnds = altTime.start <= mainTime.end
						let altEndsAfterMainStarts  = altTime.end >= mainTime.start
						// let altEndsBeforeMainEnds   = altTime.end <= mainTime.end

						if (altStartsBeforeMainEnds && altEndsAfterMainStarts) {
							conflict = true
						}
					})
				})
			}
		})
	})

	return conflict
}

export default checkCourseTimeConflicts
