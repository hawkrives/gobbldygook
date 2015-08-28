import {courseDb, areaDb, studentDb, cacheDb} from '../../src/lib/db'
import endsWith from 'lodash/string/endsWith'
import 'isomorphic-fetch'

describe('db', () => {
	it('exports a courses database', () => {
		expect(courseDb).to.be.ok
	})
	it('exports an areas database', () => {
		expect(areaDb).to.be.ok
	})
	it('exports a students database', () => {
		expect(studentDb).to.be.ok
	})
	it('exports a cache database', () => {
		expect(cacheDb).to.be.ok
	})

	it('loads data from the remote server', done => {
		const helpers = require('../../src/lib/fetch-helpers')
		fetch('https://www.stolaf.edu/people/rives/courses/info.json')
			.then(helpers.status, err => {
				if (endsWith(err.message, 'reason: getaddrinfo ENOTFOUND www.stolaf.edu')) {}
				else {
					done(err)
				}
			})
			.then(() => {
				// we have network!
			})
			.then(done)
	})
})

describe('loadData', () => {
	it('removes all old courses from a term before adding the new set')
})

describe('course-database', () => {

})

describe('area-database', () => {

})

describe('student-database', () => {

})

describe('cache-database', () => {

})
