// @flow
import reduce from 'lodash/reduce'
import zip from 'lodash/zip'
import has from 'lodash/has'

export function zipToObjectWithArrays<T>(keys: string[], vals: T[]): {[key: string]: Array<T>} {
	let arr = zip(keys, vals)

	return reduce(arr, (obj, [ key, val ]) => {
		if (has(obj, key)) {
			obj[key].push(val)
		}
		else {
			obj[key] = [ val ]
		}

		return obj
	}, {})
}
