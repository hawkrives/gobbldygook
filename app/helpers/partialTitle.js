import * as _ from 'lodash'

let partialTitle = _.curry((partial, course) => {
	return _.contains(course.title, partial)
})

let partialName = _.curry((partial, course) => {
	return _.contains(course.name, partial)
})

let checkPartialNameOrTitle = _.curry((partial, course) => {
	return _.any([partialTitle(partial, course), partialName(partial, course)])
})

let partialNameOrTitle = _.curry((partial, course) => {
	if (_.isArray(partial))
		return _.any(partial, (p) => checkPartialNameOrTitle(p, course))
	return checkPartialNameOrTitle(partial, course)
})

export {
	partialTitle,
	partialName,
	partialNameOrTitle
}
