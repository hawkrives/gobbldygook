// @flow

import uuid from 'uuid/v4'
import {Record, Map, Set, List} from 'immutable'

import type {
	AreaQuery,
	OverrideType,
	FabricationType,
	FulfillmentType,
	CourseType,
	CourseLookupFunc,
	OnlyCourseLookupFunc,
} from './types'

import {Schedule} from './schedule'
import {getActiveCourses} from './get-active-courses'
import {encodeStudent} from './encode-student'

export type StudentType = {
	id: string,
	name: string,
	version: string,
	matriculation: number,
	graduation: number,
	advisor: string,
	dateLastModified: Date,
	dateCreated: Date,

	studies: Set<AreaQuery>,
	schedules: Map<string, Schedule>,
	overrides: Map<string, OverrideType>,
	fabrications: Map<string, FabricationType>,
	fulfillments: Map<string, FulfillmentType>,

	settings: Map<string, mixed>,
}

const defaultValues: StudentType = {
	id: 'unknown',
	name: 'Student X',
	version: global.VERSION,
	matriculation: 0,
	graduation: 4,
	advisor: 'Professor Y',
	dateLastModified: new Date(),
	dateCreated: new Date(),
	studies: Set(),
	schedules: Map(),
	overrides: Map(),
	fabrications: Map(),
	fulfillments: Map(),
	settings: Map(),
}

const StudentRecord = Record(defaultValues)

export class Student extends StudentRecord<StudentType> {
	get id(): string {
		return this.get('id')
	}

	get dateLastModified(): Date {
		return this.get('dateLastModified')
	}

	/////

	get name(): string {
		return this.get('name')
	}

	setName(name: string): this {
		return this.set('name', name)
	}

	get advisor(): string {
		return this.get('advisor')
	}

	setAdvisor(name: string): this {
		return this.set('advisor', name)
	}

	get matriculation(): number {
		return this.get('matriculation')
	}

	setMatriculation(year: string | number): this {
		let newYear = typeof year === 'string' ? parseInt(year, 10) : year
		return this.set('matriculation', newYear)
	}

	get graduation(): number {
		return this.get('graduation')
	}

	setGraduation(year: string | number): this {
		let newYear = typeof year === 'string' ? parseInt(year, 10) : year
		return this.set('graduation', newYear)
	}

	get settings(): Map<string, mixed> {
		return this.get('settings')
	}

	setSetting(key: string, value: mixed): this {
		return this.setIn(['settings', key], value)
	}

	/////
	/// Schedules
	/////

	/**
	 * Provide a description of schedules here
	 */

	get schedules(): Map<string, Schedule> {
		return this.get('schedules')
	}

	addSchedule(schedule: Schedule): this {
		return this.setIn(['schedules', schedule.id], schedule)
	}

	getScheduleForTerm(args: {year: number, semester: number}): ?Schedule {
		let {year, semester} = args
		return this.schedules.find(
			s =>
				s.active === true && s.year === year && s.semester === semester,
		)
	}

	findAllSchedulesForTerm(args: {
		year: number,
		semester: number,
	}): List<Schedule> {
		let {year, semester} = args
		return this.schedules
			.filter(s => s.year === year && s.semester === semester)
			.toList()
	}

	destroySchedule(scheduleId: string): this {
		let deleted = this.schedules.get(scheduleId)

		if (!deleted) {
			throw new ReferenceError(
				`Could not find a schedule with an ID of ${scheduleId}.`,
			)
		}

		return this.withMutations(mutable => {
			mutable.deleteIn(['schedules', scheduleId])

			if (deleted && deleted.active) {
				let otherSchedKey = mutable.schedules.findKey(
					s =>
						s.year === deleted.year &&
						s.semester === deleted.semester &&
						s.id !== deleted.id,
				)

				if (otherSchedKey) {
					mutable.setIn(['schedules', otherSchedKey, 'active'], true)
				}
			}

			return mutable
		})
	}

	destroySchedulesForYear(year: number): this {
		let scheduleIds = this.schedules
			.filter(s => s.year === year)
			.map(s => s.id)
			.values()

		return this.update('schedules', schedules =>
			schedules.deleteAll(scheduleIds),
		)
	}

	destroySchedulesForTerm(args: {year: number, semester: number}): this {
		let {year, semester} = args
		let scheduleIds = this.schedules
			.filter(s => s.isSpecificTerm(year, semester))
			.map(s => s.id)
			.values()

		return this.update('schedules', schedules =>
			schedules.deleteAll(scheduleIds),
		)
	}

	moveSchedule(
		scheduleId: string,
		{year, semester}: {year: number, semester: number},
	): this {
		return this.mergeIn(['schedules', scheduleId], {year, semester})
	}

	reorderSchedule(scheduleId: string, index: number): this {
		return this.setIn(['schedules', scheduleId, 'index'], index)
	}

	renameSchedule(scheduleId: string, title: string): this {
		return this.setIn(['schedules', scheduleId, 'title'], title)
	}

	addCourseToSchedule(scheduleId: string, clbid: string): this {
		return this.updateIn(['schedules', scheduleId, 'clbids'], ids => {
			return ids.push(clbid)
		})
	}

	removeCourseFromSchedule(scheduleId: string, clbid: string): this {
		return this.updateIn(['schedules', scheduleId, 'clbids'], ids => {
			return ids.filterNot(id => id === clbid)
		})
	}

	moveCourseToSchedule(args: {
		from: string,
		to: string,
		clbid: string,
	}): this {
		let {from, to, clbid} = args

		// prettier-ignore
		return this
			.removeCourseFromSchedule(from, clbid)
			.addCourseToSchedule(to, clbid)
	}

	reorderCourseInSchedule(
		scheduleId: string,
		{clbid, index}: {clbid: string, index: number},
	): this {
		return this.updateIn(['schedules', scheduleId, 'clbids'], ids => {
			if (!ids) {
				throw new ReferenceError(
					`Could not find a schedule with an ID of "${scheduleId}".`,
				)
			}

			if (!ids.includes(clbid)) {
				throw new ReferenceError(
					`${clbid} is not in schedule "${scheduleId}"`,
				)
			}

			index = Math.min(Math.max(0, index), ids.size)

			const oldIndex = ids.indexOf(clbid)
			return ids.delete(oldIndex).insert(index, clbid)
		})
	}

	/////
	/// Areas of Study
	/////

	/**
	 * Provide a description of areas here
	 */

	get studies(): Set<AreaQuery> {
		return this.get('studies')
	}

	addArea(area: AreaQuery): this {
		return this.updateIn(['studies'], set => set.add(area))
	}

	removeArea(area: AreaQuery): this {
		return this.updateIn(['studies'], set => set.delete(area))
	}

	/////
	/// Overrides
	/////

	/**
	 * Provide a description of overrides here
	 */

	get overrides(): Map<string, OverrideType> {
		return this.get('overrides')
	}

	hasOverride(key: string): boolean {
		return this.hasIn(['overrides', key])
	}

	setOverride(key: string, value: OverrideType): this {
		return this.setIn(['overrides', key], value)
	}

	removeOverride(key: string): this {
		return this.deleteIn(['overrides', key])
	}

	/////
	/// Fabrications
	/////

	/**
	 * Provide a description of fabrications here
	 */

	get fabrications(): Map<string, FabricationType> {
		return this.get('fabrications')
	}

	addFabrication(fabrication: FabricationType): this {
		return this.setIn(['fabrications', fabrication.clbid], fabrication)
	}

	removeFabrication(fabricationId: string): this {
		return this.deleteIn(['fabrications', fabricationId])
	}

	/////
	/// Fulfillments
	/////

	/**
	 * Provide a description of fabrications here
	 */

	get fulfillments(): Map<string, FulfillmentType> {
		return this.get('fulfillments')
	}

	// addFabricationToStudent(fabrication: FabricationType): this {
	// 	return this.setIn(['fabrications', fabrication.clbid], fabrication)
	// }
	//
	// removeFabricationFromStudent(fabricationId: string): this {
	// 	return this.deleteIn(['fabrications', fabricationId])
	// }

	/////
	/// Helpers
	/////

	activeCourses(getCourse: OnlyCourseLookupFunc): Promise<Array<CourseType>> {
		return getActiveCourses(this, getCourse)
	}

	urlEncode(): string {
		return encodeStudent(this)
	}

	dataUrlEncode(): string {
		return `data:text/json;charset=utf-8,${this.urlEncode()}`
	}
}

type StudentInfo = {
	id: string,
	name: string,
	version: string,
	matriculation: number,
	graduation: number,
	advisor: string,
	dateLastModified: Date,
	dateCreated: Date,

	studies: Array<AreaQuery>,
	schedules: Map<string, Schedule>,
	overrides: Map<string, OverrideType>,
	fabrications: Map<string, FabricationType>,
	fulfillments: Map<string, FulfillmentType>,

	settings: Map<string, mixed>,
}

export function createNewStudent(data: {} | StudentInfo = {}) {
	const now = new Date()

	let {
		id = uuid(),
		matriculation = now.getFullYear() - 2,
		graduation = now.getFullYear() + 2,
		...student
	} = (data: any)

	let args = {id, matriculation, graduation, ...student}

	return new Student(args)
}
