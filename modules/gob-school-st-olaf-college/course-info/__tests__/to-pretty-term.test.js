import {toPrettyTerm} from '../to-pretty-term'

describe('toPrettyTerm', () => {
	it('converts a term id to a year and semester', () => {
		expect(toPrettyTerm('2014FA')).toBe('Fall 2014—2015')
		expect(toPrettyTerm('2010SP')).toBe('Spring 2010—2011')
		//expect(toPrettyTerm(20135)).toBe('Summer Session 2 2013—2014')
		expect(toPrettyTerm('2011FA')).toBe('Fall 2011—2012')
		expect(toPrettyTerm('2018WI')).toBe('Winter 2018—2019')
		// expect(toPrettyTerm(20316)).toBe('Unknown (6) 2031—2032')
		// expect(toPrettyTerm(20134)).toBe('Summer Session 1 2013—2014')
	})
})
