'use strict';

import * as _ from 'lodash'
import emitter from '../helpers/emitter.es6'

let Study = (studyData) => {
	let study = {
		id: '',
		type: '',
		abbr: '',
		title: '',
		index: 0,
	}

	Object.defineProperty(study, 'reorder', { value(newIndex) {
		study.index = newIndex
	}})

	study.id = studyData.id || study.id
	study.type = studyData.type || study.type
	study.abbr = studyData.abbr || study.abbr
	study.title = studyData.title || study.title
	study.index = studyData.index || study.index

	return study
}

export default Study
