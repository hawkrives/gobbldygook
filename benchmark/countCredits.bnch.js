require('6to5/register')
var countCredits = require('app/helpers/countCredits')

suite('countCredits', function() {
	var courses = [
		{credits: 1},
		{credits: 0.25},
		{credits: 0.5},
		{credits: 0.75},
		{credits: 1},
	]

	bench('counting the number of credits', function() {
		countCredits(courses)
	})
})
