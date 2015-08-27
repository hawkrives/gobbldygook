import flatten from 'lodash/array/flatten'
import isArray from 'lodash/lang/isArray'
import isBoolean from 'lodash/lang/isBoolean'
import isObject from 'lodash/lang/isObject'
import isUndefined from 'lodash/lang/isUndefined'
import map from 'lodash/collection/map'
import reject from 'lodash/collection/reject'

function checkIfShouldDescend(val, key, coll) {
	if (key === 'result' && !coll.hasOwnProperty('details')) {
		return val
	}
	else if (key !== 'matches') {
		return findResults(val)
	}
}

function findResults(obj) {
	if (isArray(obj)) {
		return reject(flatten(map(obj, findResults)), isUndefined)
	}
	else if (isObject(obj)) {
		return reject(flatten(map(obj, checkIfShouldDescend)), isUndefined)
	}
	else if (isBoolean(obj)) {
		return obj // not an obj, don't process me
	}
}

export default findResults
