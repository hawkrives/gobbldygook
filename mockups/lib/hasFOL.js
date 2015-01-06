import {any} from 'lodash'

function hasFOL(course) {
	return any(course.gereqs, (req) => req.substr(0, 3) === 'FOL')
}

export default hasFOL
