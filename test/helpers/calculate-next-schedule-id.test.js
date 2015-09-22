import {expect} from 'chai'
import calculateNextScheduleId from '../../src/helpers/calculate-next-schedule-id'

describe('calculateNextScheduleId', () => {
	it('calculates the next available schedule id', () => {
		let schedules = {
			'1': {'id': 1},
			'2': {'id': 2},
			'3': {'id': 3},
			'4': {'id': 4},
			'5': {'id': 5},
			'6': {'id': 6},
			'7': {'id': 7},
			'8': {'id': 8},
			'9': {'id': 9},
			'10': {'id': 10},
			'11': {'id': 11},
			'12': {'id': 12},
			'13': {'id': 13},
			'14': {'id': 14},
		}

		expect(calculateNextScheduleId(schedules)).to.equal(15)
	})
})
