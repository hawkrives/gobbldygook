// @flow

import uuid from 'uuid/v4'
import {randomChar} from '@gob/lib'

import {Record, Map as IMap, List as IList} from 'immutable'
import type {WarningType} from './find-course-warnings'
import type {CourseError, Course as CourseType} from '@gob/types'
import type {FabricationType} from './types'

type HydratedScheduleType = {
	courses: Array<CourseType | CourseError>,
	conflicts: Array<Array<?WarningType>>,
	hasConflict: boolean,
}

type InputSchedule = {
	id?: string,
	active?: boolean,
	index?: number,
	title?: string,
	clbids?: Array<string>,
	year?: number,
	semester?: number,
	metadata?: Object,
}

type ScheduleType = {
	id: string,
	active: boolean,
	index: number,
	title: string,
	clbids: IList<string>,
	year: number,
	semester: number,
	metadata: IMap<string, mixed>,
}

const defaultValues: ScheduleType = {
	id: 'unknown',
	active: false,
	index: 0,
	title: 'no title',
	clbids: IList(),
	year: 0,
	semester: 0,
	metadata: IMap(),
}

const ScheduleRecord = Record(defaultValues)

export type CourseLookupFunc = (
	{clbid: string, term: number},
	?{[key: string]: FabricationType},
) => Promise<CourseType | FabricationType | CourseError>

export class Schedule extends ScheduleRecord<ScheduleType> {
	constructor(props: InputSchedule = {}) {
		let {
			id = uuid(),
			active = false,
			index = 0,
			title = `Schedule ${randomChar().toUpperCase()}`,
			clbids = [],
			year = 0,
			semester = 0,
			metadata = {},
		} = props

		if (clbids.some(id => typeof id === 'number')) {
			clbids = clbids.map(
				id =>
					typeof id !== 'string' ? String(id).padStart(10, '0') : id,
			)
		}

		clbids = IList(clbids)
		metadata = IMap(metadata)

		super({
			id,
			active,
			index,
			title,
			clbids,
			year,
			semester,
			metadata,
		})
	}

	getTerm(): number {
		return parseInt(`${this.get('year')}${this.get('semester')}`, 10)
	}

	async getCourses(
		getCourse: CourseLookupFunc,
		fabrications?: {[key: string]: FabricationType},
	): Promise<IList<CourseType | FabricationType | CourseError>> {
		let term = this.getTerm()
		let results = await Promise.all(
			this.get('clbids')
				.map(id => getCourse({clbid: id, term}, fabrications))
				.toArray(),
		)
		return IList(results)
	}
}
