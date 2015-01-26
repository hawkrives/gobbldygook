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
 */
function checkStudentGraduatability(student) {
	let areaResults = student.studies.map((area) => checkStudentAgainstArea(student, area)).toArray()
	// console.log('areaResults', student.studies.toArray(), areaResults)

	return Promise.all(areaResults).then((areas) => {
		let graduatability = (_(areas).pluck('result').filter(isTrue).size() - _.size(areas)) >= 1
		return {graduatability: graduatability, areaDetails: Immutable.List(areas)}
	})
}

export default checkStudentGraduatability
