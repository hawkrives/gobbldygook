require('6to5/register')
var calculateNextScheduleId = require('app/helpers/calculateNextScheduleId')

suite('calculateNextScheduleId', function() {
	var schedules = {
		"1": {"id": 1},
		"2": {"id": 2},
	}

	bench('calculating the next available schedule id', function() {
		calculateNextScheduleId(schedules)
	})
})
