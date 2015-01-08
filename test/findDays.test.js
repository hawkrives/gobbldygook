// test/findDays.test.js
import findDays from '../lib/findDays'

describe('findDays', () => {
	it('turns the day abbreviations into a list of unambiguous days', () => {
		findDays('M').should.eql(['Mo'])
		findDays('T').should.eql(['Tu'])
		findDays('W').should.eql(['We'])
		findDays('Th').should.eql(['Th'])
		findDays('F').should.eql(['Fr'])
	})

	it('handles hyphenated day sequences', () => {
		findDays('M-F').should.eql(['Mo', 'Tu', 'We', 'Th', 'Fr'])
		findDays('M-Th').should.eql(['Mo', 'Tu', 'We', 'Th'])
		findDays('T-F').should.eql(['Tu', 'We', 'Th', 'Fr'])
		findDays('M-T').should.eql(['Mo', 'Tu'])
	})

	it('handles strings of letters correctly', () => {
		findDays('MTThFW').should.eql(['Mo', 'Tu', 'Th', 'Fr', 'We'])
		findDays('MTTh').should.eql(['Mo', 'Tu', 'Th'])
		findDays('ThFMT').should.eql(['Th', 'Fr', 'Mo', 'Tu'])
		findDays('ThFMT').should.not.containEql('We')
	})

	it('correctly parses every variant that the SIS contains', () => {
		findDays('F').should.eql(['Fr'])
		findDays('M').should.eql(['Mo'])
		findDays('M-F').should.eql(['Mo', 'Tu', 'We', 'Th', 'Fr'])
		findDays('M-Th').should.eql(['Mo', 'Tu', 'We', 'Th'])
		findDays('MF').should.eql(['Mo', 'Fr'])
		findDays('MFW').should.eql(['Mo', 'Fr', 'We'])
		findDays('MT').should.eql(['Mo', 'Tu'])
		findDays('MTF').should.eql(['Mo', 'Tu', 'Fr'])
		findDays('MTTh').should.eql(['Mo', 'Tu', 'Th'])
		findDays('MTThF').should.eql(['Mo', 'Tu', 'Th', 'Fr'])
		findDays('MTThFW').should.eql(['Mo', 'Tu', 'Th', 'Fr', 'We'])
		findDays('MTW').should.eql(['Mo', 'Tu', 'We'])
		findDays('MTWF').should.eql(['Mo', 'Tu', 'We', 'Fr'])
		findDays('MTh').should.eql(['Mo', 'Th'])
		findDays('MW').should.eql(['Mo', 'We'])
		findDays('MWF').should.eql(['Mo', 'We', 'Fr'])
		findDays('MWFT').should.eql(['Mo', 'We', 'Fr', 'Tu'])
		findDays('MWTh').should.eql(['Mo', 'We', 'Th'])
		findDays('MWThF').should.eql(['Mo', 'We', 'Th', 'Fr'])
		findDays('T').should.eql(['Tu'])
		findDays('T-F').should.eql(['Tu', 'We', 'Th', 'Fr'])
		findDays('TTh').should.eql(['Tu', 'Th'])
		findDays('TThF').should.eql(['Tu', 'Th', 'Fr'])
		findDays('TW').should.eql(['Tu', 'We'])
		findDays('TWF').should.eql(['Tu', 'We', 'Fr'])
		findDays('TWTh').should.eql(['Tu', 'We', 'Th'])
		findDays('Th').should.eql(['Th'])
		findDays('W').should.eql(['We'])
		findDays('WF').should.eql(['We', 'Fr'])
		findDays('WTh').should.eql(['We', 'Th'])
	})
})
