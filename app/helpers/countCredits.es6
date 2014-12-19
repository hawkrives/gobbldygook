import * as _ from 'lodash'
import add from 'helpers/add'

var countCredits = function(courses) {
	return _(courses).pluck('credits').reduce(add)
}

export default countCredits
