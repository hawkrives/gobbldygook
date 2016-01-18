import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import map from 'lodash/collection/map'

import checkStudentAgainstArea from './check-student-against-area'
import countCredits from '../area-tools/count-credits'
import getActiveStudentCourses from './get-active-student-courses'


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
export default function checkStudentGraduatability(student) {
	const areaPromises = map(student.areas, checkStudentAgainstArea(student))
	return Promise.all(areaPromises).then(details => {
		const goodAreas = filter(details, area => area._area && area._area.computed === true)
		const allAreasPass = (size(goodAreas) === size(details))

		const currentCredits = countCredits(getActiveStudentCourses(student))
		const hasEnoughCredits = (currentCredits >= student.creditsNeeded)

		const graduatability = (allAreasPass && hasEnoughCredits)

		return {
			...student,
			canGraduate: graduatability,
			areas: details,
		}
	})
}
