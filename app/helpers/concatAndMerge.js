import {isArray, isObject, merge} from 'lodash'

function concatAndMerge(a, b) {
	if (isArray(a))
		return a.concat(b)
	else if (isObject(a))
		return merge(a, b, concatAndMerge)

	return b
}

export default concatAndMerge
