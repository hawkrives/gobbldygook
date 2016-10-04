import {reduce} from 'lodash'
import {zip} from 'lodash'
import {has} from 'lodash'

export function zipToObjectWithArrays(keys, vals) {
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
