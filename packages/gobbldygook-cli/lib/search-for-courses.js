import {tryReadJsonFile} from './read-file'

import flatten from 'lodash/flatten'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import uniqBy from 'lodash/uniqBy'
import isString from 'lodash/isString'
import sortBy from 'lodash/sortBy'

import {cacheDir} from './dirs'

import {checkForStaleData} from './update-local-data-cache'

import map from 'lodash/map'
import path from 'path'

import quacksLikeDeptNum from '../../src/helpers/quacks-like-dept-num'
import splitDeptNum from '../../src/helpers/split-dept-num'

import Promise from 'bluebird'
import fsCallbacks from 'graceful-fs'
const fs = Promise.promisifyAll(fsCallbacks)

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
