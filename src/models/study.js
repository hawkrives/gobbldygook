import findAreaPath from '../helpers/find-area-path'
import loadArea from './load-area'
import omit from 'lodash/object/omit'

export default function Study(data) {
	if (!(this instanceof Study)) {
		return new Study(data)
	}

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

	study.path = study.path || findAreaPath({name: study.name, type: study.type, revision: study.revision})

	study.data = loadArea(study.path)
		.catch(err => ({_error: err.message}))

	return study
}
