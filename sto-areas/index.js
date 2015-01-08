import _ from 'lodash'

import major from './major'
import concentration from './concentration'
import emphasis from './emphasis'
import degree from './degree'

let areas = [major, concentration, emphasis, degree]
let allAreas = _(areas)
	.map(_.toArray)
	.flatten()
	.value()

let areaNotFound = {
	title: 'Not Found',
	years: [null, null],
	id: 'a-notfound',
	type: 'not-found',
	departmentAbbr: 'NOTFOUND',
	check: null,
}
Object.freeze(areaNotFound)

/**
 * Finds an area of study.
 *
 * @param {String} id - the id to find.
 * @param {Number} yearOfGraduation - the year the student matriculated.
 * @returns {Object} - an area of study.
 */
let findAreaOfStudy = (id, yearOfGraduation) => {
	let area = _.find(allAreas, (area) => {
		if (!area.id || area.id !== id)
			return false

		if (!area.years)
			return false

		let [startYear, endYear] = area.years

		let yearIsBetween = false
		if (_.isNull(endYear) && startYear <= yearOfGraduation)
			yearIsBetween = true
		else if (endYear >= yearOfGraduation && startYear <= yearOfGraduation)
			yearIsBetween = true

		return yearIsBetween
	})

	return area || areaNotFound
}

export default findAreaOfStudy
