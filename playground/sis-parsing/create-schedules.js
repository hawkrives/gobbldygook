import _ from 'lodash'
import map from 'lodash/collection/map'
import zipObject from 'lodash/array/zipObject'
import findScheduleFromCourses from './find-schedule-from-courses'

export default function createSchedules(courses) {
	let [terms, groupedCourses] = _(courses)
		.groupBy('term')
		.pairs()
		.unzip()
		.value()

	console.log(terms, groupedCourses)

	console.log('grouped courses by term')
	let start = performance.now()

	let semesters = map(groupedCourses, findScheduleFromCourses)

	console.log('started schedule building')
	// let semesters = [findScheduleFromCourses(groupedCourses[1])]
	return Promise
		.settle(semesters)
		.then(resultPromiseInspections => {
			return map(resultPromiseInspections, (promiseInspection) => {
				if (promiseInspection.isFulfilled()) {  // check if was successful
					return promiseInspection.value()
				}
				else if (promiseInspection.isRejected()) { // check if the read failed
					console.error(promiseInspection.reason())
				}
			})
		})
		.then(resultArrays => zipObject(terms, resultArrays))
		.then(results => {
			console.log(`total results took ${performance.now() - start}ms`, results)
			return results
		})
		.done()
}
