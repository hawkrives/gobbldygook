import * as Immutable from 'immutable'
import {isUndefined} from 'lodash'

import uuid from 'helpers/uuid'
import randomChar from 'helpers/randomChar'
import {checkScheduleTimeConflicts} from 'helpers/time'
import {getCourses} from 'helpers/courses'

let ScheduleRecord = Immutable.Record({
	id: uuid(),
	active: false,
	year: 0,
	semester: 0,
	index: 1,
	title: 'Schedule ' + randomChar().toUpperCase(),
	clbids: Immutable.List(),
})

class Schedule extends ScheduleRecord {
	constructor(data) {
		super(data)
		return this.withMutations((sched) => {
			sched = sched.set('id', uuid())
			sched = sched.set('clbids', Immutable.fromJS(data.clbids))
			return sched
		})
	}

	// Getters
	get courses() {
		// if (this._coursesAreDirty) {
		// 	this._courseData = getCourses(this.clbids)
		// 	this._coursesAreDirty = false
		// }
		return getCourses(this.clbids)
	}

	// Schedule Maintenance
	move(to={}) {
		// `to` is an object: {year, semester}
		return this.withMutations((sched) => {
			if (to.year)
				sched = sched.set('year', to.year)
			if (to.semester)
				sched = sched.set('semester', to.semester)
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
		let oldIndex = this.clbids.findIndex((id) => id === clbid)

		return this.withMutations((sched) => {
			sched = sched.set('clbids', sched.clbids.splice(oldIndex, 1))
			sched = sched.set('clbids', sched.clbids.splice(newIndex, 0, clbid))
			return sched
		})
	}

	addCourse(clbid, index) {
		console.log(`adding clbid ${clbid} at index ${index} to schedule ${this.id}`)
		index = (index >= 0) ? index : this.clbids.size - 1;

		return this.set('clbids', this.clbids.splice(index, 0, clbid))
	}

	removeCourse(clbid) {
		console.log(`removing clbid ${clbid} from schedule ${this.id}`)

		let index = this.clbids.findIndex((id) => id === clbid)
		return this.set('clbids', this.clbids.splice(index, 1))
	}


	// Schedule Validation

	validate() {
		// Checks to see if the schedule is valid
		return this.courses
			 // only check the courses that have data
			.then(courses => Immutable.Seq(courses).filterNot(isUndefined))
			// Step one: do any times conflict?
			.then(checkScheduleTimeConflicts)
			.then((conflicts) => {
				var hasConflict = Immutable.Seq(conflicts)
					// flatten the nested arrays
					.flatten(true)
					// and see if any of the resulting values are true
					.some((value) => value === true)

				if (hasConflict) {
					console.log('schedule conflicts', conflicts, hasConflict)
				}

				return {
					hasConflict: hasConflict,
					conflicts: conflicts,
				}
			})
	}
}

export default Schedule
