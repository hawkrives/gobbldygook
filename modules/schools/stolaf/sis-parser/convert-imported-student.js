import { Student, Schedule } from 'modules/core/student-format'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import forEach from 'lodash/forEach'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'
import uuid from 'uuid/v4'

export function convertStudent({ courses, degrees }, getCourse) {
	return Promise.all([
		processSchedules(courses, getCourse),
		processDegrees(degrees),
	]).then(([ schedulesAndFabrications, info ]) => {
		let { schedules, fabrications } = schedulesAndFabrications

		return Student({
			...info,
			schedules,
			fabrications,
		})
	})
}


export function processSchedules(courses, getCourse) {
	return Promise.all(map(courses, course => {
		return getCourse(course).then(resolvedCourse => {
			if (resolvedCourse.error) {
				course._fabrication = true
				course.clbid = course.clbid || uuid()
				return course
			}
			return resolvedCourse
		})
	})).then(courses => {
		let fabrications = fromPairs(map(filter(courses, '_fabrication'), c => [ c.clbid, c ]))

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
		schedules = fromPairs(map(schedules, s => [ s.id, s ]))

		return { schedules, fabrications }
	})
}


export function processDegrees(degrees) {
	let singularData = resolveSingularDataPoints(degrees)
	let studies = []

	for (let { concentrations, emphases, majors, degree } of degrees) {
		studies.push({ name: degree, type: 'degree', revision: 'latest' })
		studies = studies.concat(majors.map(name =>         ({ name, type: 'major', revision: 'latest' })))
		studies = studies.concat(concentrations.map(name => ({ name, type: 'concentration', revision: 'latest' })))
		studies = studies.concat(emphases.map(name =>       ({ name, type: 'emphasis', revision: 'latest' })))
	}

	return {
		...singularData,
		studies,
	}
}


export function resolveSingularDataPoints(degrees) {
	let thereShouldOnlyBeOne = {
		names: map(degrees, d => d.name),
		advisors: map(degrees, d => d.advisor),
		matriculations: map(degrees, d => d.matriculation),
		graduations: map(degrees, d => d.graduation),
	}

	forEach(thereShouldOnlyBeOne, (group, name) => {
		let len = uniq(group).length
		if (len > 1) {
			throw new Error(`convertStudent: The student has more than one ${name}: ${JSON.stringify(group)}`)
		}
		else if (!len) {
			throw new Error(`convertStudent: The student has no ${name}: ${JSON.stringify(group)}`)
		}
	})

	let name = thereShouldOnlyBeOne.names[0]
	let advisor = thereShouldOnlyBeOne.advisors[0]
	let matriculation = parseInt(thereShouldOnlyBeOne.matriculations[0], 10)
	let graduation = parseInt(thereShouldOnlyBeOne.graduations[0], 10)

	return { name, advisor, matriculation, graduation }
}
