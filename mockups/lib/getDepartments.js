import _ from 'lodash'

function getDepartments(courses) {
	return _(courses).pluck('depts').flatten().uniq().value()
}

export default getDepartments
