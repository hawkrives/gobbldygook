import {Seq} from 'immutable'
import add from '../helpers/add'

let countCredits = (courses) => Seq(courses)
	.filter(c => c)
	.map(c => c.credits)
	.reduce(add, 0)

export default countCredits
