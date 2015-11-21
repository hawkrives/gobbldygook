import nomnom from 'nomnom'

import {loadYamlFile} from './lib/read-file'
import populateCourses from './lib/populate-courses'
import simplifyCourse from '../src/lib/simplify-course'
import loadArea from './lib/load-area'
import evaluate from '../src/lib/evaluate'
import some from 'lodash/collection/some'
import forEach from 'lodash/collection/forEach'
import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import reject from 'lodash/collection/reject'
import pluck from 'lodash/collection/pluck'
import includes from 'lodash/collection/includes'
import repeat from 'lodash/string/repeat'
import find from 'lodash/collection/find'

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
		student.areas = student.studies.map(loadArea)
	}
	catch (err) {
		console.error('Problem loading areas', err)
	}

	return student
}

function prettyCourse(c) {
	return `${c.department.join('/')} ${c.number}${c.gereqs ? ` [${c.gereqs.join(' ')}]` : ''}`
}

function evaluateStudentAgainstEachMajor(student) {
	console.log('All Courses')
	console.log(student.courses.map(prettyCourse).map(line => `- ${line}`).join('\n'))
	console.log()

	let used = []
	let usedIncludingDegrees = []

	const hasDegree = some(student.areas, {type: 'degree'})
	let countedTowardsDegree = []
	if (hasDegree) {
		const degreeEvaluation = evaluate(student, student.areas.find(a => a.type === 'degree'))
		countedTowardsDegree = degreeEvaluation.result._matches
	}
	countedTowardsDegree.forEach(c => usedIncludingDegrees.push(c))

	let countedTowardsMajors = {}
	student.areas = student.areas
		.filter(a => a.type.toLowerCase() !== 'degree')
		.map(area => evaluate(student, area))

	student.areas.forEach(evaluated => {
		countedTowardsMajors[evaluated.name] = evaluated.result._matches
	})

	forEach(countedTowardsMajors, (courses, name) => {
		const title = `Regarding ${name}… (result: ${find(student.areas, {name}).computed})`
		console.log(`${title}\n${repeat('=', title.length)}\n`)
		const usedCourses = uniq(courses, simplifyCourse)
		const usedClbids = pluck(usedCourses, 'clbid')
		const unusedCourses = reject(
			uniq([...student.courses, ...courses], simplifyCourse),
			c => includes(usedClbids, c.clbid))

		usedCourses.forEach(c => used.push(c))

		console.log(`Used:`)
		console.log(usedCourses.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
		console.log()
		console.log(`Not used:`)
		console.log(unusedCourses.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
		console.log()

		if (hasDegree) {
			const subtitle = `When factoring in the degree:`
			console.log(`${subtitle}\n${repeat('-', subtitle.length)}`)

			const usedCourses = uniq([...courses, ...countedTowardsDegree], simplifyCourse)
			const usedClbids = pluck(usedCourses, 'clbid')
			const unusedCourses = reject(
				uniq([...student.courses, ...courses, ...countedTowardsDegree], simplifyCourse),
				c => includes(usedClbids, c.clbid))

			usedCourses.forEach(c => usedIncludingDegrees.push(c))

			console.log(`Used:`)
			console.log(usedIncludingDegrees.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
			console.log()
			console.log(`Not used:`)
			console.log(unusedCourses.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
			console.log()
		}
	})

	used = uniq(used, 'clbid')

	const unusedCourses = reject(
		uniq([...student.courses, ...flatten(countedTowardsMajors), ...countedTowardsDegree], simplifyCourse),
		c => includes(pluck(used, 'clbid'), c.clbid))

	const remainingTitle = 'Not used for anything:'
	console.log(`${remainingTitle}\n${repeat('=', remainingTitle.length)}`)
	console.log(unusedCourses.map(prettyCourse).map(line => `  - ${line}`).join('\n'))
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
