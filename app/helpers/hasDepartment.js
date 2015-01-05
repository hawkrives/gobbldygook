import * as _ from 'lodash'

let checkIfHasDepartment = (dept, course) => {
	return _.contains(course.depts, dept)
}

let hasDepartment = _.curry((dept, course) => {
	if (_.isArray(dept))
		return _.any(dept, (d) => checkIfHasDepartment(d, course))
	return checkIfHasDepartment(dept, course)
})

export default hasDepartment
