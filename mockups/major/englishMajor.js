import _ from 'lodash'

import hasDepartment from 'app/helpers/hasDepartment'
import {partialNameOrTitle} from 'app/helpers/partialTitle'
import {coursesAtLevel, coursesAtOrAboveLevel} from 'app/helpers/courseLevels'
import checkCoursesFor from 'app/helpers/checkCoursesFor'

import isRequiredCourse from 'sto-areas/lib/isRequiredCourse'
import hasDeptNumBetween from 'app/helpers/hasDeptNumBetween'

const ENGLISH_REQUIRED_COURSES = [
	{deptnum: 'ENGL 185'},
]

let isRequiredEnglishMajorCourse = isRequiredCourse(ENGLISH_REQUIRED_COURSES)

function crossCulturalStudies(courses) {
	// Any course from cross-cultural studies (ENGL 200 - 219)
	let subsetOfCourses = _(courses)
		.filter(hasDeptNumBetween({dept: 'ENGL', start: 200, end: 219}))
		.value()

	let fulfilledCrossCulturalStudies= _.filter([subsetOfCourses], (courses) => _.size(courses) >= 1)
	let fulfilledCrossCulturalStudiesCourses = _.flatten(fulfilledCrossCulturalStudies)

	let numberFulfilled = _.size(fulfilledCrossCulturalStudies)
	let numberNeeded = 1

	return {
		title: 'Cross-Cultural',
		type: 'object/number',
		description: 'One from Cross-Cultural studies',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: fulfilledCrossCulturalStudiesCourses
		}
	}
}


function literaryHistory(courses) {
	// Courses from literary history (ENGL 220 - 239)
	// One or two courses: one focusing on national literary tradition,
	// or examine literature from two or more nations.

	let subsetOfCourses = _.chain(courses)
		.filter(hasDeptNumBetween({dept: 'ENGL', start: 220, end: 239}))
		.value()

	let fulfilledLiteraryHistory= _.filter([subsetOfCourses], (courses) => _.size(courses) >= 1)
	let fulfilledLiteraryHistoryCourses = _.flatten(fulfilledLiteraryHistory)

	let numberFulfilled = _.size(fulfilledLiteraryHistory)
	let numberNeeded = 1
	
	return {
		title: 'Literary History',
		type: 'object/number',
		description: 'One national literary tradition or literature from two or more nations.',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: fulfilledLiteraryHistoryCourses,
		}
	}
}

function crossDisciplinaryOrGenre(courses) {
	// Courses from cross disc. (ENGL 260 - 279) or genre (ENGL 280 - 299)
	// One from either Cross-Disciplinary Studies or Genre
	// check cross-disciplinary
	let subsetOfCrossCourses = _.chain(courses)
		.filter(hasDeptNumBetween({dept: 'ENGL', start: 260, end: 279}))
		.value()

	let fulfilledCrossDisciplinary = _.filter([subsetOfCrossCourses], (courses) => _.size(courses) >= 1)
	let fulfilledCrossDisciplinaryCourses = _.flatten(fulfilledCrossDisciplinary)
	let numberCrossFulfilled = _.size(fulfilledCrossDisciplinaryCourses)

	// check genre
	let subsetOfGenreCourses = _.chain(courses)
		.filter(hasDeptNumBetween({dept: 'ENGL', start: 280, end: 299}))
		.value()

	let fulfilledGenre = _.filter([subsetOfGenreCourses], (courses) => _.size(courses) >= 1)
	let fulfilledGenreCourses = _.flatten(fulfilledGenre)
	let numberGenreFulfilled = _.size(fulfilledGenreCourses)
	
	let numberNeeded = 1

	// evaluating how many courses we have fulfilled between Cross Disc. and Genre
	let numberFulfilled = 0; 
	if (numberCrossFulfilled > 0) {
		numberFulfilled++
	}
	if (numberGenreFulfilled > 0) {
		numberFulfilled++
	}
	
	// concat the two results together
	let crossAndGenreCourses = fulfilledCrossDisciplinaryCourses.concat(fulfilledGenreCourses)

	return {
		title: 'Cross-Disciplinary or Genre',
		type: 'object/number',
		description: 'One from either Cross-Disciplinary or Genre',
		result: (numberCrossFulfilled >= numberNeeded || numberGenreFulfilled >= numberNeeded),
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: crossAndGenreCourses,
		}
	}
}

function requirement1800(courses) {
	// Fix me
	// Among all level II courses (category-specific and elective)
	// 1. One must be in literature before 1800
	// 2. One must be in literature after 1800
} 

function electives(courses) {
	// Courses from (ENGL 240 - 259)
	// Six electives, with stipulations:
	// 1. At least three Level II
	// 2. At least two Level III 
	// 3. An IS cannot count toward a Level II
	// 4. An IS, IR, nor English 396 can count for one of a student’s two Level III requirements
	let englishMajorElectives = _(courses)
		.filter(hasDeptNumBetween({dept: 'ENGL', start: 240, end: 259}))
		.reject(isRequiredEnglishMajorCourse)
		.value()

	let levelsTwo = _(englishMajorElectives)
		.reject(coursesAtLevel(298))
		.filter(coursesAtOrAboveLevel(200)).size().value() >= 3

	let levelsThree = _(englishMajorElectives)
		.reject(coursesAtLevel(298))
		.reject(coursesAtLevel(396))
		.reject(coursesAtLevel(398))
		.filter(coursesAtOrAboveLevel(300)).size().value() >= 2

		.filter(coursesAtLevel(100)).size().value() <= 2
	let onlyTwoAtLevelOne = _(englishMajorElectives)

	let electivesAreGood = _.all([levelsTwo, levelsThree, onlyTwoAtLevelOne])
	let matching = _.size(englishMajorElectives)
	let needs = 6

	let details = [
		levelsTwo,
		levelsThree,
		onlyTwoAtLevelOne,
	]
	
	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Six electives, with stipulations:\n- At least two at Level III\n- Of the two Level III courses, at least one in literature\n- An IS cannot count toward one of three required courses at Level II\n- An IS, IR, nor English 396 can count for one of a student’s two Level III requirements',
		result: (matching >= needs) && electivesAreGood,
		details: {
			has: matching,
			needs: needs,
			matches: englishMajorElectives
		}
	}
}


function checkEnglishMajor(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let englishMajorRequirements = [
			crossCulturalStudies(courses),
			literaryHistory(courses),
			crossDisciplinaryOrGenre(courses),
			//requirement1800(courses),			// fix me
			electives(courses),
		]

		return {
			result: _.all(englishMajorRequirements, 'result'),
			details: englishMajorRequirements
		}
	})
}

export default checkEnglishMajor
