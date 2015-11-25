import {enhance as enhanceHanson} from '../area-tools'
import isArray from 'lodash/lang/isArray'
import some from 'lodash/collection/some'
import max from 'lodash/collection/max'
import yaml from 'js-yaml'

export default async function loadArea({name, type, revision, source, isCustom}) {
	if (isCustom && source) {
		return {...enhanceHanson(yaml.safeLoad(source), {topLevel: true}), source}
	}

	const db = require('../helpers/db')

	let query = {name: [name], type: [type]}
	if (revision) {
		query.revision = [revision]
	}

	let data
	try {
		data = await db.store('areas').query(query)
	}
	catch (err) {
		throw new Error(`Could not find area ${JSON.stringify(query)}`)
	}

	if (isArray(data) && data.length) {
		if (some(data, possibility => 'dateAdded' in possibility)) {
			data = max(data, 'dateAdded')
		}
		else {
			data = max(data, possibility => possibility.sourcePath.length)
		}
	}

	if (typeof data === 'undefined' || isArray(data)) {
		throw new Error(`the area "${name}" (${type}) could not be found with the query {name: ${name}, type: ${type}, revision: ${revision}}`)
	}

	return enhanceHanson(data, {topLevel: true})
}
