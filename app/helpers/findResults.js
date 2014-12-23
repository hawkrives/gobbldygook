import {isArray, isObject, isBoolean, isUndefined} from 'lodash'
import * as _ from 'lodash'

function findResults(obj) {
	if (isArray(obj)) {
		return _(obj)
			.map(val => findResults(val))
			.flatten()
			.reject(isUndefined)
			.value()
	}
	else if (isObject(obj)) {
		return _(obj)
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
