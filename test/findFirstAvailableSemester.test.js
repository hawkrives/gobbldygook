// tests/findFirstAvailableSemester-test.js
import Immutable from 'immutable'
import findFirstAvailableSemester from 'app/helpers/findFirstAvailableSemester'

describe('findFirstAvailableSemester', () => {
	let schedules = Immutable.List([
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
	])

	it('takes a list of schedules and finds the first open semester', () => {
		findFirstAvailableSemester(schedules, 2012).should.equal(4)
		findFirstAvailableSemester(schedules, 2013).should.equal(3)
		findFirstAvailableSemester(schedules, 2014).should.equal(3)
		findFirstAvailableSemester(schedules, 2015).should.equal(1)
		findFirstAvailableSemester(schedules, 2016).should.equal(1)
	})
})
