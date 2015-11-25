import Immutable from 'immutable'
import loadArea from './load-area'
import findAreaPath from '../helpers/find-area-path'
const debug = require('debug')('gobbldygook:models')

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
