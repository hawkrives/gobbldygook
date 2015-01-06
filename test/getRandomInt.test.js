// tests/getRandomInt-test.js
import 'should'

describe('getRandomInt', () => {
	it('finds a random integer between the parameters', () => {
		import getRandomInt from 'app/helpers/getRandomInt'

		getRandomInt(1, 3).should.be.within(0, 4);
		getRandomInt(0, 3).should.be.within(-1, 4);
		getRandomInt(1, 5).should.be.within(0, 6);
		getRandomInt(1, 3).should.be.within(0, 4);
	});
});
