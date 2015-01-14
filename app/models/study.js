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
}

export default Study
