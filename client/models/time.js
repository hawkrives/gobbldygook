function findDays(daystring) {
	var expandedDays = {
		'M':  "Mo",
		'T':  "Tu",
		'W':  "We",
		'Th': "Th",
		'F':  "Fr"
	}

	var listOfDays = [];

	if ( _.contains(daystring, '-') ) {
		// M-F, M-Th, T-F
		var sequence = ["M", "T", "W", "Th", "F"]
		var startDay = daystring.split('-')[0]
		var endDay = daystring.split('-')[1]
		listOfDays = sequence.slice( sequence.indexOf(startDay), sequence.indexOf(endDay)+1 )
	} else {
		// MTThFW
		var spacedOutDays = daystring.replace(/([a-z]*)([A-Z])/g, "$1 $2")
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
	if ( _.contains(timestring, ':') ) {
		// 8:00-9:25
		timestring = timestring.replace(/:/g, '')
	}

	var start = timestring.split('-')[0]
	var end = timestring.split('-')[1]
	var endsInPM = false

	if ( _.contains(end, 'PM') ) {
		endsInPM = true
		end = end.substring(0, end.indexOf('PM'))
	}

	var startTime = parseInt(start, 10)
	var endTime = parseInt(end, 10)

	if (endTime < 700) {
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

	if (endsInPM && startTime < 730) {
		startTime += 1200
	}

	if ( (endTime - startTime) > 1000 ) {
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
	var offerings = {}

	_.each(course.times, function(time) {
		var dayString = time.split(' ')[0]
		var timeString = time.split(' ')[1]

		var times = findTimes(timeString)
		var days = findDays(dayString)

		_.each(days, function(day) {
			if ( !offerings[day] ) {
				offerings[day] = {}
			}

			_.merge(
				offerings[day],
				{
					day: day,
					times: [times]
				},
				function(a, b) {
					return _.isArray(a) ? a.concat(b) : undefined
				}
			);
		})
	})

	course.offerings = _.toArray(offerings)

	return course
}

function checkTimeConflicts(mainCourse, altCourse) {
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


function testCourseTimes() {
	var coursesWithTimes = [
		/*0*/ { times: ['F 0800-0855', 'F 0905-1000', 'F 1045-1140'] },
		/*1*/ { times: ['M 0700-1000PM', 'MWF 0200-0255PM'] },
		/*2*/ { times: ['M 0700-1000PM', 'MWF 1045-1140'] },
		/*3*/ { times: ['M-F 0800-1000', 'M-F 0100-0300PM'] },
		/*4*/ { times: ['MWF 0800-1000', 'MWF 1150-0150PM', 'Th 0800-0925', 'Th 0935-1050', 'Th 1245-0205PM'] },
		/*5*/ { times: ['M-F 0800-1000', 'MTThFW 1040-1240PM', 'M-F 0100-0300PM'] },
		/*6*/ { times: ['Th 0700-0800'] },
	]

	_.map(coursesWithTimes, convertTimeStringsToOfferings)

	_.each(coursesWithTimes, function(c1, c1idx) {
		var c1name = 'c' + String(c1idx)
		_.each(coursesWithTimes, function(c2, c2idx) {
			var c2name = 'c' + String(c2idx)

			if (c1 === c2) {
				console.log(c1name + ' is ' + c2name)
			} else if ( checkTimeConflicts(c1, c2) ) {
				console.log(c1name + ' conflicts with ' + c2name)
			} else {
				console.log(c1name + ' does not conflict with ' + c2name)
			}
		})
	})
}

