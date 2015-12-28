import stringify from 'json-stable-stringify'

export default function encodeStudent(student) {
	return encodeURIComponent(stringify(student))
}
