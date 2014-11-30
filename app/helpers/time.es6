'use strict';

import * as _ from 'lodash'

const DAYS = {
	M:  'Mo',
	T:  'Tu',
	W:  'We',
	Th: 'Th',
	F:  'Fr',
}

function findDays(daystring) {
	let listOfDays = [];

	if (_.contains(daystring, '-')) {
		// M-F, M-Th, T-F
		let sequence = ['M', 'T', 'W', 'Th', 'F']
		let startDay = daystring.split('-')[0]
		let endDay = daystring.split('-')[1]
		listOfDays = sequence.slice(
			sequence.indexOf(startDay),
			sequence.indexOf(endDay) + 1
		)
		// MTThFW
		var spacedOutDays = daystring.replace(/([a-z]*)([A-Z])/g, '$1 $2')
		// The regex sticks an extra space at the front. trim() it.
		spacedOutDays = spacedOutDays.trim()
	}
	else {
		listOfDays = spacedOutDays.split(' ')
	}

	// 'M' => 'Mo'
	return _.map(listOfDays, (day) => DAYS[day])
}

function findTimes(timestring) {
	if (_.contains(timestring, ':')) {
		// 8:00-9:25
		timestring = timestring.replace(/:/g, '')
	}

	var start = timestring.split('-')[0].toUpperCase()
	var end = timestring.split('-')[1].toUpperCase()
	var endsInPM = false
    var startsInAM = false

	if (start === '00' && end === '00') {
		return {start: 0, end: 2359}
	}

	if (_.contains(start, 'AM')) {
		startsInAM = true
		start = start.substring(0, start.indexOf('AM'))
	}

	if (_.contains(end, 'PM')) {
		endsInPM = true
		end = end.substring(0, end.indexOf('PM'))
	}

	var startTime = parseInt(start, 10)
	var endTime = parseInt(end, 10)

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
		end: endTime
	}
}

function convertTimeStringsToOfferings(course) {
	let offerings = {}

	_.each(course.times, function(time) {
		let dayString = time.split(' ')[0]
		let timeString = time.split(' ')[1]

		let days = findDays(dayString)
		let times = findTimes(timeString)

		_.each(days, function(day) {
			if (!offerings[day]) {
				offerings[day] = {}
			}

			_.merge(offerings[day], {day: day, times: [times]},
				(a, b) => _.isArray(a) ? a.concat(b) : undefined);
		})
	})

	return _.toArray(offerings)
}

function checkCourseTimeConflicts(mainCourse, altCourse) {
	var conflict = false
	_.each(mainCourse.offerings, function(mainOffer) {
		_.each(altCourse.offerings, function(altOffer) {
			// Cannot conflict if on different days.
			if (mainOffer.day === altOffer.day) {
				_.each(mainOffer.times, function(mainTime) {
					_.each(altOffer.times, function(altTime) {
						// var altStartsAfterMain      = altTime.start >= mainTime.start
						var altStartsBeforeMainEnds = altTime.start <= mainTime.end
						var altEndsAfterMainStarts  = altTime.end >= mainTime.start
						// var altEndsBeforeMainEnds   = altTime.end <= mainTime.end

						if (altStartsBeforeMainEnds && altEndsAfterMainStarts) {
							conflict = true;
						}
					})
				})
			}
		})
	})
	return conflict
}

function checkScheduleTimeConflicts(schedule) {
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

	var results = []
	_.each(schedule, function(c1, c1idx) {
		results[c1idx] = []
		_.each(schedule, function(c2, c2idx) {
			var result;
			if (c1 === c2) {
				result = null
			} else if (checkCourseTimeConflicts(c1, c2)) {
				result = true
			} else {
				result = false
			}
			results[c1idx][c2idx] = result;
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
