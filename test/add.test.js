// tests/add-test.js
import 'should'

describe('add', () => {
	it('adds 1 + 2 to equal 3', () => {
		import add from 'app/helpers/add'
		add(1, 2).should.equal(3)
	})
})
