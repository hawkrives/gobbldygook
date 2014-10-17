// __tests__/add-test.js
jest.dontMock('../../app/helpers/add');

describe('add', function() {
 it('adds 1 + 2 to equal 3', function() {
   var add = require('../../app/helpers/add');
   expect(add(1, 2)).toBe(3);
 });
});
