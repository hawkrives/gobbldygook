import Immutable from 'immutable'
import getArea from 'sto-areas'

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

		let {type, departmentAbbr, title, check} = getArea(id, yearOfGraduation)
		console.log('made a Study', id, title)

		super({
			id,
			type,
			title,
			index,
			check,
			abbr: departmentAbbr,
		})
	}

	reorder(newIndex) {
		this.set('index', newIndex)
	}
}

export default Study
