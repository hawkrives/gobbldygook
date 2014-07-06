var _ = require('lodash')
var add = require('./add')

var countCredits = function(courses) {
	return _.reduce(_.pluck(courses, 'credits'), add)
}

module.exports = countCredits
