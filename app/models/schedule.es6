import * as Immutable from 'immutable'

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
		this._coursesAreDirty = true
	}

	// Getters
	get courses() {
		if (this._coursesAreDirty) {
			this._courseData = getCourses(this.clbids)
			this._coursesAreDirty = false
		}
		return this._courseData
	}

	// Schedule Maintenance
	move(to={}) {
		// `to` is an object: {year, semester}
		return this.withMutations((sched) => {
			if (to.year)
				sched = sched.set('year', to.year)
			if (to.semester)
				sched = sched.set('semester', to.semester)
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
		this._coursesAreDirty = true
		return this.withMutations((sched) => {
			sched = sched.set('clbids', sched.clbids.splice(oldIndex, 1))
			sched = sched.set('clbids', sched.clbids.splice(newIndex, 0, clbid))
		})
	}

	addCourse(clbid, index) {
		index = (index >= 0) ? index : this.clbids.size - 1;
		this._coursesAreDirty = true
		return this.set('clbids', this.clbids.splice(index, 0, clbid))
	}

	removeCourse(clbid) {
		console.log(`removing course with clbid: ${clbid}`)
		let index = this.clbids.findIndex((id) => id === clbid)
		this._coursesAreDirty = true
		return this.set('clbids', this.clbids.splice(index, 1))
	}


	// Schedule Validation

	validate() {
		// Checks to see if the schedule is valid
		return this.courses
			// Step one: do any times conflict?
			.then(checkScheduleTimeConflicts)
			.then((conflicts) => {
				var hasConflict = _(conflicts)
					.flatten()      // flatten the nested arrays
					.any()          // and see if any of the resulting values are true

				if (hasConflict.length) {
					console.log('schedule conflicts', conflicts, hasConflict)
				}

				return {
					hasConflict: hasConflict,
					conflicts: conflicts
				}
			})
	}
}

export default Schedule
