import {curry, any, isArray, contains} from 'lodash'

let partialTitle = curry((partial, course) => {
	return contains(course.title, partial)
})

let partialName = curry((partial, course) => {
	return contains(course.name, partial)
})

let checkPartialNameOrTitle = curry((partial, course) => {
	return any([partialTitle(partial, course), partialName(partial, course)])
})

let partialNameOrTitle = curry((partial, course) => {
	if (isArray(partial))
		return any(partial, (p) => checkPartialNameOrTitle(p, course))
	return checkPartialNameOrTitle(partial, course)
})

export {
	partialTitle,
	partialName,
	partialNameOrTitle
}
