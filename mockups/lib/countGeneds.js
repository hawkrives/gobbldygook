import _ from 'lodash'
import hasGenEd from './hasGenEd'
import hasFOL from './hasFOL'

function countGeneds(courses, gened) {
	let uniqed = _.uniq(courses, 'crsid')

	if (gened === 'FOL')
		return _(uniqed)
			.filter(hasFOL)
			.size()

	return _(uniqed)
		.filter(hasGenEd(gened))
		.size()
}

export default countGeneds
