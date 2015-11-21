/* olaf-count-courses-with-ges
 * This script takes a list of terms (f.ex. 20151 for Fall 2015) and returns the number of courses
 * with ge requirements, grouped by the number of ge requirements it offeers, per term.
 */

import nomnom from 'nomnom'
import Promise from 'bluebird'
import search from './lib/search-for-courses'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import zipObject from 'lodash/array/zipObject'
import groupBy from 'lodash/collection/groupBy'
import yaml from 'js-yaml'

function findCoursesWithGes(term) {
	return search({riddles: [{term}]})
}

export async function cli() {
	const args = nomnom()
		.script('olaf-count-courses-with-ges')
		.option('terms', {position: 0, list: true, required: true, help: 'the years or terms to search for: 2015, or 20141, etc.'})
		.parse()

	args.terms = args.terms.reduce((list, term) => {
		let stringterm = String(term)
		if (stringterm.length === 4) {
			return list.concat([1, 2, 3, 4, 5].map(s => parseInt(`${stringterm}${s}`)))
		}
		return list.concat(term)
	}, [])

	const courses = zipObject(
		await Promise.all(
			map(
				args.terms,
				async term => [
					term,
					await findCoursesWithGes(term),
				])))

	const groupedByGeCount = mapValues(
		courses,
		list => mapValues({
			...groupBy(list, c => c.gereqs && c.gereqs.length || 0),
			total: list,
		}, l => l.length))

	console.log(yaml.safeDump(groupedByGeCount))
}
