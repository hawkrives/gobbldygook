import reduce from 'lodash/collection/reduce'
import zip from 'lodash/array/zip'
import has from 'lodash/object/has'

export default function zipToObjectWithArrays(keys, vals) {
	let arr = zip(keys, vals)

	return reduce(arr, (obj, [key, val]) => {
		if (has(obj, key)) {
			obj[key].push(val)
		}
		else {
			obj[key] = [val]
		}

		return obj
	}, {})
}
