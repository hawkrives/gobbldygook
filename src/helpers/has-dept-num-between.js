import any from 'lodash/collection/any'
import all from 'lodash/collection/all'
import curry from 'lodash/function/curry'
import isUndefined from 'lodash/lang/isUndefined'
import hasDepartment from './has-department'

let hasDeptNumBetween = curry(({dept, start, end}={}, course) => {
	if (any([dept, start, end], isUndefined)) {
		return false
	}

	return all([
		hasDepartment(dept, course),
		course.num >= start,
		course.num <= end,
	])
})

export default hasDeptNumBetween
