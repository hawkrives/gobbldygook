var _ = require('lodash')

var partialTitle = _.curry(function(partial, course) {
	return _.contains(course.title, partial)
})

module.exports = partialTitle
