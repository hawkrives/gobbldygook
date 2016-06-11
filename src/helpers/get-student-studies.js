const Bluebird = require('bluebird')
import loadArea from './load-area'
import {map} from 'lodash-es'

export default function getStudentStudies(student, {cache=[], cacheOnly=false}) {
	const promises = map(student.studies,
		study => loadArea(study, {cache, cacheOnly}).catch(err => console.error(err)))

	return Bluebird.all(promises)
}
