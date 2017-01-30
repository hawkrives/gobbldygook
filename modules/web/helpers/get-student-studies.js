import loadArea from './load-area'
import map from 'lodash/map'
import debug from 'debug'
const log = debug('web:load-student')

export function getStudentStudies(student, { cache=[], cacheOnly=false }) {
	const promises = map(student.studies,
		study => loadArea(study, { cache, cacheOnly }).catch(err => log(err)))

	return Promise.all(promises)
}
