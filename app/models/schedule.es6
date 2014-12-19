import * as Immutable from 'immutable'

import uuid from '../helpers/uuid.es6'
import randomChar from '../helpers/randomChar.es6'
import {checkScheduleTimeConflicts} from '../helpers/time.es6'
import {getCourse} from '../helpers/courses.es6'

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
	// Getters
	get courses() {
		return this.clbids.map((id) => getCourse(id))
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
        return this.withMutations((sched) => {
            sched = sched.set('clbids', sched.clbids.splice(oldIndex, 1))
            sched = sched.set('clbids', sched.clbids.splice(newIndex, 0, clbid))
        })
	}

	addCourse(clbid, index) {
		index = (index >= 0) ? index : this.clbids.size - 1;
        return this.set('clbids', this.clbids.splice(index, 0, clbid))
	}

	removeCourse(clbid) {
		console.log(`removing course with clbid: ${clbid}`)
		let index = this.clbids.findIndex((id) => id === clbid)
        return this.set('clbids', this.clbids.splice(index, 1))
	}


	// Schedule Validation

	validate() {
		// Checks to see if the schedule is valid

		// Step one: do any times conflict?
		var conflicts = checkScheduleTimeConflicts(this.courses)

		var hasConflict = Immutable.Seq(conflicts)
			.flatten(true)  // flatten the nested arrays
			.some()         // and see if any of the resulting values are true

		if (hasConflict) {
			console.log('schedule conflicts', conflicts)
		}

		return {
			hasConflict: hasConflict,
			conflicts: conflicts
		}
	}
}

export default Schedule
