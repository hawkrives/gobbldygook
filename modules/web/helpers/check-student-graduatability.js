import Bluebird from 'bluebird'

import filter from 'lodash/filter'
import size from 'lodash/size'
import map from 'lodash/map'

import {checkStudentAgainstArea} from './check-student-against-area'
import {countCredits} from 'modules/core/examine-student'
import {getActiveStudentCourses} from './get-active-student-courses'


/**
 * Checks a student objects graduation possibilities against all of its areas of study.
 *
 * @param {Student} student - the student object, already loaded with courses and areas from the db
 * @returns {Promise} - the promise of knowledge
 * @promise GraduatabilityPromise
 * @fulfill {Object} - The details of the students graduation prospects.
 *    {boolean} canGraduate
 *    {object} details
 */
export function checkStudentGraduatability(student) {
	const areaPromises = map(student.areas, checkStudentAgainstArea(student))
	return Bluebird.all(areaPromises).then(areaDetails => {
		const goodAreas = filter(areaDetails, area => area._area && area._area.computed === true)
		const allAreasPass = (size(goodAreas) === size(areaDetails))

		const currentCredits = countCredits(getActiveStudentCourses(student))
		const hasEnoughCredits = (currentCredits >= student.creditsNeeded)

		const graduatability = (allAreasPass && hasEnoughCredits)

		return {
			...student,
			canGraduate: graduatability,
			areas: areaDetails,
		}
	})
}
