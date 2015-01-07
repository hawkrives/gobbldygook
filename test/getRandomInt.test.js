// tests/getRandomInt-test.js
import getRandomInt from 'app/helpers/getRandomInt'

describe('getRandomInt', () => {
	it('finds a random integer between the parameters', () => {

		getRandomInt(1, 3).should.be.within(0, 4);
		getRandomInt(0, 3).should.be.within(-1, 4);
		getRandomInt(1, 5).should.be.within(0, 6);
		getRandomInt(1, 3).should.be.within(0, 4);
	});
});
