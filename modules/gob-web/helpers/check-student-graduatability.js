// @flow

import {checkStudentAgainstArea} from '../workers/check-student'
import {countCredits} from '@gob/examine-student'
import {getActiveCourses} from '@gob/object-student'

import type {HydratedStudentType} from '@gob/object-student'

// Checks a student objects graduation possibilities against all of its areas of study.
export async function checkStudentGraduatability(
	student: HydratedStudentType,
): Promise<HydratedStudentType> {
	let areaPromises = student.areas.map(area =>
		checkStudentAgainstArea(student, area),
	)

	let areaDetails = await Promise.all(areaPromises)

	let goodAreas = areaDetails.filter(
		(area: any) => area._area && area._area.computed === true,
	)
	let allAreasPass = goodAreas.length === areaDetails.length

	let currentCredits = countCredits(getActiveCourses(student))
	let hasEnoughCredits = currentCredits >= student.creditsNeeded

	let graduatability = allAreasPass && hasEnoughCredits

	let result = {
		...student,
		canGraduate: graduatability,
		areas: areaDetails,
	}

	return (result: any)
}
