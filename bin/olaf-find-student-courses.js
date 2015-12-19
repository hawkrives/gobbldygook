// Usage: ./bin/olaf-convert-semi-to-json ./playground/olaf-semicolons/sample-1.txt > blank.student
//        ./bin/olaf-find-student-courses blank.student

import nomnom from 'nomnom'

import {loadYamlFile} from './lib/read-file'
import populateCourses from './lib/populate-courses'
import simplifyCourse from '../src/area-tools/simplify-course'
import loadArea from './lib/load-area'
import evaluate from '../src/area-tools/evaluate'
import some from 'lodash/collection/some'
import forEach from 'lodash/collection/forEach'
import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import reject from 'lodash/collection/reject'
import pluck from 'lodash/collection/pluck'
import includes from 'lodash/collection/includes'
import repeat from 'lodash/string/repeat'
import find from 'lodash/collection/find'
import pairs from 'lodash/object/pairs'
import first from 'lodash/array/first'
import yaml from 'js-yaml'

async function populateStudent(filename) {
	let student
	try {
		student = await loadYamlFile(filename)
	}
	catch (err) {
		console.error('Problem loading student', err)
	}

	try {
		student.courses = await populateCourses(student)
	}
	catch (err) {
		console.error('Problem populating courses', err)
	}

	try {
		student.studies.push({type: "degree", name: "Bachelor of Arts"})
		student.areas = await Promise.all(student.studies.map(loadArea))
	}
	catch (err) {
		console.error('Problem loading areas', err)
	}

	return student
}

function prettyCourse(c) {
	return `${c.department.join('/')} ${c.number}${c.gereqs ? ` [${c.gereqs.join(' ')}]` : ''}`
}

function prettyCourseList(list) {
	return list.map(c => `  - ${prettyCourse(c)}`).join('\n')
}

function makeHeading(str) {
	return `${str}\n${repeat('=', str.length)}\n`
}

function evaluateStudentAgainstEachMajor(student) {
	// console.log('All Courses')
	// console.log(student.courses.map(prettyCourse).map(line => `- ${line}`).join('\n'))
	// console.log()

	const hasDegree = some(student.areas, {type: 'degree'})
	const degreeEvaluation = evaluate(student, find(student.areas, a => a.type === 'degree'))
	const countedTowardsDegree = [...degreeEvaluation.result._matches]
	// console.log(yaml.safeDump(degreeEvaluation))
	console.log(degreeEvaluation.Foundation['Studies in Physical Movement (SPM)'])

	return

	let countedTowardsMajors = {}
	let areas = student.areas
		.filter(a => a.type.toLowerCase() !== 'degree')
		.map(area => evaluate(student, area))

	areas.forEach(evaluated => {
		countedTowardsMajors[evaluated.name] = evaluated.result._matches
	})

	///

	let [name, coursesUsedInMajor] = first(pairs(countedTowardsMajors))


	let usedCourses = uniq([...coursesUsedInMajor, ...countedTowardsDegree], simplifyCourse)
	let usedClbids = pluck(usedCourses, 'clbid')
	let allCourses = uniq([...student.courses, ...usedCourses], simplifyCourse)
	console.log(usedCourses.length, allCourses.length)

	let unusedCourses = reject(
		uniq([...student.courses, ...flatten(countedTowardsMajors), ...countedTowardsDegree], simplifyCourse),
		c => includes(usedClbids, c.clbid))


	console.log(makeHeading(`${`Used for ${name}… (result: ${find(areas, {name}).computed})`}`))
	console.log(prettyCourseList(usedCourses))

	console.log(makeHeading('Not used:'))
	console.log(prettyCourseList(unusedCourses))

	console.log('actually used')
	console.log(prettyCourseList(coursesUsedInMajor))

	console.log('actually used 2')
	console.log(prettyCourseList(countedTowardsDegree))
}

export function cli() {
	const args = nomnom()
		.script('olaf-find-student-courses')
		.option('json', {
			flag: true,
			help: 'Print JSON structures',
		})
		.option('students', {
			required: true,
			metavar: 'FILE',
			help: 'The student file(s) to load',
			position: 0,
			list: true,
		})
		.parse()

	for (let student of args.students) {
		populateStudent(student)
			.then(evaluateStudentAgainstEachMajor)
	}
}
