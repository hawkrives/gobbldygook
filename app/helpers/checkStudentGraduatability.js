import * as Promise from 'bluebird'
import * as Immutable from 'immutable'
import {isUndefined} from 'lodash'
import findResults from 'helpers/findResults'
import findWordForProgress from 'helpers/findWordForProgress'

let areas = Immutable.Map({
	// Degrees
	'd-ba': require('../../mockups/bachelorOfArts.es6').default,
	// 'd-bm': require('../../mockups/bachelorOfMusic.es6').default,

	// Majors
	// 'm-csci':  require('../../mockups/computerScience.es6').default,
	// 'm-asian': require('../../mockups/asianStudies.es6').default,
	// 'm-chem':  require('../../mockups/chemistry.es6').default,
	// 'm-phys':  require('../../mockups/physics.es6').default,

	// Concentrations
	// 'c-asian': require('../../mockups/asianStudiesConcentration.es6').default,
	// 'c-stat':  require('../../mockups/statisticsConcentration.es6').default,
	// 'c-chin':  require('../../mockups/chineseStudiesConcentration.es6').default,
	// 'c-japan': require('../../mockups/japaneseStudiesConcentration.es6').default,

	// Emphases
})

let noResult = (type, title, id) => {
	return {
		id: id,
		title: title,
		result: false,
		progress: {at: 0, of: 1, word: 'zero'},
		type: type,
		details: [{
			title: `${type} not found!`,
			description: `This ${type} could not be found.`,
		}],
	}
}

let isTrue = (val) => val === true

function checkStudentAgainstArea(student, area) {
	let title = area.title
	let type = area.type
	let id = area.id

	let areaChecker = areas.get(area.id)

	if (!areaChecker)
		return Promise.resolve(noResult(type, title, id))

	return areaChecker(student)
		.then((studentResults) => {
			let listOfResults = findResults(studentResults.details)

			let currentProgress = Immutable.List(listOfResults).filterNot(isUndefined).filter(isTrue).size
			let maxProgress = listOfResults.length
			let progressName = findWordForProgress(maxProgress, currentProgress)

			let progress = {at: currentProgress, of: maxProgress, word: progressName}

			let result = studentResults.result
			let details = studentResults.details

			return {id, title, type, progress, result, details}
		})
}

function checkStudentGraduatability(student) {
	let areaResults = student.studies.map((area) => checkStudentAgainstArea(student, area)).toArray()
	// console.log('areaResults', student.studies.toArray(), areaResults)

	return Promise.all(areaResults).then((areas) => {
		areas = Immutable.List(areas)
		let graduatability = (areas.map(a => a.result).filter(isTrue).size - areas.size) >= 1
		return {graduatability: graduatability, areaDetails: areas}
	})
}

export default checkStudentGraduatability
