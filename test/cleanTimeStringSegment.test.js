// test/cleanTimeStringSegment.test.js
import cleanTimeStringSegment from '../lib/cleanTimeStringSegment'

describe('cleanTimeStringSegment', () => {
	it('trims up a timestring segment', () => {
		expect(cleanTimeStringSegment('    800AM   ')).to.equal('800AM')
	})

	it('capitalizes a timestring segment', () => {
		expect(cleanTimeStringSegment('800am')).to.equal('800AM')
	})
})
