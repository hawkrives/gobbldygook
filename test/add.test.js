// tests/add-test.js
import add from 'app/helpers/add'

describe('add', () => {
	it('adds 1 + 2 to equal 3', () => {
		add(1, 2).should.equal(3)
	})
})
