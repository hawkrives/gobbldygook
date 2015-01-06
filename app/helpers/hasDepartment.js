import {curry, contains, any, isArray} from 'lodash'

let checkIfHasDepartment = (dept, course) => {
	return contains(course.depts, dept)
}

let hasDepartment = curry((dept, course) => {
	if (isArray(dept))
		return any(dept, (d) => checkIfHasDepartment(d, course))
	return checkIfHasDepartment(dept, course)
})

export default hasDepartment
