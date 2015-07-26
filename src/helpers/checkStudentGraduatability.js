import memoize from 'lodash/function/memoize'
import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import zipObject from 'lodash/array/zipObject'

import {Map} from 'immutable'
import checkStudentAgainstArea from './checkStudentAgainstArea'


/**
 * Checks a student objects graduation possibilities against all of its areas of study.
 *
 * @param {Student} student
 * @promise GraduatabilityPromise
 * @fulfill {Object} - The details of the students graduation prospects.
 *    {boolean} graduatability
 *    {Immutable.Map} areaDetails
 */
async function checkStudentGraduatability(student) {
	const areaPromises = student.studies
		.map(area => checkStudentAgainstArea(student, area))
		.toArray()

	const areas = await* areaPromises
	const areaDetails = Map(zipObject(areas.map(area => [area.id, area])))

	const goodAreas = filter(areas, {computed: true})
	const graduatability = (size(goodAreas) === size(areas))

	return {graduatability, areaDetails}
}

export default checkStudentGraduatability
// export default memoize(checkStudentGraduatability)
