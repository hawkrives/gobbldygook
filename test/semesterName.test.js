// tests/countCredits-test.js
import 'should'

describe('semesterName', () => {
	it('converts a semester number to a semester name', () => {
		import {semesterName} from 'app/helpers/semesterName'

		semesterName(0).should.equal('Unknown (0)')
		semesterName(1).should.equal('Fall')
		semesterName(2).should.equal('Interim')
		semesterName(3).should.equal('Spring')
		semesterName(4).should.equal('Early Summer')
		semesterName(5).should.equal('Late Summer')
	})
})

describe('toPrettyTerm', () => {
	it('converts a term id to a year and semester', () => {
		import {toPrettyTerm} from 'app/helpers/semesterName'

		toPrettyTerm(20141).should.equal('Fall 2014—2015')
		toPrettyTerm(20103).should.equal('Spring 2010—2011')
		toPrettyTerm(20135).should.equal('Late Summer 2013—2014')
		toPrettyTerm(20111).should.equal('Fall 2011—2012')
		toPrettyTerm(20316).should.equal('Unknown (6) 2031—2032')
		toPrettyTerm(20134).should.equal('Early Summer 2013—2014')
	})
})

describe('expandYear', () => {
	it('expands a year to year-(year+1)', () => {
		import {expandYear} from 'app/helpers/semesterName'

		expandYear(2014).should.equal('2014—2015')
		expandYear(2010).should.equal('2010—2011')
		expandYear(2013).should.equal('2013—2014')
		expandYear(2011).should.equal('2011—2012')
		expandYear(2031).should.equal('2031—2032')
		expandYear(2013).should.equal('2013—2014')
	})
})
