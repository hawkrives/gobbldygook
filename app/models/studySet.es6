'use strict';

import * as _ from 'lodash'
import emitter from '../helpers/emitter'
import Study from './studyModel'

let StudySet = (studyData) => {
	let studies = {}

	Object.defineProperty(studies, 'byType', { get() {
		return _.groupBy(studies, 'type')
	}})

	Object.defineProperty(studies, 'create', { value(study) {
		let sched = new Study(study)
		studies[sched.id] = sched
	}})

	Object.defineProperty(studies, 'destroy', { value(id) {
		delete studies[id]
	}})

	Object.defineProperty(studies, 'destroyMultiple', { value(ids) {
		_.each(ids, studies.destroy)
	}})

	_.each(studyData, studies.create)

	return studies;
}

export default StudySet
