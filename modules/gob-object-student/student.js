// @flow

import uuid from 'uuid/v4'
import {Record, OrderedMap, Map, List} from 'immutable'

import type {
	AreaQuery,
	OverrideType,
	FabricationType,
	FulfillmentType,
	CourseType,
	OnlyCourseLookupFunc,
} from './types'

import {Schedule} from './schedule'
import {getActiveCourses} from './get-active-courses'
import {encodeStudent} from './encode-student'

type StudentType = {
	id: string,
	name: string,
	version: string,
	matriculation: number,
	graduation: number,
	advisor: string,
	dateLastModified: Date,
	dateCreated: Date,

	creditsNeeded: number,

	studies: List<AreaQuery>,
	schedules: OrderedMap<string, Schedule>,
	overrides: OrderedMap<string, OverrideType>,
	fabrications: List<FabricationType>,
	fulfillments: OrderedMap<string, FulfillmentType>,

	settings: OrderedMap<string, mixed>,
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
	studies: List(),
	schedules: OrderedMap(),
	overrides: OrderedMap(),
	fabrications: List(),
	fulfillments: OrderedMap(),
	settings: OrderedMap(),
	creditsNeeded: 35,
}

const StudentRecord = Record(defaultValues)

export class Student extends StudentRecord<StudentType> {
	constructor(data: {[key: $Keys<StudentType>]: mixed} = {}) {
		const now = new Date()

		let {
			id = uuid(),
			studies = [],
			schedules = {},
			matriculation = now.getFullYear() - 2,
			graduation = now.getFullYear() + 2,
			overrides = {},
			fulfillments = {},
			fabrications = [],
			settings = {},
			dateLastModified = now,
			dateCreated = now,
			advisor,
			version,
			name,
			creditsNeeded,
		} = data

		if (Array.isArray(studies)) {
			studies = List(studies)
		}

		if (Array.isArray(schedules)) {
			schedules = OrderedMap(schedules.map((s: any) => [s.id, s]))
		} else if (!OrderedMap.isOrderedMap(schedules)) {
			schedules = OrderedMap((schedules: any))
		}

		if ((schedules: any).some(s => !(s instanceof Schedule))) {
			schedules = (schedules: any).map(s => new Schedule(s))
		}

		if (Array.isArray(fabrications)) {
			fabrications = List((fabrications: any))
		} else if (List.isList(fabrications)) {
			fabrications = List((fabrications: any))
		} else {
			fabrications = Map((fabrications: any)).toList()
		}

		if (!OrderedMap.isOrderedMap(overrides)) {
			overrides = OrderedMap((overrides: any))
		}

		if (!OrderedMap.isOrderedMap(settings)) {
			settings = OrderedMap((settings: any))
		}

		if (!OrderedMap.isOrderedMap(fulfillments)) {
			fulfillments = OrderedMap((fulfillments: any))
		}

		super(
			({
				dateLastModified,
				dateCreated,
				id,
				studies,
				schedules,
				matriculation,
				graduation,
				fulfillments,
				settings,
				overrides,
				fabrications,
				advisor,
				version,
				name,
				creditsNeeded,
			}: any),
		)
	}

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

	get settings(): OrderedMap<string, mixed> {
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

	get schedules(): OrderedMap<string, Schedule> {
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

	findSchedulesForTerm(args: {
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
				let {year, semester} = deleted
				let otherSchedKey = mutable.schedules.findKey(s =>
					s.isSpecificTerm(year, semester),
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

		return this.withMutations(mutable => {
			for (let id of scheduleIds) {
				mutable.deleteIn(['schedules', id])
			}
		})
	}

	destroySchedulesForTerm(args: {|year: number, semester: number|}): this {
		let {year, semester} = args

		if (year == null || semester == null) {
			throw new Error('year and semester must both be provided')
		}

		let scheduleIds = this.schedules
			.filter(s => s.isSpecificTerm(year, semester))
			.map(s => s.id)
			.values()

		return this.withMutations(mutable => {
			for (let id of scheduleIds) {
				mutable.deleteIn(['schedules', id])
			}
		})
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

	/////
	/// Courses, within schedules
	/////

	addCourseToSchedule(scheduleId: string, clbid: string): this {
		let hasClbid = this.hasCourseInSchedule(scheduleId, clbid)

		if (hasClbid) {
			return this
		}

		return this.updateIn(['schedules', scheduleId, 'clbids'], ids => {
			return ids.push(clbid)
		})
	}

	removeCourseFromSchedule(scheduleId: string, clbid: string): this {
		let hasClbid = this.hasCourseInSchedule(scheduleId, clbid)

		if (!hasClbid) {
			return this
		}

		return this.updateIn(['schedules', scheduleId, 'clbids'], ids => {
			return ids.filterNot(id => id === clbid)
		})
	}

	hasCourseInSchedule(scheduleId: string, clbid: string): boolean {
		let list = this.getIn(['schedules', scheduleId, 'clbids'])
		if (!list) {
			return false
		}
		return list.some(id => id === clbid)
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

	get studies(): List<AreaQuery> {
		return this.get('studies')
	}

	addArea(area: AreaQuery): this {
		return this.updateIn(['studies'], set => set.push(area))
	}

	removeArea(area: AreaQuery): this {
		let index = this.findAreaIndex(area)
		if (index === -1) {
			return this
		}
		return this.updateIn(['studies'], set => set.delete(index))
	}

	findAreaIndex({name, type, revision}: AreaQuery): number {
		return this.studies.findIndex(
			a => a.name === name && a.type === type && a.revision === revision,
		)
	}

	hasArea({name, type, revision}: AreaQuery): boolean {
		return (
			this.studies.find(
				a =>
					a.name === name &&
					a.type === type &&
					a.revision === revision,
			) !== undefined
		)
	}

	/////
	/// Overrides
	/////

	/**
	 * Provide a description of overrides here
	 */

	get overrides(): OrderedMap<string, OverrideType> {
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

	get fabrications(): List<FabricationType> {
		return this.get('fabrications')
	}

	addFabrication(fabrication: FabricationType): this {
		return this.update('fabrications', list => {
			return list.push(fabrication)
		})
	}

	getFabrication(fabricationId: string): ?FabricationType {
		return this.fabrications.find(({clbid}) => clbid === fabricationId)
	}

	removeFabrication(fabricationId: string): this {
		return this.update('fabrications', list => {
			return list.filterNot(({clbid}) => clbid === fabricationId)
		})
	}

	/////
	/// Fulfillments
	/////

	/**
	 * Provide a description of fabrications here
	 */

	get fulfillments(): OrderedMap<string, FulfillmentType> {
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
