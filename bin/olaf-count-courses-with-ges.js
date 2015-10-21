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
		.option('term', {list: true, default: []})
		.option('year', {list: true, default: []})
		.parse()

	args.term = args.term.concat(...args.year.map(y => [1, 2, 3, 4, 5].map(s => parseInt(`${y}${s}`))))
	const courses = zipObject(await Promise.all(map(args.term, async term => [term, await findCoursesWithGes(term)])))

	// console.log(courses)
	// const counts = mapValues(courses, c => c.length)
	// console.log(counts)

	const groupedByGeCount = mapValues(courses, list => mapValues({...groupBy(list, c => c.gereqs && c.gereqs.length || 0), total: list}, l => l.length))
	console.log(yaml.safeDump(groupedByGeCount))
	// console.log(sparkly(sizes))
}
