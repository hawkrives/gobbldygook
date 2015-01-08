import {all, contains} from 'lodash'
import hasDepartment from 'app/helpers/hasDepartment'

function isAsianCon(course) {
	return all([
		hasDepartment('ASIAN', course),
		contains([210, 215, 216, 220], course.num), // these are the asiancon course numbers
	])
}

export default isAsianCon
