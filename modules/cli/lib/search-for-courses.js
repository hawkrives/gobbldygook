import {tryReadJsonFile} from './read-file'

import {flatten} from 'lodash'
import {filter} from 'lodash'
import {forEach} from 'lodash'
import {uniqBy} from 'lodash'
import {isString} from 'lodash'
import {sortBy} from 'lodash'

import {cacheDir} from './dirs'

import {checkForStaleData} from './update-local-data-cache'

import {map} from 'lodash'
import path from 'path'

import {quacksLikeDeptNum} from 'modules/schools/stolaf'
import {splitDeptNum} from 'modules/schools/stolaf'

import pify from 'pify'
const fs = pify(require('graceful-fs'))

function getDeptNumsFromRiddles(r) {
	if (isString(r) && quacksLikeDeptNum(r)) {
		return splitDeptNum(r)
	}
	return r
}

export default async function search({riddles, unique, sort}={}) {
	// check if data has been cached
	await checkForStaleData()

	let base = `${cacheDir}/Courses/`
	let courses = flatten(map(fs.readdirSync(base), fn => (tryReadJsonFile(path.join(base, fn)) || [])))

	riddles	= riddles.map(getDeptNumsFromRiddles)

	let filtered = courses
	forEach(riddles, riddle => {
		filtered = filter(filtered, riddle)
	})

	if (unique) {
		filtered = uniqBy(filtered, unique)
	}

	if (sort) {
		filtered = sortBy(filtered, flatten(sort))
	}

	return filtered
}
