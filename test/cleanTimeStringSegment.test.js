// test/cleanTimeStringSegment.test.js
import {expect} from 'chai'
import cleanTimeStringSegment from '../src/cleanTimeStringSegment'

describe('cleanTimeStringSegment', () => {
	it('trims up a timestring segment', () => {
		expect(cleanTimeStringSegment('    800AM   ')).to.equal('800AM')
	})

	it('capitalizes a timestring segment', () => {
		expect(cleanTimeStringSegment('800am')).to.equal('800AM')
	})
})
