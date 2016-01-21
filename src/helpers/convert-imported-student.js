// import db from './db'
import Student from '../models/student'
import Schedule from '../models/schedule'
import groupBy from 'lodash/collection/groupBy'
import map from 'lodash/collection/map'
import forEach from 'lodash/collection/forEach'
import uniq from 'lodash/array/uniq'
import fromPairs from 'lodash/array/fromPairs'

export default function convertStudent(partialStudent) {
	let schedules = processSchedules(partialStudent)
	let info = processDegrees(partialStudent)

	let newStudent = Student({
		...info,
		schedules,
	})

	return newStudent
}


function processSchedules(student) {
	let schedules = groupBy(student.courses, 'term')
	schedules = map(schedules, (courses, term) => {
		term = String(term)
		return Schedule({
			active: true,
			clbids: map(courses, c => c.clbid),
			year: parseInt(term.substr(0, 4), 10),
			semester: parseInt(term.substr(4, 1), 10),
		})
	})
	schedules = fromPairs(map(schedules, s => [s.id, s]))
	return schedules
}


function processDegrees(student) {
	let singularData = resolveSingularDataPoints(student)
	let studies = []

	for (let {concentrations, emphases, majors, degree} of student.degrees) {
		studies.push({name: degree, type: 'degree', revision: 'latest'})
		studies = studies.concat(majors.map(name =>         ({name, type: 'major', revision: 'latest'})))
		studies = studies.concat(concentrations.map(name => ({name, type: 'concentration', revision: 'latest'})))
		studies = studies.concat(emphases.map(name =>       ({name, type: 'emphasis', revision: 'latest'})))
	}

	return {
		...singularData,
		studies,
	}
}


function resolveSingularDataPoints(student) {
	let thereShouldOnlyBeOne = {
		names: map(student.degrees, d => d.name),
		advisors: map(student.degrees, d => d.advisor),
		matriculations: map(student.degrees, d => d.matriculation),
		graduations: map(student.degrees, d => d.graduation),
	}

	forEach(thereShouldOnlyBeOne, (group, name) => {
		if (uniq(group).length !== 1) {
			throw new Error(`convertStudent: The student has more than one ${name}: ${JSON.stringify(group)}`)
		}
	})

	let name = thereShouldOnlyBeOne.names[0]
	let advisor = thereShouldOnlyBeOne.advisors[0]
	let matriculation = parseInt(thereShouldOnlyBeOne.matriculations[0], 10)
	let graduation = parseInt(thereShouldOnlyBeOne.graduations[0], 10)

	return {name, advisor, matriculation, graduation}
}
