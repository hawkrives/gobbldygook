// tests/is-test.js
import 'should'

describe('isTrue', () => {
	it('checks if a thing is true', () => {
		import {isTrue} from 'app/helpers/is'
		isTrue(1).should.be.false
		isTrue(true).should.be.true
	})
})
