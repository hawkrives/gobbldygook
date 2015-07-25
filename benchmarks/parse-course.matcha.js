require('babel/register')
var parse = require('../src/lib/parse-hanson-string').parse

suite('parse course-string', function() {
	bench('simple', function() {
		parse('CSCI 121')
	})

	bench('all fields', function() {
		parse('CSCI 121IL.*.2014.4')
	})
})
