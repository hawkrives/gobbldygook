var _ = require('lodash')

var partialTitle = _.curry(function(partial, course) {
	return _.contains(course.title, partial)
})

var partialName = _.curry(function(partial, course) {
	return _.contains(course.name, partial)
})

var partialNameOrTitle = _.curry(function(partial, course) {
	return (partialTitle(partial, course) || partialName(partial, course))
})

module.exports.partialTitle = partialTitle
module.exports.partialName = partialName
module.exports.partialNameOrTitle = partialNameOrTitle
