import reduce from 'lodash/collection/reduce'

export default function interpose(data, value) {
	const len = data.length
	return reduce(data, (arr, item, index) => {
		if (index < len - 1) {
			return arr.concat(item, value)
		}
		return arr.concat(item)
	}, [])
}
