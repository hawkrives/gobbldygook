'use strict';

import * as _ from 'lodash'
import add from './add'

var countCredits = function(courses) {
	return _.chain(courses).pluck('credits').reduce(add).value()
}

export default countCredits
