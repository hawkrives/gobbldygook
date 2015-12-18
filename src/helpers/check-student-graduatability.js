import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import map from 'lodash/collection/map'

import checkStudentAgainstArea from './check-student-against-area'
import countCredits from '../area-tools/count-credits'


/**
 * Checks a student objects graduation possibilities against all of its areas of study.
 *
 * @param {Student} student - the student object
 * @returns {Promise} - the promise of knowledge
 * @promise GraduatabilityPromise
 * @fulfill {Object} - The details of the students graduation prospects.
 *    {boolean} graduatability
 *    {object} areaDetails
 */
export default async function checkStudentGraduatability(student) {
	const areaPromises = map(
		student.studies,
		area => checkStudentAgainstArea(student, area))

	const areaDetails = await Promise.all(areaPromises)

	const goodAreas = filter(areaDetails, {computed: true})
	const allAreasPass = (size(goodAreas) === size(areaDetails))

	const hasEnoughCredits = (countCredits(await student.courses) >= student.creditsNeeded)

	const graduatability = (allAreasPass && hasEnoughCredits)

	return {
		canGraduate: graduatability,
		details: areaDetails,
	}
}
