import Immutable from 'immutable'

import yaml from 'js-yaml'
import enhanceHanson from '../lib/enhance-hanson'
import findAreaPath from '../lib/find-area-path'
import includes from 'lodash/collection/includes'
const debug = require('debug')('gobbldygook:models')

export async function loadArea({name, type, revision, source, isCustom}) {
	if (isCustom && source) {
		return {...enhanceHanson(yaml.safeLoad(source), {topLevel: true}), source}
	}

	const db = require('../lib/db')

	if (!name) {
		throw new Error(`loadArea(): 'name' must be provided`)
	}
	else if (!type) {
		throw new Error(`loadArea(): 'type' must be provided`)
	}

	const path = `${findAreaPath({name, type, revision})}.yaml`

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
