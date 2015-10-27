import curry from 'lodash/function/curry'
import contains from 'lodash/collection/contains'
import any from 'lodash/collection/any'
import isArray from 'lodash/lang/isArray'

function checkIfHasDepartment(dept, course) {
	return contains(course.depts, dept)
}

let hasDepartment = curry((dept, course) => {
	if (isArray(dept)) {
		return any(dept, d => checkIfHasDepartment(d, course))
	}
	return checkIfHasDepartment(dept, course)
})

export default hasDepartment
