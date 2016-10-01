import stringify from 'stabilize'

export function encodeStudent(student) {
	return encodeURIComponent(stringify(student))
}
