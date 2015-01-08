import Immutable from 'immutable'
import stoAreas from 'sto-areas'

let StudyRecord = Immutable.Record({
	id: '',
	type: '',
	abbr: '',
	title: '',
	index: 0,
	check: () => undefined,
})

class Study extends StudyRecord {
	constructor(args, yearOfGraduation) {
		let {id, index} = args

		let {type, departmentAbbr, title, check} = stoAreas.find(id, yearOfGraduation)

		super({id, type, abbr: departmentAbbr, title, index, check})
	}

	reorder(newIndex) {
		this.set('index', newIndex)
	}
}

export default Study
