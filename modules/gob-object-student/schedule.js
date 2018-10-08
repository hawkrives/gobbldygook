// @flow

import uuid from 'uuid/v4'
import {randomChar} from '@gob/lib'
import type {Result} from '@gob/types'

import {List, Map, Record} from 'immutable'
import type {CourseLookupFunc, CourseType} from './types'
import {
	validateSchedule,
	type Result as ValidationResult,
} from './validate-schedule'

type ScheduleType = {
	id: string,
	active: boolean,
	index: number,
	title: string,
	clbids: List<string>,
	year: number,
	semester: number,
	metadata: Map<string, mixed>,
}

const defaultValues: ScheduleType = {
	id: 'unknown',
	active: false,
	index: 1,
	title: 'no title',
	clbids: List(),
	year: 0,
	semester: 0,
	metadata: Map(),
}

const ScheduleRecord = Record(defaultValues)

type ScheduleInput = {
	[key: $Keys<ScheduleType>]: mixed,
	year?: number,
	semester?: number,
	index?: number,
	active?: boolean,
	title?: string,
	id?: string,
}

export class Schedule extends ScheduleRecord<ScheduleType> {
	constructor(data: ScheduleInput = {}) {
		let {
			id = uuid(),
			clbids = [],
			metadata = {},
			year,
			semester,
			active,
			index,
			title,
		} = data

		if (!List.isList(clbids)) {
			clbids = List((clbids: any))
		}

		if ((clbids: any).some(id => typeof id === 'number')) {
			clbids = (clbids: any).map(id => String(id).padStart(10, '0'))
		}

		if (!Map.isMap(metadata)) {
			metadata = Map((metadata: any))
		}

		super({
			year,
			semester,
			index,
			active,
			title,
			id,
			clbids: (clbids: any),
			metadata: (metadata: any),
		})
	}

	get id(): string {
		return this.get('id')
	}

	get active(): boolean {
		return this.get('active')
	}

	get index(): number {
		return this.get('index')
	}

	get title(): string {
		return this.get('title')
	}

	get year(): number {
		return this.get('year')
	}

	get semester(): number {
		return this.get('semester')
	}

	get clbids(): List<string> {
		return this.get('clbids')
	}

	getTerm(): number {
		return parseInt(`${this.year}${this.semester}`, 10)
	}

	/////
	/// Helpers
	/////

	get recommendedCredits(): number {
		let semester = this.get('semester')
		if (semester === 1 || semester === 3) {
			return 4
		}
		return 1
	}

	async getCoursesWithErrors(
		getCourse: CourseLookupFunc,
		fabrications?: Array<CourseType> | List<CourseType>,
	): Promise<List<Result<CourseType>>> {
		let term = this.getTerm()
		let promises = this.clbids.map(clbid =>
			getCourse(clbid, term, fabrications),
		)
		return Promise.all(promises).then(List)
	}

	async getCourses(
		getCourse: CourseLookupFunc,
		fabrications?: Array<CourseType> | List<CourseType>,
	): Promise<List<CourseType>> {
		let coursesWithErrors = await this.getCoursesWithErrors(
			getCourse,
			fabrications,
		)

		return coursesWithErrors
			.map(r => (r.error ? null : r.result))
			.filter(Boolean)
	}

	isSpecificTerm(year: number, semester: number): boolean {
		return this.year === year && this.semester === semester
	}

	async validate(getCourse: OnlyCourseLookupFunc): Promise<ValidationResult> {
		return validateSchedule(this, getCourse)
	}
}
