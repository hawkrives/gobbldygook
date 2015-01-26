import Promise from 'bluebird'
import _ from 'lodash'
import Immutable from 'immutable'
import {isTrue} from 'sto-helpers/lib/is'
import checkStudentAgainstArea from './checkStudentAgainstArea'


/**
 * Checks a student objects graduation possibilities against all of its areas of study.
 *
 * @param {Student} student
 * @promise GraduatabilityPromise
 * @fulfill {Object} - The details of the students graduation prospects.
 *    {Boolean} graduatability
 *    {Immutable.List} areaDetails
 */
function checkStudentGraduatability(student) {
	let areaResults = student.studies.map((area) =>
		checkStudentAgainstArea(student, area)).toArray()
	// console.log('areaResults', student.studies.toArray(), areaResults)

	return Promise.all(areaResults).then((areas) => {
		let goodAreaCount = _(areas)
			.pluck('result')
			.filter(isTrue)
			.size()

		let graduatability = (goodAreaCount - _.size(areas)) === 0

		return {
			graduatability: graduatability,
			areaDetails: Immutable.List(areas),
		}
	})
}

export default checkStudentGraduatability
