import findAreaPath from '../lib/find-area-path'
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

	baseStudy.path = findAreaPath(study.name, study.type, study.revision)

	const study = {
		...baseStudy,
		...data,
	}

	study.data = loadArea(study.path)
		.catch(err => ({_error: err.message}))

	return study
}
