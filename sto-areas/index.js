import major from './major'
import concentration from './concentration'
import emphasis from './emphasis'
import degree from './degree'

import _ from 'lodash'
let areas = [major, concentration, emphasis, degree]
let allAreas = _(areas).map(_.toArray).flatten().value()
// console.log(allAreas)

/**
 * Finds an area of study.
 *
 * @param {Object} args - a lodash filter object.
 * @returns {Object} - An area of study.
 */
let find = (args={}) => {
	return _.find(allAreas, args)
}

export {major, concentration, emphasis, degree, find}
