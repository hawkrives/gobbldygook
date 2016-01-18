import filter from 'lodash/collection/filter'
import map from 'lodash/collection/map'
import zipObject from 'lodash/array/zipObject'

export default function embedActiveStudentCourses(student, {cache=[]}) {
	// - At it's core, this method just needs to get the list of courses that a student has chosen.
	// - Each schedule has a list of courses that are a part of that schedule.
	// - Additionally, we only care about the schedules that are marked as "active".
	// - Keep in mind that each list of courses is actually a *promise* for the courses.
	// - We also need to make sure to de-duplicate the final list of courses, so that each `clbid` only appears once.
	// - Finally, remember that a given `clbid` might not exist in the database, in which case we get back 'undefined'.
	//   In this case, we need to know where the `clbid` came from, so that we can render an error in the correct location.

	return new Promise(resolve => {
		const active = [...filter(student.schedules, {active: true})]

		const enhanced = map(active, schedule => {
            schedule = {
                ...schedule,
                    courses: map(schedule.clbids, clbid => {
                    let course = cache[clbid]
                    if (!course) {
                        course = {clbid, term: schedule.term, error: 'Could not find course'}
                    }
                    return course
                }),
            }
            return [schedule.id, schedule]
        })

        const obj = zipObject(enhanced)

		resolve(obj)
	})
}
