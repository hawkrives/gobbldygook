const stringify = require('stabilize')

export default function encodeStudent(student) {
	return encodeURIComponent(stringify(student))
}
