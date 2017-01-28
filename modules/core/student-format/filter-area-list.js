import reject from 'lodash/reject'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'

function convertRevisionToYear(rev) {
	// The +1 is because the year is the beginning of the academic year, but
	// the graduation is the end.
	return Number((rev || '').split('-')[0]) + 1
}

// Matricated in: 2014
// Graduates in:  2018

// Physics (2011-12)
// Physics (2015-16)

// If there's only one Physics major, then anyone can see and choose it.
// Otherwise, if there are more than one, then the list gets culled.

// The newest revision of a major is always available, unless the 'available
// through' key is set.

// You can only enroll in a major if there isn't a newer one, unless your
// class year is between the previous one and the newest.

export function filterAreaList(areas, { graduation }) {
	// Remove all areas that are closed to new class years.
	let onlyAvailableAreas = reject(areas,
		area => area['available through'] && area['available through'] <= graduation)

	// Group them together to filter them down
	const groupedAreas = groupBy(onlyAvailableAreas, area => `(${area.name}, ${area.type})`)

	onlyAvailableAreas = flatten(map(groupedAreas, areaSet => {
		// The newest revision of a major is always available, unless the
		// 'available through' key is set. (We took care of that up above.)
		if (areaSet.length === 1) {
			return areaSet
		}

		// You can only enroll in a major if there isn't a newer one, unless
		// your class year is between the prior revision and the newest revision.

		// We'll start out by sorting them.
		areaSet = sortBy(areaSet, 'revision')

		// Now for the filtering.
		return filter(areaSet, (area, i, list) => {
			// Get the year for this area.
			let revision = convertRevisionToYear(area.revision)

			// If we're not at the end of the list,
			if (i < areaSet.length - 1) {
				// grab the next revision, and see if the graduation year
				// falls between the two revisions.
				// if it does, then this revision is *available*.
				let nextAreaRevision = convertRevisionToYear(list[i+1].revision)
				return revision <= graduation && graduation <= nextAreaRevision
			}
			else {
				// the last revision is always available
				return revision <= graduation
			}

		})
	}))

	return onlyAvailableAreas
}
