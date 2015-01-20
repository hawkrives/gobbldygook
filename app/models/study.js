import {contains} from 'lodash'
import Immutable from 'immutable'
import getArea from 'sto-areas'

let StudyRecord = Immutable.Record({
	id: '',
	type: '',
	abbr: '',
	title: '',
	index: 0,
	revisionYear: null,
	check: () => undefined,
})

class Study extends StudyRecord {
	constructor(args) {
		let {id, index, revisionYear} = args

		let {type, departmentAbbr, title, check} = getArea(id, revisionYear)
		// console.log('made a Study', id, title)

		super({
			id,
			type,
			title,
			index,
			check,
			revisionYear,
			abbr: departmentAbbr,
		})
	}

	reorder(newIndex) {
		this.set('index', newIndex)
	}

	toJSON() {
		let toKeep = ['id', 'index', 'revisionYear']
		let filtered = this
			.toMap()
			.filter((val, key) =>
				contains(toKeep, key))
		return filtered.toJS()
	}
}

export default Study
