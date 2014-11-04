'use strict';

import * as _ from 'lodash'

var partialTitle = _.curry((partial, course) => {
	return _.contains(course.title, partial)
})

var partialName = _.curry((partial, course) => {
	return _.contains(course.name, partial)
})

var checkPartialNameOrTitle = _.curry((partial, course) => {
	return _.any([partialTitle(partial, course), partialName(partial, course)])
})

var partialNameOrTitle = _.curry((partial, course) => {
	if (_.isArray(partial))
		return _.any(partial, (p) => checkPartialNameOrTitle(p, course))
	return checkPartialNameOrTitle(partial, course)
})

export {
	partialTitle,
	partialName,
	partialNameOrTitle
}
