import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import map from 'lodash/collection/map'

import {OrderedMap as $Map} from 'immutable'
import checkStudentAgainstArea from './check-student-against-area'


/**
 * Checks a student objects graduation possibilities against all of its areas of study.
 *
 * @param {Student} student - the student object
 * @returns {Promise} - the promise of knowledge
 * @promise GraduatabilityPromise
 * @fulfill {Object} - The details of the students graduation prospects.
 *    {boolean} graduatability
 *    {Immutable.Map} areaDetails
 */
async function checkStudentGraduatability(student) {
	console.log('checkStudentGraduatability()')

	const areaPromises = student.studies
		.map(area => checkStudentAgainstArea(student, area))
		.toArray()

	const areas = await* areaPromises

	const goodAreas = filter(areas, {computed: true})
	const graduatability = (size(goodAreas) === size(areas))

	const areaDetails = $Map(map(areas, area => [area.id, area]))

	return {
		canGraduate: graduatability,
		details: areaDetails,
	}
}

export default checkStudentGraduatability
