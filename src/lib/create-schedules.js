import groupBy from 'lodash/collection/groupBy'
import map from 'lodash/collection/map'
import pairs from 'lodash/object/pairs'
import unzip from 'lodash/array/unzip'
import zipObject from 'lodash/array/zipObject'
import findScheduleFromCourses from './find-schedule-from-courses'

export default function createSchedules(courses) {
	let [terms, groupedCourses] = unzip(pairs(groupBy(courses, 'term')))

	console.log(terms, groupedCourses)

	console.log('grouped courses by term')
	let start = performance.now()

	let semesters = map(groupedCourses, findScheduleFromCourses)

	console.log('started schedule building')
	// let semesters = [findScheduleFromCourses(groupedCourses[1])]
	return Promise.settle(semesters)
		.then(resultPromiseInspections => {
			return map(resultPromiseInspections, promiseInspection => {
				// check if was successful
				if (promiseInspection.isFulfilled()) {
					return promiseInspection.value()
				}
				// check if the read failed
				else if (promiseInspection.isRejected()) {
					console.error(promiseInspection.reason())
				}
			})
		})
		.then(resultArrays => zipObject(terms, resultArrays))
		.then(results => {
			console.log(`total results took ${performance.now() - start}ms`, results)
			return results
		})
}
