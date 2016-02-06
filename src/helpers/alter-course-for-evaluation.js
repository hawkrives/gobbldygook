import mapKeys from 'lodash/mapKeys'

export default function alterCourse(course) {
	return mapKeys(course, (value, key) => {
		if (key === 'depts') {
			key = 'department'
		}
		else if (key === 'num') {
			key = 'number'
		}
		return key
	})
}
