import map from 'lodash/collection/map'
import flatten from 'lodash/array/flatten'
import combinations from '../helpers/combinations'
import prepareCourseForQuery from './prepare-course-for-query'
import searchForCourseMatches from './search-for-course-matches'
import comboHasCourses from './combo-has-courses'
import {checkScheduleForTimeConflicts} from 'sto-sis-time-parser'

export default async function findScheduleFromCourses(courses) {
	// find all matches for each course
	let queryableCourses = map(courses, prepareCourseForQuery)
	// console.log(`queryableCourses for ${courses[0].term}`, queryableCourses)
	let matchPromises = map(queryableCourses, searchForCourseMatches)

	let matches = await Promise.all(matchPromises)

	// let start =  performance.now()
	matches = flatten(matches)

	// console.log(`individual results for ${courses[0].term}`, matches)
	if (!matches.length) {
		throw new Error('No Combo Possible')
	}

	// use combinations generator to iterate through all combos of matches
	let foundCombo = undefined

	for (let combo of combinations(matches, courses.length)) {
		// check each combo for time conflicts and existence of each deptnum
		// let start1 = performance.now()
		if (!comboHasCourses(queryableCourses, combo)) {
			// console.log(`combo did not have course`)
			continue
		}
		// console.log(`combo had course, after ${performance.now() - start1}`)
		// let start2 = performance.now()
		if (checkScheduleForTimeConflicts(combo)) {
			// console.log(`combo had time conflict`, checkScheduleForTimeConflicts(combo))
			continue
		}
		// console.log(`combo had no time conflicts, after ${performance.now() - start2}`)
		foundCombo = combo
		break
	}

	if (foundCombo) {
		// console.log(`${performance.now() - start}ms finished combo for ${courses[0].term}`, foundCombo)
		return foundCombo
	}
	else {
		throw new Error('No combination is possible from ' + JSON.stringify(matches))
	}
}
