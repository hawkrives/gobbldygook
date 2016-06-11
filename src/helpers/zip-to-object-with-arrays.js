import {reduce, zip, has} from 'lodash-es'

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
