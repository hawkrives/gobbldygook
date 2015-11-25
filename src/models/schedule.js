import Immutable from 'immutable'
import reject from 'lodash/collection/reject'
import isUndefined from 'lodash/lang/isUndefined'
import isNumber from 'lodash/lang/isNumber'
import flatten from 'lodash/array/flatten'
import filter from 'lodash/collection/filter'
import identity from 'lodash/utility/identity'
import pluck from 'lodash/collection/pluck'
import some from 'lodash/collection/some'
import {v4 as uuid} from 'uuid'

import randomChar from '../helpers/random-char'
import isTrue from '../helpers/is-true'
import getCourses from '../helpers/get-courses'
import findWarnings from '../helpers/find-course-warnings'

const ScheduleRecord = Immutable.Record({
	id: uuid(),
	active: false,
	year: 0,
	semester: 0,
	index: 1,
	title: 'Schedule ' + randomChar().toUpperCase(),
	clbids: Immutable.List(),
	_courseData: Promise.resolve([]),
})

export default class Schedule extends ScheduleRecord {
	constructor(data={}) {
		// console.log('schedule constructor')
		super({
			...data,
			id: data.id || uuid(),
			clbids: Immutable.fromJS(data.clbids || []),
			_courseData: getCourses(data.clbids, {year: data.year, semester: data.semester}),
		})
	}

	// Getters
	get courses() {
		return this._courseData
	}

	// Schedule Maintenance
	move(to={}) {
		// `to` is an object: {year, semester}
		return this.withMutations(sched => {
			if (to.year) {
				sched = sched.set('year', to.year)
			}
			if (to.semester) {
				sched = sched.set('semester', to.semester)
			}
			return sched
		})
	}

	reorder(newIndex) {
		return this.set('index', newIndex)
	}

	rename(newTitle) {
		return this.set('title', newTitle)
	}


	// Course Maintenance

	reorderCourse(clbid, newIndex) {
		if (!isNumber(clbid)) {
			throw new TypeError('reorderCourse(): clbid must be a number')
		}
		const oldIndex = this.clbids.findIndex(id => id === clbid)

		return this.withMutations(sched => {
			sched = sched.set('clbids', sched.clbids.splice(oldIndex, 1))
			sched = sched.set('clbids', sched.clbids.splice(newIndex, 0, clbid))
			sched = sched.set('_courseData', getCourses(sched.clbids, {year: sched.year, semester: sched.semester}))
			return sched
		})
	}

	addCourse(clbid) {
		// let start = present()
		// console.log(`adding clbid ${clbid} to schedule ${this.id} (${this.year}-${this.semester}.${this.index})`)

		if (!isNumber(clbid)) {
			throw new TypeError('addCourse(): clbid must be a number')
		}

		if (this.clbids.contains(clbid)) {
			return this
		}

		return this.withMutations(sched => {
			sched = sched.set('clbids', sched.clbids.push(clbid))
			sched = sched.set('_courseData', getCourses(sched.clbids, {year: sched.year, semester: sched.semester}))
			// sched.get('_courseData').then(d => console.log(`it took ${Math.round(present() - start)}ms to add ${clbid} to ${sched.year}-${sched.semester};`, 'clbids:', sched.clbids.toJS(), 'titles:', d.map(c => c.title)))
			return sched
		})
	}

	removeCourse(clbid) {
		// let start = present()
		// console.log(`removing clbid ${clbid} from schedule ${this.id} (${this.year}-${this.semester}.${this.index})`)

		if (!isNumber(clbid)) {
			throw new TypeError('removeCourse(): clbid must be a number')
		}

		const index = this.clbids.indexOf(clbid)
		return this.withMutations(sched => {
			sched = sched.set('clbids', sched.clbids.delete(index))
			sched = sched.set('_courseData', getCourses(sched.clbids))
			// sched.get('_courseData').then(d => console.log(`it took ${Math.round(present() - start)}ms to remove ${clbid} from ${this.year}-${this.semester};`, 'clbids:', sched.clbids.toJS(), 'titles:', d.map(c => c.title)))
			return sched
		})
	}


	// Schedule Validation

	async validate() {
		// Checks to see if the schedule is valid
		let courses = await this.courses

		// only check the courses that have data
		courses = reject(courses, isUndefined)

		// Step one: do any times conflict?
		const conflicts = findWarnings(courses, this.toJS())

		const flattened = flatten(conflicts)
		const filtered = filter(flattened, identity)
		const warnings = pluck(filtered, 'warning')
		const hasConflict = some(warnings, isTrue)

		// if (hasConflict) {
		// 	console.log('schedule conflicts', conflicts, hasConflict)
		// }

		return {hasConflict, conflicts}
	}

	toJSON() {
		return {
			id: this.id,
			active: this.active,
			year: this.year,
			semester: this.semester,
			index: this.index,
			title: this.title,
			clbids: this.clbids.toArray(),
		}
	}
}
