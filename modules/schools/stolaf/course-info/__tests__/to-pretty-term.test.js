import { expect } from 'chai'
import { toPrettyTerm } from '../to-pretty-term'

describe('toPrettyTerm', () => {
	it('converts a term id to a year and semester', () => {
		expect(toPrettyTerm(20141)).to.equal('Fall 2014—2015')
		expect(toPrettyTerm(20103)).to.equal('Spring 2010—2011')
		expect(toPrettyTerm(20135)).to.equal('Summer Session 2 2013—2014')
		expect(toPrettyTerm(20111)).to.equal('Fall 2011—2012')
		expect(toPrettyTerm(20316)).to.equal('Unknown (6) 2031—2032')
		expect(toPrettyTerm(20134)).to.equal('Summer Session 1 2013—2014')
	})
})
