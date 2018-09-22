// @flow

import {
	Student,
	Schedule,
	type AreaQuery,
	type HydratedStudentType,
	type FabricationType,
} from '@gob/object-student'
import type {Course as CourseType} from '@gob/types'
import flatten from 'lodash/flatten'
import fromPairs from 'lodash/fromPairs'

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

type CourseGetter = (
	{clbid: string, term: number},
	?{[key: string]: FabricationType},
) => Promise<
	| CourseType
	| FabricationType
	| {+clbid: string, +term: number, error: string},
>

export async function convertStudent(
	student: PartialStudent,
	getCourse: CourseGetter,
): Promise<HydratedStudentType> {
	let studies = processStudies(student)

	let info
	{
		let {name, advisor, graduation, matriculation} = student
		info = {name, advisor, graduation, matriculation}
	}

	let {schedules, fabrications} = await processSchedules(
		student.schedules,
		getCourse,
	)

	let filledStudent: any = Student({
		...info,
		schedules,
		fabrications,
		studies,
	})

	return filledStudent
}

export async function processSchedules(
	schedules: Array<PartialSchedule>,
	getCourse: CourseGetter,
) {
	let scheds = schedules.map(sched => {
		let clbids = sched.courses.map(c => c.clbid)

		return Schedule({
			...sched,
			clbids,
			active: true,
		})
	})

	let allClbids = flatten(schedules.map(s => s.courses))
	let promisedCourses = allClbids.map(course => {
		let {clbid, term} = course
		return getCourse({clbid, term}).then(resolved => {
			if ('error' in resolved) {
				return {
					...course,
					_fabrication: true,
				}
			}
			return course
		})
	})

	let resolvedCourses = await Promise.all(promisedCourses)

	let fabricationPairs = resolvedCourses
		.filter(c => c._fabrication)
		.map(c => [c.clbid, c])
	let fabrications = fromPairs(fabricationPairs)

	let finalSchedules = fromPairs(scheds.map(s => [s.id, s]))

	return {schedules: finalSchedules, fabrications}
}

export function processStudies({
	majors: m,
	degrees: d,
	emphases: e,
	concentrations: c,
}: PartialStudent): Array<AreaQuery> {
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

	return [
		...d.map(name => ({name, type: 'degree', revision: 'latest'})),
		...m.map(name => ({name, type: 'major', revision: 'latest'})),
		...c.map(name => ({name, type: 'concentration', revision: 'latest'})),
		...e.map(name => ({name, type: 'emphasis', revision: 'latest'})),
	]
}
