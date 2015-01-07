import Immutable from 'immutable'

let StudyRecord = Immutable.Record({
	id: '',
	type: '',
	abbr: '',
	title: '',
	index: 0,
})

class Study extends StudyRecord {
	reorder(newIndex) {
		this.set('index', newIndex)
	}
}

export default Study
