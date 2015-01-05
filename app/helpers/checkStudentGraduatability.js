import * as Promise from 'bluebird'
import * as Immutable from 'immutable'
import {isUndefined} from 'lodash'

import findResults from 'app/helpers/findResults'
import findWordForProgress from 'app/helpers/findWordForProgress'
import * as stoAreas from 'sto-areas'

let areas = Immutable.Map({
	// Degrees
	'd-ba': stoAreas.degree.bachelorOfArts,
	// 'd-bm': stoAreas.degree.bachelorOfMusic,

	// Majors
	'm-csci':  stoAreas.major.computerScience,
	'm-asian': stoAreas.major.asianStudies,
	'm-chem':  stoAreas.major.chemistry,
	'm-phys':  stoAreas.major.physics,
	'm-math':  stoAreas.major.mathematics,

	// Concentrations
	'c-asian': stoAreas.concentration.asianStudies,
	'c-stat':  stoAreas.concentration.statistics,
	'c-chin':  stoAreas.concentration.chinaStudies,
	'c-japan': stoAreas.concentration.japanStudies,

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
