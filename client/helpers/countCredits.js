'use strict';

var _ = require('lodash')
var add = require('./add')

var countCredits = function(courses) {
	return _.chain(courses).pluck('credits').reduce(add).value()
}

module.exports = countCredits
