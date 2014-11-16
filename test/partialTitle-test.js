// tests/partialTitle-test.js
var should = require('should');

describe('partialTitle', function() {
	var courses = [];
	var _ = require('lodash');
	var partial = require('../app/helpers/partialTitle.es6');

	beforeEach(function() {
		courses = [
			{title: 'AsianCon3: Interpreting Asia'},
			{title: 'Introduction to Modern Dance'},
			{title: 'Hello world!'},
			{title: 'Fubar.'},
			{title: 'Modern Japanese Literature'},
		];
		courses = _.map(courses, function(c) {
			c.name = c.title;
			return c;
		})
	});

	it('checks if a course has a matching string in the title', function() {
		var partialTitle = partial.partialTitle;

		partialTitle('Asia', courses[0]).should.be.true;
		partialTitle('Dance', courses[1]).should.be.true;
		partialTitle('Japanese', courses[4]).should.be.true;
	});

	it('checks if a course has a matching string in the name', function() {
		var partialName = partial.partialName;

		partialName('Asia', courses[0]).should.be.true;
		partialName('Dance', courses[1]).should.be.true;
		partialName('Japanese', courses[4]).should.be.true;
	});

	it('checks if a course has a matching string in either the title or the name', function() {
		var partialNameOrTitle = partial.partialNameOrTitle;

		partialNameOrTitle('Asia', courses[0]).should.be.true;
		partialNameOrTitle('Dance', courses[1]).should.be.true;
		partialNameOrTitle('Japanese', courses[4]).should.be.true;
		partialNameOrTitle('China', courses[4]).should.be.false;
	});
});
