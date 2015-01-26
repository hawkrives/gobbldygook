// test/findDays.test.js
import findDays from '../lib/findDays'

describe('findDays', () => {
	it('turns the day abbreviations into a list of unambiguous days', () => {
		expect(findDays('M')).to.eql(['Mo'])
		expect(findDays('T')).to.eql(['Tu'])
		expect(findDays('W')).to.eql(['We'])
		expect(findDays('Th')).to.eql(['Th'])
		expect(findDays('F')).to.eql(['Fr'])
	})

	it('handles hyphenated day sequences', () => {
		expect(findDays('M-F')).to.eql(['Mo', 'Tu', 'We', 'Th', 'Fr'])
		expect(findDays('M-Th')).to.eql(['Mo', 'Tu', 'We', 'Th'])
		expect(findDays('T-F')).to.eql(['Tu', 'We', 'Th', 'Fr'])
		expect(findDays('M-T')).to.eql(['Mo', 'Tu'])
	})

	it('handles strings of letters correctly', () => {
		expect(findDays('MTThFW')).to.eql(['Mo', 'Tu', 'Th', 'Fr', 'We'])
		expect(findDays('MTTh')).to.eql(['Mo', 'Tu', 'Th'])
		expect(findDays('ThFMT')).to.eql(['Th', 'Fr', 'Mo', 'Tu'])
		expect(findDays('ThFMT')).to.not.contain('We')
	})

	it('correctly parses every variant that the SIS contains', () => {
		expect(findDays('F')).to.eql(['Fr'])
		expect(findDays('M')).to.eql(['Mo'])
		expect(findDays('M-F')).to.eql(['Mo', 'Tu', 'We', 'Th', 'Fr'])
		expect(findDays('M-Th')).to.eql(['Mo', 'Tu', 'We', 'Th'])
		expect(findDays('MF')).to.eql(['Mo', 'Fr'])
		expect(findDays('MFW')).to.eql(['Mo', 'Fr', 'We'])
		expect(findDays('MT')).to.eql(['Mo', 'Tu'])
		expect(findDays('MTF')).to.eql(['Mo', 'Tu', 'Fr'])
		expect(findDays('MTTh')).to.eql(['Mo', 'Tu', 'Th'])
		expect(findDays('MTThF')).to.eql(['Mo', 'Tu', 'Th', 'Fr'])
		expect(findDays('MTThFW')).to.eql(['Mo', 'Tu', 'Th', 'Fr', 'We'])
		expect(findDays('MTW')).to.eql(['Mo', 'Tu', 'We'])
		expect(findDays('MTWF')).to.eql(['Mo', 'Tu', 'We', 'Fr'])
		expect(findDays('MTh')).to.eql(['Mo', 'Th'])
		expect(findDays('MW')).to.eql(['Mo', 'We'])
		expect(findDays('MWF')).to.eql(['Mo', 'We', 'Fr'])
		expect(findDays('MWFT')).to.eql(['Mo', 'We', 'Fr', 'Tu'])
		expect(findDays('MWTh')).to.eql(['Mo', 'We', 'Th'])
		expect(findDays('MWThF')).to.eql(['Mo', 'We', 'Th', 'Fr'])
		expect(findDays('T')).to.eql(['Tu'])
		expect(findDays('T-F')).to.eql(['Tu', 'We', 'Th', 'Fr'])
		expect(findDays('TTh')).to.eql(['Tu', 'Th'])
		expect(findDays('TThF')).to.eql(['Tu', 'Th', 'Fr'])
		expect(findDays('TW')).to.eql(['Tu', 'We'])
		expect(findDays('TWF')).to.eql(['Tu', 'We', 'Fr'])
		expect(findDays('TWTh')).to.eql(['Tu', 'We', 'Th'])
		expect(findDays('Th')).to.eql(['Th'])
		expect(findDays('W')).to.eql(['We'])
		expect(findDays('WF')).to.eql(['We', 'Fr'])
		expect(findDays('WTh')).to.eql(['We', 'Th'])
	})
})
