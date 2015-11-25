import Immutable from 'immutable'

import yaml from 'js-yaml'
import enhanceHanson from '../lib/enhance-hanson'
import findAreaPath from '../lib/find-area-path'
import isArray from 'lodash/lang/isArray'
import some from 'lodash/collection/some'
import max from 'lodash/collection/max'
const debug = require('debug')('gobbldygook:models')

export async function loadArea({name, type, revision, source, isCustom}) {
	if (isCustom && source) {
		return {...enhanceHanson(yaml.safeLoad(source), {topLevel: true}), source}
	}

	const db = require('../lib/db')

	if (!name) {
		throw new Error(`loadArea(): 'name' must be provided`)
	}
	if (!type) {
		throw new Error(`loadArea(): 'type' must be provided`)
	}

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

	const enhanced = enhanceHanson(data, {topLevel: true})

	return enhanced
}

export function buildAreaId({name, type, revision}) {
	return findAreaPath({name, type, revision})
}

export const StudyRecord = Immutable.Record({
	id: '',
	type: '',
	name: '',
	revision: null,
	isCustom: false,
	source: '',
	data: Promise.resolve({}),
})

export default class Study extends StudyRecord {
	constructor(args) {
		let {name, type, revision, isCustom, source} = args

		const data = loadArea({name, type, revision, source, isCustom})
			.catch(err => ({_error: err.message}))

		super({
			name,
			type,
			revision,
			isCustom,
			source,
			data,
			id: buildAreaId({name, type, revision}),
		})
	}

	edit(newSource) {
		debug('editing', this.name)
		debug(newSource)
		return this.withMutations(area => {
			area = area.set('source', newSource)
			area = area.set('isCustom', true)
			area = area.set('data', loadArea(area))
			return area
		})
	}

	toJSON() {
		return {
			type: this.type,
			name: this.name,
			revision: this.revision,
			isCustom: this.isCustom,
			source: this.source,
		}
	}
}
