// sto-areas/test/lib-countGeneds.test.js
import should from 'should'
import findAreaOfStudy from '../index'

describe('findAreaOfStudy', () => {
	it('finds an area of study from an id', () => {
		let id = 'm-csci'
		let year = 2014

		findAreaOfStudy(id, year).should.be.ok
	})

	it('uses on the yearOfMatriculation parameter to find them within a span of years', () => {
		let id = 'm-csci'
		let year = 2014

		findAreaOfStudy(id, year).should.be.ok
	})

	it('doesn\'t return areas outside of the time range', () => {
		let id = 'm-csci'
		let year = 2013

		findAreaOfStudy(id, year).type.should.equal('not-found')
	})
})
