export function stringifyError(err, filter, space) {
	let plainObject = {}
	Object.getOwnPropertyNames(err).forEach(key => {
		plainObject[key] = err[key]
	})
	return JSON.stringify(plainObject, filter, space)
}
