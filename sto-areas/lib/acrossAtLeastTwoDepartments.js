import {size} from 'lodash'
import getDepartments from './getDepartments'

function acrossAtLeastTwoDepartments(courses) {
	let depts = getDepartments(courses)

	return size(depts) >= 2
}

export default acrossAtLeastTwoDepartments
