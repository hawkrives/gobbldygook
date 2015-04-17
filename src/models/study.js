import {contains} from 'lodash'
import Immutable from 'immutable'
import getArea from 'sto-areas'

const StudyRecord = Immutable.Record({
	id: '',
	type: '',
	abbr: '',
	title: '',
	revisionYear: null,
	check: () => undefined,
})

class Study extends StudyRecord {
	constructor(args) {
		const {id, revisionYear} = args

		const {type, departmentAbbr, title, check} = getArea(id, revisionYear)
		// console.log('made a Study', id, title)

		super({
			id,
			type,
			title,
			check,
			revisionYear,
			abbr: departmentAbbr,
		})
	}

	toJSON() {
		const toKeep = ['id', 'revisionYear']
		const filtered = this.toMap()
			.filter((val, key) => contains(toKeep, key))
		return filtered.toJS()
	}
}

export default Study
