import {contains} from 'lodash'
import Immutable from 'immutable'

import {status, text} from '../helpers/fetchHelpers'
import yaml from 'js-yaml'
import enhanceHanson from '../lib/enhance-hanson'
import pluralizeArea from '../lib/pluralize-area'
import kebabCase from 'lodash/string/kebabCase'

async function loadArea({name, type}) {
	const filepath = `./areas/${pluralizeArea(type)}/${kebabCase(name)}.yaml`
	const data = await fetch(filepath)
		.then(status)
		.then(text)
	const loaded = yaml.safeLoad(data)
	const enhanced = enhanceHanson(loaded, {topLevel: true})
	return enhanced
}

const StudyRecord = Immutable.Record({
	id: '',
	type: '',
	name: '',
	revision: null,
	data: Promise.resolve({}),
})

class Study extends StudyRecord {
	constructor({name, type, revision}={}) {
		// TODO: migration from older area save style

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
		const toKeep = ['type', 'name', 'revision', 'id']
		const filtered = this.toMap()
			.filter((val, key) => contains(toKeep, key))
		return filtered.toJS()
	}
}

export default Study
