'use strict';

import * as _ from 'lodash'

function findDays(daystring) {
	var expandedDays = {
		'M':  'Mo',
		'T':  'Tu',
		'W':  'We',
		'Th': 'Th',
		'F':  'Fr'
	}

	var listOfDays = [];

	if (_.contains(daystring, '-')) {
		// M-F, M-Th, T-F
		var sequence = ['M', 'T', 'W', 'Th', 'F']
		var startDay = daystring.split('-')[0]
		var endDay = daystring.split('-')[1]
		listOfDays = sequence.slice(
			sequence.indexOf(startDay),
			sequence.indexOf(endDay) + 1
		)
	} else {
		// MTThFW
		var spacedOutDays = daystring.replace(/([a-z]*)([A-Z])/g, '$1 $2')
		// The regex sticks an extra space at the front. trim() it.
		spacedOutDays = spacedOutDays.trim()
		listOfDays = spacedOutDays.split(' ')
	}

	return _.map(listOfDays, function(day) {
		// 'M' => 'Mo'
		return expandedDays[day]
	})
}

function findTimes(timestring) {
	if (_.contains(timestring, ':')) {
		// 8:00-9:25
		timestring = timestring.replace(/:/g, '')
	}

	var start = timestring.split('-')[0]
	var end = timestring.split('-')[1]
	var endsInPM = false

	if (start === '00' && end === '00') {
		return {start: 0, end: 2359}
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

	if (endsInPM && startTime < 700) {
		startTime += 1200
	}

	if ((endTime - startTime) > 1000) {
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

						if ((altTime.start >= mainTime.start && altTime.start <= mainTime.end) ||
							(altTime.end   >= mainTime.start && altTime.end   <= mainTime.end)) {
							conflict = true
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
	// 			c2: false,
	// 			c3: true
	// 		},
	// 		c2: {
	// 			c1: false,
	// 			c3: false
	// 		},
	// 		c3: {
	// 			c1: true,
	// 			c2: false,
	// 		}
	// }
	// true = conflict, false = no conflict

	var results = {}
	_.each(schedule, function(c1, c1idx) {
		var c1name = 'c' + c1idx
		results[c1name] = {}
		_.each(schedule, function(c2, c2idx) {
			var c2name = 'c' + c2idx

			if (c1 === c2) {
				return;
			} else if (checkCourseTimeConflicts(c1, c2)) {
				results[c1name][c2name] = true
			} else {
				results[c1name][c2name] = false
			}
		})
	})
	return results
}

function testCourseTimes() {
	var coursesWithTimes = [
		{times: ['F 0800-0855', 'F 0905-1000', 'F 1045-1140']},
		{times: ['M 0700-1000PM', 'MWF 0200-0255PM']},
		{times: ['M 0700-1000PM', 'MWF 1045-1140']},
		{times: ['M-F 0800-1000', 'M-F 0100-0300PM']},
		{times: ['MWF 0800-1000', 'MWF 1150-0150PM', 'Th 0800-0925',
			'Th 0935-1050', 'Th 1245-0205PM']},
		{times: ['M-F 0800-1000', 'MTThFW 1040-1240PM', 'M-F 0100-0300PM']},
		{times: ['Th 0700-0800']},
	]

	_.map(coursesWithTimes, convertTimeStringsToOfferings)
	var results = checkScheduleTimeConflicts(coursesWithTimes)

	_.each(results, function(value, compareOne) {
		_.each(value, function(result, withTwo) {
			if (result) {
				console.log(compareOne + ' conflicts with ' + withTwo)
			} else {
				console.log(compareOne + ' does not conflict with ' + withTwo)
			}
		})
	})
}

export {
	findDays,
	findTimes,

	convertTimeStringsToOfferings,

	checkCourseTimeConflicts,
	checkScheduleTimeConflicts,

	testCourseTimes
}
