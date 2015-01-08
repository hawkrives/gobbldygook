import {curry, contains} from 'lodash'

let hasGenEd = curry((gened, course) =>
	contains(course.gereqs, gened))

export default hasGenEd
