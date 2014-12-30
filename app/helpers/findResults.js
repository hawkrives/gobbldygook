import {chain, isArray, isObject, isBoolean, isUndefined} from 'lodash'

function findResults(obj) {
	if (isArray(obj)) {
		return chain(obj)
			.map(val => findResults(val))
			.flatten()
			.reject(isUndefined)
			.value()
	}
	else if (isObject(obj)) {
		return chain(obj)
			.map((val, key, coll) => {
				if (key === 'result' && !coll.hasOwnProperty('details')) {
					return val
				}
				else if (key !== 'matches') {
					return findResults(val)
				}
			})
			.flatten()
			.reject(isUndefined)
			.value()
	}
	else if (isBoolean(obj)) {
		return obj // not an obj, don't process me
	}
}

export default findResults
