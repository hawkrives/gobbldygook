// Usage: ./bin/olaf-convert-semi-to-json ./playground/olaf-semicolons/sample-1.txt > blank.student
//        ./bin/olaf-find-student-courses blank.student

import nomnom from 'nomnom'

import { loadYamlFile } from '../cli/lib/read-file'
import populateCourses from '../cli/lib/populate-courses'
import { simplifyCourse, evaluate } from '../examine-student'
import loadArea from '../cli/lib/load-area'
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import reject from 'lodash/reject'
import map from 'lodash/map'
import includes from 'lodash/includes'
import repeat from 'lodash/repeat'
import find from 'lodash/find'
import toPairs from 'lodash/toPairs'
import head from 'lodash/head'

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
		student.studies.push({ type: 'degree', name: 'Bachelor of Arts' })
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
	const degreeEvaluation = evaluate(student, find(student.areas, a => a.type === 'degree'))
	const countedTowardsDegree = [...degreeEvaluation.result._matches]
	// console.log(yaml.safeDump(degreeEvaluation))

	let countedTowardsMajors = {}
	let areas = student.areas
		.filter(a => a.type.toLowerCase() !== 'degree')
		.map(area => evaluate(student, area))

	areas.forEach(evaluated => {
		countedTowardsMajors[evaluated.name] = evaluated.result._matches
	})

	///

	let [name, coursesUsedInMajor] = head(toPairs(countedTowardsMajors))

	let usedCourses = uniqBy([...coursesUsedInMajor, ...countedTowardsDegree], simplifyCourse)
	let usedClbids = map(usedCourses, c => c.clbid)

	let unusedCourses = reject(
		uniqBy([...student.courses, ...flatten(countedTowardsMajors), ...countedTowardsDegree], simplifyCourse),
		c => includes(usedClbids, c.clbid))

	console.log(makeHeading(`${`Used for ${name}… (result: ${find(areas, { name }).computed})`}`))
	console.log(prettyCourseList(usedCourses))
	console.log()

	console.log(makeHeading('Not used:'))
	console.log(prettyCourseList(unusedCourses))
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
