import {_, isUndefined} from 'lodash'
import {titleCase} from 'humanize-plus'
import {isTrue} from 'sto-helpers/lib/is'
import findResults from 'sto-helpers/lib/findResults'
import findWordForProgress from 'sto-helpers/lib/findWordForProgress'
import parseAreaId from 'sto-helpers/lib/parseAreaId'


/**
 * Controls the 'no result' result from areas of study.
 *
 * @param {String} id
 * @returns {Object}
 */
let noResult = (id) => {
	let {type, title} = parseAreaId(id)
	return Promise.resolve({
		id,
		type,
		title: titleCase(title),
		result: false,
		progress: {at: 0, of: 1, word: 'zero'},
		details: [{
			title: `${type} not found!`,
			description: `This ${type} could not be found.`,
		}],
	})
}


/**
 * Checks a student object against an area of study.
 *
 * @param {Object} student
 * @param {Object} area
 * @promise ResultsPromise
 * @fulfill {Object} - The details of the area check.
 */
function checkStudentAgainstArea(student, area) {
	let {id, title, type, check, abbr} = area

	if (type === 'not-found')
		return noResult(id)

	return check(student.data())
		.then((studentResults) => {
			let listOfResults = findResults(studentResults.details)

			let currentProgress = _(listOfResults).reject(isUndefined).filter(isTrue).size()
			let maxProgress = listOfResults.length
			let progressName = findWordForProgress(maxProgress, currentProgress)

			let progress = {at: currentProgress, of: maxProgress, word: progressName}

			let result = studentResults.result
			let details = studentResults.details

			return {id, title, type, progress, result, details}
		})
}

export default checkStudentAgainstArea
