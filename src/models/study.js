import Immutable from 'immutable'
import yaml from 'js-yaml'
import kebabCase from 'lodash/string/kebabCase'
import debug from 'debug'

import {status, text} from '../lib/fetch-helpers'
import enhanceHanson from '../lib/enhance-hanson'
import pluralizeArea from '../lib/pluralize-area'

const migrationLog = debug('gobbldygook:data-migration:study')

export async function loadArea({name, type}) {
	if (!name) {
		throw new Error(`loadArea(): 'name' must be provided`)
	}
	else if (!type) {
		throw new Error(`loadArea(): 'type' must be provided`)
	}
	const filepath = `./areas/${pluralizeArea(type)}/${kebabCase(name)}.yaml`
	const data = await fetch(filepath)
		.then(status)
		.then(text)
	const loaded = yaml.safeLoad(data)
	const enhanced = enhanceHanson(loaded, {topLevel: true})
	return enhanced
}

export const StudyRecord = Immutable.Record({
	id: '',
	type: '',
	name: '',
	revision: null,
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
		return 'Math'
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
		let {name, type, revision} = args

		// migrate from older area save style
		if ('id' in args) {
			migrationLog(`migrating ${args.id}`);
			({name, type, revision} = migrateFromOldSave(args))
		}

		const data = loadArea({name, type, revision})
		const id = `${kebabCase(name)}-${type}?rev=${revision}`

		super({
			type,
			name,
			revision,
			id,
			data,
		})
	}

	toJSON() {
		return {
			type: this.type,
			name: this.name,
			revision: this.revision,
		}
	}
}
