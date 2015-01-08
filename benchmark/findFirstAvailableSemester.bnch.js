require('6to5-core/register')
var Immutable = require('immutable')
var findFirstAvailableSemester = require('app/helpers/findFirstAvailableSemester')

suite('findFirstAvailableSemester', function() {
	var schedules = [
		{'id': 14, 'year': 2012, 'semester': 1},
		{'id': 1, 'year': 2012, 'semester': 1},
		{'id': 2, 'year': 2012, 'semester': 2},
		{'id': 3, 'year': 2012, 'semester': 3},

		{'id': 4, 'year': 2013, 'semester': 1},
		{'id': 5, 'year': 2013, 'semester': 2},
		{'id': 6, 'year': 2013, 'semester': 5},

		{'id': 7, 'year': 2014, 'semester': 1},
		{'id': 8, 'year': 2014, 'semester': 2},
		{'id': 9, 'year': 2014, 'semester': 2},

		{'id': 12, 'year': 2015, 'semester': 2},
		{'id': 13, 'year': 2015, 'semester': 3},
		{'id': 11, 'year': 2015, 'semester': 4},
	]

	bench('takeing a list of schedules and finding the first open semester', function() {
		findFirstAvailableSemester(schedules, 2012)
	})
})
