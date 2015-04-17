import size from 'lodash/collection/size'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'

import Immutable from 'immutable'
import {isTrue} from 'sto-helpers'
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
async function checkStudentGraduatability(student) {
	let areaResults = student.studies
		.map((area) =>
			checkStudentAgainstArea(student, area))
		.toArray()

	// console.log('areaResults', student.studies.toArray(), areaResults)

	let areas = await* areaResults

	let goodAreaCount = size(filter(pluck('result', areas), isTrue))

	let graduatability = (goodAreaCount - size(areas)) === 0

	return {
		graduatability: graduatability,
		areaDetails: Immutable.List(areas),
	}
}

export default checkStudentGraduatability
