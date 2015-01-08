import {all, contains} from 'lodash'

function isAsianCon(course) {
	return all([
		hasDepartment('ASIAN', c),
		contains([210, 215, 216, 220], c.num), // these are the asiancon course numbers
	])
}

export default isAsianCon
