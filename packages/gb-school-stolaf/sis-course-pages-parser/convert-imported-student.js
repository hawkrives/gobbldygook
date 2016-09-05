import {getCourse} from './get-courses'
import Bluebird from 'bluebird'
import Student from 'gb-student-format/student'
import Schedule from 'gb-student-format/schedule'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import forEach from 'lodash/forEach'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import plur from 'plur'
import filter from 'lodash/filter'
import {v4 as uuid} from 'uuid'

export default async function convertStudent({courses, degrees}) {
	let {
		schedulesAndFabrications,
		info,
	} = await Bluebird.props({
		schedulesAndFabrications: processSchedules(courses),
		info: processDegrees(degrees),
	})

	let {schedules, fabrications} = schedulesAndFabrications

	return Student({
		...info,
		schedules,
		fabrications,
	})
}


async function processSchedules(courses) {
	courses = await Bluebird.all(map(courses, course => {
		return getCourse(course).then(resolvedCourse => {
			if (resolvedCourse.error) {
				course._fabrication = true
				course.clbid = course.clbid || uuid()
				return course
			}
			return resolvedCourse
		})
	}))

	let fabrications = fromPairs(map(filter(courses, '_fabrication'), c => [c.clbid, c]))

	let schedules = groupBy(courses, 'term')
	schedules = map(schedules, (courses, term) => {
		term = String(term)
		return Schedule({
			courses,
			active: true,
			clbids: map(courses, c => c.clbid),
			year: parseInt(term.substr(0, 4), 10),
			semester: parseInt(term.substr(4, 1), 10),
		})
	})
	schedules = fromPairs(map(schedules, s => [s.id, s]))

	return {schedules, fabrications}
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
