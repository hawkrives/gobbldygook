import {expect} from 'chai'
import hasGenEd from '../../src/helpers/has-gened'

describe('hasGenEd', () => {
	it('checks if a course has an FOL-* gened', () => {
		let course = {gereqs: ['FOL-J']}

		expect(hasGenEd('FOL', course)).to.be.true
	})

	it('can check for any gened', () => {
		let course = {gereqs: ['HWC']}
		let otherCourse = {gereqs: ['ALS-A']}

		expect(hasGenEd('HWC', course)).to.be.true
		expect(hasGenEd('ALS-A', otherCourse)).to.be.true
	})
})
