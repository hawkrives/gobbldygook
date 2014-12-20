import * as _ from 'lodash'

var checkIfHasDepartment = (dept, course) => {
	return _.contains(course.depts, dept)
}

var hasDepartment = _.curry((dept, course) => {
	if (_.isArray(dept))
		return _.any(dept, (d) => checkIfHasDepartment(d, course))
	return checkIfHasDepartment(dept, course)
})

export default hasDepartment
