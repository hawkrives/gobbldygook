import * as _ from 'lodash'

const DAYS = {
	M:  'Mo',
	T:  'Tu',
	W:  'We',
	Th: 'Th',
	F:  'Fr',
}

function findDays(daystring) {
	let listOfDays = []

	if (_.contains(daystring, '-')) {
		// M-F, M-Th, T-F
		let sequence = ['M', 'T', 'W', 'Th', 'F']
		let startDay = daystring.split('-')[0]
		let endDay = daystring.split('-')[1]
		listOfDays = sequence.slice(
			sequence.indexOf(startDay),
			sequence.indexOf(endDay) + 1
		)
	}
	else {
		// MTThFW or M/T/Th/F/W
		let spacedOutDays = daystring.replace(/([A-Z][a-z]?)\/?/g, '$1 ')
		// The regex sticks an extra space at the end. Remove it.
		spacedOutDays = spacedOutDays.substr(0, spacedOutDays.length - 1)
		listOfDays = spacedOutDays.split(' ')
	}

	// 'M' => 'Mo'
	return _.map(listOfDays, (day) => DAYS[day])
}

function cleanTimestringSegment(segment) {
	let uppercased = segment.toUpperCase()
	let trimmed = uppercased.trim()
	return trimmed
}

function findTimes(timestring) {
	timestring = timestring.replace(/:/g, '') // 8:00-9:25 => 800-925

	let endsInPM = false
	let startsInAM = false

	let split = timestring.split('-')
	let start = cleanTimestringSegment(split[0])
	let end = cleanTimestringSegment(split[1])

	if (start === '00' && end === '00') {
		return {start: 0, end: 2359}
	}

	let amPmRegex = /([AP])\.?M\.?/i
	let am = amPmRegex.exec(start)
	let pm = amPmRegex.exec(end)

	if (am) {
		startsInAM = true
		start = start.substring(0, am.index)
	}

	if (pm) {
		endsInPM = true
		end = end.substring(0, pm.index)
	}

	let startTime = parseInt(start, 10)
	let endTime = parseInt(end, 10)

	if (endTime <= 800) {
		// 'M 0100-0400'
		endsInPM = true
	}

	if (endTime < startTime) {
		// cannot end before it starts
		endsInPM = true
		endTime += 1200
	}

	if (endsInPM && endTime < 1200) {
		endTime += 1200
	}

	if (endsInPM && startTime < 700 && !startsInAM) {
		startTime += 1200
	}

	if ((endTime - startTime) > 1000 && !startsInAM) {
		// There are no courses that take this long.
		// There are some 6-hour ones in interim, though.
		startTime += 1200
	}

	return {
		start: startTime,
		end: endTime,
	}
}

function convertTimeStringsToOfferings(course) {
	let offerings = {}

	_.each(course.times, function(time) {
		let daystring = time.split(' ')[0]
		let timestring = time.split(' ')[1]

		let days = findDays(daystring)
		let times = findTimes(timestring)

		_.each(days, function(day) {
			if (!offerings[day]) {
				offerings[day] = {}
			}

			_.merge(offerings[day], {day: day, times: [times]},
				(a, b) => _.isArray(a) ? a.concat(b) : undefined)
		})
	})

	return _.toArray(offerings)
}

function checkCourseTimeConflicts(mainCourse, altCourse) {
	let conflict = false
	_.each(mainCourse.offerings, function(mainOffer) {
		_.each(altCourse.offerings, function(altOffer) {
			// Cannot conflict if on different days.
			if (mainOffer.day === altOffer.day) {
				_.each(mainOffer.times, function(mainTime) {
					_.each(altOffer.times, function(altTime) {
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

function checkScheduleTimeConflicts(courses) {
	// results = {
	// 		c1: {
	// 			c1: null,
	// 			c2: false,
	// 			c3: true
	// 		},
	// 		c2: {
	// 			c1: false,
	// 			c2: null,
	// 			c3: false
	// 		},
	// 		c3: {
	// 			c1: true,
	// 			c2: false,
	// 			c3: null,
	// 		}
	// }
	// true = conflict, false = no conflict, null = same course

	if (courses.toArray)
		courses = courses.toArray()

	let results = _.map(courses, (c1, c1idx) => {
		return _.map(courses, (c2, c2idx) => {
			let result = false
			if (c1 === c2)
				result = null
			else if (checkCourseTimeConflicts(c1, c2))
				result = true
			return result
		})
	})

	return results
}

export {
	findDays,
	findTimes,

	convertTimeStringsToOfferings,

	checkCourseTimeConflicts,
	checkScheduleTimeConflicts
}
