import getArea from './load-area'
import map from 'lodash/collection/map'

export default function getStudentStudies(student, {cache=[], cacheOnly=false}) {
	const promises = map(student.studies, study => getArea(study, {cache, cacheOnly}))
	return Promise.all(promises)
		.catch(err => {
			console.error(err)
		})
}
