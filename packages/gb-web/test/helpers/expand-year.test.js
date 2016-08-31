import {expect} from 'chai'
import expandYear from '../../src/helpers/expand-year'

describe('expandYear', () => {
	it('expands a year to year-(year+1)', () => {
		expect(expandYear(2014)).to.equal('2014—2015')
		expect(expandYear(2010)).to.equal('2010—2011')
		expect(expandYear(2013)).to.equal('2013—2014')
		expect(expandYear(2011)).to.equal('2011—2012')
		expect(expandYear(2031)).to.equal('2031—2032')
		expect(expandYear(2013)).to.equal('2013—2014')
	})

	it('can also do short expansions', () => {
		expect(expandYear(2014, true)).to.equal('2014—15')
		expect(expandYear(2010, true)).to.equal('2010—11')
		expect(expandYear(2013, true)).to.equal('2013—14')
		expect(expandYear(2011, true)).to.equal('2011—12')
		expect(expandYear(2031, true)).to.equal('2031—32')
		expect(expandYear(2013, true)).to.equal('2013—14')
	})

	it('can switch out the seperator char', () => {
		expect(expandYear(2014, false, '–')).to.equal('2014–2015')
		expect(expandYear(2010, true, '·')).to.equal('2010·11')
		expect(expandYear(2013, false, '-')).to.equal('2013-2014')
		expect(expandYear(2011, true, '/')).to.equal('2011/12')
		expect(expandYear(2031, false, '+')).to.equal('2031+2032')
		expect(expandYear(2013, true, '¿')).to.equal('2013¿14')
	})
})
