import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import map from 'lodash/collection/map'
import zipObject from 'lodash/array/zipObject'

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

	const areas = await Promise.all(areaPromises)

	const goodAreas = filter(areas, {computed: true})
	const allAreasPass = (size(goodAreas) === size(areas))

	const hasEnoughCredits = (countCredits(await student.courses) >= student.creditsNeeded)

	const graduatability = (allAreasPass && hasEnoughCredits)

	const areaDetails = zipObject(map(areas, area => [area.id, area]))

	return {
		canGraduate: graduatability,
		details: areaDetails,
	}
}
