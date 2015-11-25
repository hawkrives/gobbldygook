import {tryReadJsonFile} from './read-file'

import flatten from 'lodash/array/flatten'
import filter from 'lodash/collection/filter'
import forEach from 'lodash/collection/forEach'
import uniq from 'lodash/array/uniq'
import isString from 'lodash/lang/isString'
import sortByAll from 'lodash/collection/sortByAll'

import {cacheDir} from './dirs'

import Promise from 'bluebird'
import fsCallbacks from 'graceful-fs'
const fs = Promise.promisifyAll(fsCallbacks)

import {checkForStaleData} from './update-local-data-cache'

import map from 'lodash/collection/map'
import path from 'path'

import quacksLikeDeptNum from '../../src/helpers/quacks-like-dept-num'
import splitDeptNum from '../../src/helpers/split-dept-num'

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
		filtered = uniq(filtered, unique)
	}

	if (sort) {
		filtered = sortByAll(filtered, flatten(sort))
	}

	return filtered
}
