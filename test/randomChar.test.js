// tests/randomChar-test.js
import 'should'

describe('randomChar', () => {
	it('finds a random integer between the parameters', () => {
		import randomChar from 'app/helpers/randomChar'

		randomChar().should.match(/[a-z0-9]/)
		randomChar().should.match(/[a-z0-9]/)
	})
})
