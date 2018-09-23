// @flow

import uuid from 'uuid/v4'
import {randomChar} from '@gob/lib'

import type {Warning} from './find-course-warnings'
import type {Course, CourseError} from '@gob/types'

export type ScheduleType = {
	id: string,
	active: boolean,
	index: number,
	title: string,
	clbids: Array<string>,
	year: number,
	semester: number,
	metadata: Object,
}

export type HydratedScheduleType = {
	...$Exact<ScheduleType>,
	courses: Array<Course | CourseError>,
	conflicts: Array<Array<?Warning>>,
	hasConflict: boolean,
}

type InputSchedule = {
	id?: string,
	active?: boolean,
	index?: number,
	title?: string,
	clbids?: Array<number | string>,
	year?: string | number,
	semester?: string | number,
	metadata?: Object,
}

export function Schedule(data: InputSchedule = {}): ScheduleType {
	const baseSchedule = {
		id: uuid(),
		active: false,

		index: 1,
		title: `Schedule ${randomChar().toUpperCase()}`,

		clbids: [],
		year: 0,
		semester: 0,

		metadata: {},
	}

	let schedule = {...baseSchedule, ...data}

	let id = schedule.id
	if (typeof id !== 'string') {
		throw new TypeError('Schedule id must be a string.')
	}

	let clbids = schedule.clbids
	if (clbids.some(id => typeof id === 'number')) {
		clbids = clbids.map(
			id => (typeof id !== 'string' ? String(id).padStart(10, '0') : id),
		)
	}

	let year = schedule.year
	if (typeof year === 'string') {
		year = parseInt(year, 10)
	}

	let semester = schedule.semester
	if (typeof semester === 'string') {
		semester = parseInt(semester, 10)
	}

	return {
		...(schedule: any),
		id: id,
		year: year,
		semester: semester,
		clbids: ((clbids: any): Array<string>),
	}
}
