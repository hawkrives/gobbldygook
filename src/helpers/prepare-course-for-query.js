import mapValues from 'lodash/object/mapValues'
import isArray from 'lodash/lang/isArray'
import cloneDeep from 'lodash/lang/cloneDeep'

export default function prepareCourseForQuery(course) {
	course = cloneDeep(course)

	delete course.type
	delete course.grade

	course = mapValues(course, value => {
		return isArray(value) ? value : [value]
	})

	return course
}
