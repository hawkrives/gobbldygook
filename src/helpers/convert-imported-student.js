// import db from './db'
import Student from '../models/student'
import Schedule from '../models/schedule'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import forEach from 'lodash/forEach'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'
import endsWith from 'lodash/endsWith'
import plur from 'plur'

export default function convertStudent({courses, degrees}) {
	let schedules = processSchedules(courses)
	let info = processDegrees(degrees)
	let fabrications = processFabrications(courses)

	let newStudent = Student({
		...info,
		schedules,
		fabrications,
	})

	return newStudent
}


function processFabrications(courses) {
	let onlyNonOlaf = filter(courses, ({term}) => endsWith(term, '9'))
	let fabrications = fromPairs(map(onlyNonOlaf, c => [c.clbid, c]))
	return fabrications

}


function processSchedules(courses) {
	let schedules = groupBy(courses, 'term')
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


function processDegrees(degrees) {
	let singularData = resolveSingularDataPoints(degrees)
	let studies = []

	for (let {concentrations, emphases, majors, degree} of degrees) {
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


function resolveSingularDataPoints(degrees) {
	let thereShouldOnlyBeOne = {
		names: map(degrees, d => d.name),
		advisors: map(degrees, d => d.advisor),
		matriculations: map(degrees, d => d.matriculation),
		graduations: map(degrees, d => d.graduation),
	}

	forEach(thereShouldOnlyBeOne, (group, name) => {
		let len = uniq(group).length
		if (len > 1) {
			throw new Error(`convertStudent: The student has more than one ${plur(name, 2)}: ${JSON.stringify(group)}`)
		}
		else if (!len) {
			throw new Error(`convertStudent: The student has zero ${plur(name, 0)}: ${JSON.stringify(group)}`)
		}
	})

	let name = thereShouldOnlyBeOne.names[0]
	let advisor = thereShouldOnlyBeOne.advisors[0]
	let matriculation = parseInt(thereShouldOnlyBeOne.matriculations[0], 10)
	let graduation = parseInt(thereShouldOnlyBeOne.graduations[0], 10)

	return {name, advisor, matriculation, graduation}
}
