import enhanceHanson from '../lib/enhance-hanson'
import includes from 'lodash/collection/includes'

export default async function loadArea(path) {
	const db = require('../lib/db')

	let data
	try {
		data = await db.store('areas').get(path)
		if (!data && includes(path, '?')) {
			data = await db.store('areas').get(path.split('?')[0])
		}
	}
	catch (err) {
		throw new Error(`Could not load area ${path}`)
	}

	if (typeof data === 'undefined') {
		throw new Error(`Could not find any areas with the query ${path}`)
	}

	return enhanceHanson(data, {topLevel: true})
}
