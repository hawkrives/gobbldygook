// @flow

import {
	Student,
	Schedule,
	type AreaQuery,
	type FabricationType,
	type OnlyCourseLookupFunc,
} from '@gob/object-student'
import {List, Set, Map} from 'immutable'
import type {Course as CourseType} from '@gob/types'

type PartialCourse = {
	credits: number,
	number: number,
	clbid: string,
	graded: string,
	department: string,
	lab: boolean,
	section: string,
	name: string,

	year: number,
	semester: number,
	term: number,

	_fabrication?: true,
}

type PartialSchedule = {
	semester: number,
	year: number,
	courses: Array<PartialCourse>,
}

export type PartialStudent = {
	courses: Array<PartialCourse>,
	degrees: Array<string>,
	majors: Array<string>,
	concentrations: Array<string>,
	emphases: Array<string>,
	matriculation: number,
	graduation: number,
	advisor: string,
	name: string,
	schedules: Array<PartialSchedule>,
}

export async function convertStudent(
	student: PartialStudent,
	getCourse: OnlyCourseLookupFunc,
): Promise<Student> {
	let studies = processStudies(student)

	let {name, advisor, graduation, matriculation} = student
	let info = {name, advisor, graduation, matriculation}

	let {schedules, fabrications} = await processSchedules(
		student.schedules,
		getCourse,
	)

	let filledStudent: any = new Student({
		...info,
		schedules,
		fabrications,
		studies,
	})

	return filledStudent
}

export async function processSchedules(
	schedules: Array<PartialSchedule>,
	getCourse: OnlyCourseLookupFunc,
): Promise<{
	schedules: Map<string, Schedule>,
	fabrications: Map<string, FabricationType>,
}> {
	let listOfSchedules = List(schedules)
	let scheds = listOfSchedules.map(sched => {
		let {semester, year, courses} = sched
		let clbids = List(courses.map(c => c.clbid))

		return new Schedule({
			semester,
			year,
			clbids,
			active: true,
		})
	})

	let allCourses = listOfSchedules.flatMap(s => s.courses)
	let promisedFabrications = allCourses.map(course => {
		let {clbid, term} = course

		return getCourse({clbid, term}).then(resolved => {
			// we actually want to invert this; if we found the course, then it's not
			// a fabrication, so we return null; otoh, if we _didn't_ find the course,
			// it must be a fabrication, so we actually want to return it.
			if (resolved) {
				return null
			}
			return ((course: any): FabricationType)
		})
	})

	let resolvedFabrications = await Promise.all(promisedFabrications)

	let fabricationPairs = resolvedFabrications
		.filter(Boolean)
		.map(c => [c.clbid, c])

	return {
		schedules: Map(scheds.map(s => [s.id, s])),
		fabrications: Map(fabricationPairs),
	}
}

export function processStudies({
	majors: m,
	degrees: d,
	emphases: e,
	concentrations: c,
}: PartialStudent): Set<AreaQuery> {
	d = d.map(name => {
		switch (name) {
			case 'B.A.':
				return 'Bachelor of Arts'
			case 'B.M.':
				return 'Bachelor of Music'
			default:
				return name
		}
	})

	return Set([
		...d.map(name => ({name, type: 'degree', revision: 'latest'})),
		...m.map(name => ({name, type: 'major', revision: 'latest'})),
		...c.map(name => ({name, type: 'concentration', revision: 'latest'})),
		...e.map(name => ({name, type: 'emphasis', revision: 'latest'})),
	])
}
