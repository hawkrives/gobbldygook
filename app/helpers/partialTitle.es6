'use strict';

import * as _ from 'lodash'

var partialTitle = _.curry(function(partial, course) {
	return _.contains(course.title, partial)
})

var partialName = _.curry(function(partial, course) {
	return _.contains(course.name, partial)
})

var partialNameOrTitle = _.curry(function(partial, course) {
	return (partialTitle(partial, course) || partialName(partial, course))
})

export {
	partialTitle,
	partialName,
	partialNameOrTitle
}
