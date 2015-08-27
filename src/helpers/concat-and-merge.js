import isArray from 'lodash/lang/isArray'
import isObject from 'lodash/lang/isObject'
import merge from 'lodash/object/merge'

export default function concatAndMerge(a, b) {
	if (isArray(a)) {
		return a.concat(b)
	}
	else if (isObject(a)) {
		return merge(a, b, concatAndMerge)
	}

	return b
}
