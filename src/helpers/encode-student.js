import stringify from 'stabilize'

export default function encodeStudent(student) {
	return encodeURIComponent(stringify(student))
}
