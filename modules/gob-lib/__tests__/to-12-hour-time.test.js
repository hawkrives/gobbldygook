import {to12HourTime} from '../to-12-hour-time'

describe('to12HourTime', () => {
	it('should convert a 4-digit 24-hour number into a 12-hour timestring', () => {
		expect(to12HourTime('1:00')).toBe('1:00am')
		expect(to12HourTime('01:00')).toBe('1:00am')
		expect(to12HourTime('13:00')).toBe('1:00pm')
		expect(to12HourTime('13:45')).toBe('1:45pm')
	})

	it('should handle times > 2359 as being post-12pm', () => {
		expect(to12HourTime('25:01')).toBe('1:01pm')
	})
})
