import _ from 'lodash'

import hasDepartment from 'app/helpers/hasDepartment'
import {partialNameOrTitle} from 'app/helpers/partialTitle'
import checkCoursesFor from 'app/helpers/checkCoursesFor'

import courseMatches from 'sto-areas/lib/courseMatches'
import isRequiredCourse from 'sto-areas/lib/isRequiredCourse'

const exerciseScienceRequiredCourses = [
	{deptnum: 'BIO 143'}, {deptnum: 'BIO 243'}, {deptnum: 'ESTH 110'}, {deptnum: 'ESTH 255'},
	{deptnum: 'ESTH 374'}, {deptnum: 'ESTH 375'}, {deptnum: 'ESTH 390'}, {deptnum: 'PSYCH 125'},
]

let isRequiredExerciseScienceCourse = _.curry(isRequiredCourse(exerciseScienceRequiredCourses))


function coreBiologyCourses(courses) {
	/*
		- Biology 143
		- Biology 243
	*/

	let anatAndPhys1 = checkCoursesFor(courses, {deptnum:'BIO 143'})

	let anatAndPhys2 = checkCoursesFor(courses, {deptnum:'BIO 243'})

	let requirements = [
		{
			title: 'Cells and Tissues',
			result: anatAndPhys1,
			description: '**Cells and Tissues:** Biology 143 *(Human Anatomy and Physiology)*',
		},
		{
			title: 'Organs and Organ Systems',
			result: anatAndPhys2,
			description: '**Organs and Organ Systems:** Biology 243 *(Human Anatomy and Physiology)*',
		},
	]

	return {
		title: 'Biology',
		type: 'array/boolean',
		description: '- **Cells and Tissues:** Biology 143 *(Human Anatomy and Physiology)*\n- **Organs and Organ Systems:** Biology 243 *(Human Anatomy and Physiology)*',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function corePsychologyCourses(courses) {
	/*
		- Psychology 125
	*/

	let principlesOfPsych = checkCoursesFor(courses, {deptnum:'PSYCH 125'})

	let requirements = [
		{
			title: 'Principles of Psychology',
			result: principlesOfPsych,
			description: '**Psychology:** Psychology 125 *(Principles of Psychology)',
		},
	]

	return {
		title: 'Psychology',
		type: 'array/boolean',
		description: '- **Psychology:** Psychology 125 *(Principles of Psychology)',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function coreCourses(courses) {
	/* Core courses:
		- Exercise Science Theory 110
		- Exercise Science Theory 255
		- Exercise Science Theory 374
		- Exercise Science Theory 375
		- Exercise Science Theory 390
	*/

	let nutrition = checkCoursesFor(courses, {deptnum:'ESTH 110'})

	let preventionAndCare = checkCoursesFor(courses, {deptnum:'ESTH 255'})

	let biomechanics = checkCoursesFor(courses, {deptnum:'ESTH 374'})

	let physOfExercise = checkCoursesFor(courses, {deptnum:'ESTH 375'})

	let exerciseScienceSeminar = checkCoursesFor(courses, {deptnum:'ESTH 390'})

	let requirements = [
		{
			title: 'Nutrition and Wellness',
			result: nutrition,
			description: '**Nutrition:** Exercise Science Theory 110 *(Nutrition and Wellness)*',
		},
		{
			title: 'Prevention and Care',
			result: preventionAndCare,
			description: '**Prevention and Care:** Exercise Science Theory 255 *(Prevention and Care of Athletic Injuries)*',
		},
		{
			title: 'Biomechanics',
			result: biomechanics,
			description: '**Biomechanics:** Exercise Science Theory 374',
		},
		{
			title: 'Physiology of Exercise',
			result: physOfExercise,
			description: '**Physiology of Exercise:** Exercise Science Theory 375',
		},
		{
			title: 'Exercise Science Seminar',
			result: exerciseScienceSeminar,
			description: '**Exercise Science Seminar:** Exercise Science Theory 390',
		},
	]

	return {
		title: 'Core',
		type: 'array/boolean',
		description: '- **Nurtrition:** Exercise Science Theory 110 *(Nutrition and Wellness)*\n- **Prevention and Care:** Exercise Science Theory 255 *(Prevention and Care of Athletic Injuries)*\n- **Biomechanics:** Exercise Science Theory 374 *(Biomechanics)*\n- **Physiology of Exercise:** Exercise Science Theory 375\n- **Exercise Science Seminar:** Exercise Science Theory 390',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	// Electives: any two from the following
	/*
		Neuroscience 239
		Exercise Science Theory 290
		Exercise Science Theory 376
		Psychology 230
		Psychology 241
		Psychology 247
		Statistics 110
		Statistics 212
		Statistics 214
	*/

	let validCourseQualifiers = [
		{deptnum:'NEURO 239'},
		{deptnum:'ESTH 290'},
		{deptnum:'ESTH 376'},
		{deptnum:'PSYCH 230'},
		{deptnum:'PSYCH 241'},
		{deptnum:'PSYCH 247'},
		{deptnum:'STAT 110'},
		{deptnum:'STAT 212'},
		{deptnum:'STAT 214'},
	]
	let validCourses = _.filter(courses, courseMatches(validDeptNums))

	let numberTaken = _.size(validCourses)
	let numberNeeded = 2

	return {
		title: 'Electives',
		type: 'object/number',
		description: '- **Neuroscience:** Neuroscience 239 *(Cellular and Molecular Neuroscience)*\n- **Sport Ethics:** Exercise Science Theory 290*(Sport Ethics in Society)*\n- **Fitness Assessment:** Exercise Science Theory 376 *(Fitness Assessment and Exercise Prescription)*\n- **Research Methods:** Psychology 230 *(Research Methods in Psychology)*\n- **Developmental Psychology:** Psychology 230\n- **Psychopathlogy:** Psychology 247\n -**Statisics:** Statistics 110 *(Principles of Statistics)*\n- **Science Statisics:** Statistics 212 *(Statistics for the Sciences)*\n- **Honors Statisics:** Statistics 214 *(Honors of Statistics)*\n',
		result: numberTaken >= numberNeeded,
		details: {
			has: numberTaken,
			needs: numberNeeded,
			matches: validCourses,
		},
	}
}

function checkExerciseScienceMajor(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let exericseScienceMajorRequirements = [
			coreBiologyCourses(courses),
			corePsychologyCourses(courses),
			coreCourses(courses),
			electiveCourses(courses),
		]

		return {
			result: _.all(exericseScienceMajorRequirements, 'result'),
			details: exericseScienceMajorRequirements,
		}
	})
}

let exerciseScienceMajor = {
	title: 'Exercise Science',
	type: 'major',
	id: 'm-esth',
	departmentAbbr: 'ESTH',

	check: checkExerciseScienceMajor,
	_requirements: {
		coreBiologyCourses,
		corePsychologyCourses,
		coreCourses,
		electiveCourses,
	},
}

export default exerciseScienceMajor
