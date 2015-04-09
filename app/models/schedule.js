import Immutable from 'immutable'
import {isUndefined, contains, _ as lodash, reject} from 'lodash'
import Promise from 'bluebird'
import {v4 as uuid} from 'node-uuid'

import {randomChar, isTrue} from 'sto-helpers'
import getCourses from '../helpers/getCourses'
import findWarnings from '../helpers/findCourseWarnings'

const ScheduleRecord = Immutable.Record({
	id: uuid(),
	active: false,
	year: 0,
	semester: 0,
	index: 1,
	title: 'Schedule ' + randomChar().toUpperCase(),
	clbids: Immutable.List(),
	_courseData: Promise.resolve(Immutable.List()),
})

class Schedule extends ScheduleRecord {
	constructor(data={}) {
		// console.log('schedule constructor')
		super(data)
		return this.withMutations((sched) => {
			sched = sched.set('id', data.id || uuid())
			sched = sched.set('clbids', Immutable.fromJS(data.clbids || []))
			sched = sched.set('_courseData', getCourses(this.clbids))
			return sched
		})
	}

	// Getters
	get courses() {
		return this._courseData
	}

	// Schedule Maintenance
	move(to={}) {
		// `to` is an object: {year, semester}
		return this.withMutations((sched) => {
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
		const oldIndex = this.clbids.findIndex((id) => id === clbid)

		return this.withMutations((sched) => {
			sched = sched.set('clbids', sched.clbids.splice(oldIndex, 1))
			sched = sched.set('clbids', sched.clbids.splice(newIndex, 0, clbid))
			sched = sched.set('_courseData', getCourses(sched.clbids))
			return sched
		})
	}

	addCourse(clbid) {
		// let start = present()
		// console.log(`adding clbid ${clbid} to schedule ${this.id} (${this.year}-${this.semester}.${this.index})`)

		return this.withMutations((sched) => {
			sched = sched.set('clbids', sched.clbids.push(clbid))
			sched = sched.set('_courseData', getCourses(sched.clbids))
			// sched.get('_courseData').then(d => console.log(`it took ${Math.round(present() - start)}ms to add ${clbid} to ${sched.year}-${sched.semester};`, 'clbids:', sched.clbids.toJS(), 'titles:', d.map(c => c.title)))
			return sched
		})
	}

	removeCourse(clbid) {
		// let start = present()
		// console.log(`removing clbid ${clbid} from schedule ${this.id} (${this.year}-${this.semester}.${this.index})`)

		const index = this.clbids.indexOf(clbid)
		return this.withMutations((sched) => {
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

		const hasConflict = lodash(conflicts)
			// flatten the nested arrays
			.flatten()
			// filter to just the non-null/undefined items
			.filter(item => item)
			// grab the 'warning' values
			.pluck('warning')
			// and see if any are true
			.any(isTrue)

		// if (hasConflict) {
		// 	console.log('schedule conflicts', conflicts, hasConflict)
		// }

		return {hasConflict, conflicts}
	}

	toJSON() {
		let toRemove = ['_courseData']
		let filtered = this.toMap()
			.filterNot((val, key) => contains(toRemove, key))
		return filtered.toJS()
	}
}

export default Schedule
