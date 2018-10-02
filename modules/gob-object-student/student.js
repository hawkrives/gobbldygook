// @flow

import uuid from 'uuid/v4'
import {Record, Map as IMap, Set as ISet} from 'immutable'

import type {
	AreaQuery,
	OverrideType,
	FabricationType,
	FulfillmentType,
} from './types'

import {type ScheduleType} from './schedule'

export type StudentType = {
	id: string,
	name: string,
	version: string,
	matriculation: number,
	graduation: number,
	advisor: string,
	dateLastModified: Date,
	dateCreated: Date,

	studies: ISet<AreaQuery>,
	schedules: IMap<string, ScheduleType>,
	overrides: IMap<string, OverrideType>,
	fabrications: IMap<string, FabricationType>,
	fulfillments: IMap<string, FulfillmentType>,

	settings: IMap<string, mixed>,
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
	studies: ISet(),
	schedules: IMap(),
	overrides: IMap(),
	fabrications: IMap(),
	fulfillments: IMap(),
	settings: IMap(),
}

const StudentRecord = Record(defaultValues)

export class Student extends StudentRecord<StudentType> {
	constructor(props: ?Object) {
		super(props)

		return this.withMutations(mutable => {
			const now = new Date()
			mutable.set('matriculation', now.getFullYear() - 2)
			mutable.set('graduation', now.getFullYear() + 2)

			mutable.set('id', uuid())
		})
	}

	setName(name: string) {
		return this.set('name', name)
	}

	setAdvisor(name: string) {
		return this.set('advisor', name)
	}

	setMatriculation(year: number) {
		return this.set('matriculation', year)
	}

	setGraduation(year: number) {
		return this.set('graduation', year)
	}

	setSetting(key: string, value: mixed) {
		return this.setIn(['settings', key], value)
	}

	/////
	/// Schedules
	/////

	/**
	 * Provide a description of schedules here
	 */

	addSchedule(schedule: ScheduleType) {
		return this.setIn(['schedules', schedule.id], schedule)
	}

	destroySchedule(scheduleId: string) {
		let deleted = this.getIn(['schedules', scheduleId])

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

	moveScheduleInStudent(
		scheduleId: string,
		{year, semester}: {year: number, semester: number},
	) {
		return this.mergeIn(['schedules', scheduleId], {year, semester})
	}

	reorderScheduleInStudent(scheduleId: string, index: number) {
		return this.setIn(['schedules', scheduleId, 'index'], index)
	}

	renameScheduleInStudent(scheduleId: string, title: string) {
		return this.setIn(['schedules', scheduleId, 'title'], title)
	}

	addCourseToSchedule(scheduleId: string, clbid: string) {
		return this.updateIn(['schedules', scheduleId, 'clbids'], ids => {
			return ids.push(clbid)
		})
	}

	removeCourseFromSchedule(scheduleId: string, clbid: string) {
		return this.updateIn(['schedules', scheduleId, 'clbids'], ids => {
			return ids.filterNot(id => id === clbid)
		})
	}

	moveCourseToSchedule(args: {from: string, to: string, clbid: string}) {
		let {from, to, clbid} = args

		// prettier-ignore
		return this
			.removeCourseFromSchedule(from, clbid)
			.addCourseToSchedule(to, clbid)
	}

	reorderCourseInSchedule(
		scheduleId: string,
		{clbid, index}: {clbid: string, index: number},
	) {
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

	addAreaToStudent(area: AreaQuery) {
		return this.updateIn(['studies'], set => set.add(area))
	}

	removeAreaFromStudent(area: AreaQuery) {
		return this.updateIn(['studies'], set => set.delete(area))
	}

	/////
	/// Overrides
	/////

	/**
	 * Provide a description of overrides here
	 */

	setOverrideOnStudent(key: string, value: OverrideType) {
		return this.setIn(['overrides', key], value)
	}

	removeOverrideFromStudent(key: string) {
		return this.deleteIn(['overrides', key])
	}

	/////
	/// Fabrications
	/////

	/**
	 * Provide a description of fabrications here
	 */

	addFabricationToStudent(fabrication: FabricationType) {
		return this.setIn(['fabrications', fabrication.clbid], fabrication)
	}

	removeFabricationFromStudent(fabricationId: string) {
		return this.deleteIn(['fabrications', fabricationId])
	}
}
