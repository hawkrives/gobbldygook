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

export function expandOldType(type) {
	if (type === 'm') {
		return 'major'
	}
	else if (type === 'c') {
		return 'concentration'
	}
	else if (type === 'd') {
		return 'degree'
	}
	else if (type === 'e') {
		return 'emphasis'
	}
}

export function expandOldName(name) {
	if (name === 'csci') {
		return 'Computer Science'
	}
	else if (name === 'math') {
		return 'Mathematics'
	}
	else if (name === 'phys') {
		return 'Physics'
	}
	else if (name === 'asian') {
		return 'Asian Studies'
	}
	else if (name === 'stat') {
		return 'Statistics'
	}
	else if (name === 'japan') {
		return 'Japan Studies'
	}
	else if (name === 'ba') {
		return 'Bachelor of Arts'
	}
}

export function expandOldRevisionYear(revisionYear) {
	return `${revisionYear}-${parseInt(String(revisionYear).slice(2, 4)) + 1}`
}

export function migrateFromOldSave({id, revisionYear}) {
	const [t, n] = id.split('-')
	const type = expandOldType(t)
	const name = expandOldName(n)
	const revision = expandOldRevisionYear(revisionYear)
	return {name, type, revision}
}

export default class Study extends StudyRecord {
	constructor(args) {
		let {name, type, revision, isCustom, source} = args

		// migrate from older area save style
		if ('id' in args) {
			debug(`Study(): migrating ${args.id}`);
			({name, type, revision} = migrateFromOldSave(args))
		}

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
