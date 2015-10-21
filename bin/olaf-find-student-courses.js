import nomnom from 'nomnom'

import {loadYamlFile} from './lib/read-file'
import populateCourses from './lib/populate-courses'
import simplifyCourse from '../src/lib/simplify-course'
import loadArea from './lib/load-area'
import evaluate from '../src/lib/evaluate'
import forEach from 'lodash/collection/forEach'
import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import reject from 'lodash/collection/reject'
import pluck from 'lodash/collection/pluck'
import includes from 'lodash/collection/includes'

async function populateStudent(filename) {
	let student = await loadYamlFile(filename)
	student.courses = await populateCourses(student)
	student.areas = student.studies.map(loadArea)
	return student
}

function prettyCourse(c) {
	return `${c.department.join('/')} ${c.number}${c.gereqs ? ` [${c.gereqs.join(' ')}]` : ''}`
}

function evaluateStudentAgainstEachMajor(student) {
	let used = []
	const degreeEvaluation = evaluate(student, student.areas.find(a => a.type === 'degree'))
	const countedTowardsDegree = degreeEvaluation.result._matches
	countedTowardsDegree.forEach(c => used.push(c))

	let countedTowardsMajors = {}
	student.areas
		.filter(a => a.type.toLowerCase() !== 'degree')
		.map(area => evaluate(student, area))
		.forEach(evaluated => {
			countedTowardsMajors[evaluated.name] = evaluated.result._matches
		})

	forEach(countedTowardsMajors, (courses, name) => {
		const usedCourses = uniq([...courses, ...countedTowardsDegree], simplifyCourse)
		const unusedCourses = reject(
			uniq([...student.courses, ...courses, ...countedTowardsDegree], simplifyCourse),
			c => includes(pluck(usedCourses, 'clbid'), c.clbid))

		usedCourses.forEach(c => used.push(c))

		console.log(`Used for ${name} and degree:`)
		console.log(usedCourses.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
		console.log(`Not used for ${name} and degree:`)
		console.log(unusedCourses.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
	})

	used = uniq(used, 'clbid')

	const unusedCourses = reject(
		uniq([...student.courses, ...flatten(countedTowardsMajors), ...countedTowardsDegree], simplifyCourse),
		c => includes(pluck(used, 'clbid'), c.clbid))
	console.log(`Not used for anything:`)
	console.log(unusedCourses.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
}

export function cli() {
	const args = nomnom()
		.option('json', {
			flag: true,
			help: 'Print valid JSON objects',
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
