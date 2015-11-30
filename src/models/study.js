import loadArea from '../helpers/load-area'
import omit from 'lodash/object/omit'

export default function Study(data) {
	let baseStudy = {
		type: null,
		name: null,
		revision: 'latest',

		source: '',
		data: Promise.resolve({}),

		toJSON() {
			return omit(this, value => value instanceof Promise)
		},
	}

	const study = {
		...baseStudy,
		...data,
	}

	study.data = loadArea(study)
		.catch(err => ({_error: err.message}))

	return study
}
