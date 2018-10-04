// @flow

import present from 'present'
import prepareCourse from './lib-prepare-course'
import {quotaExceededError} from './lib-dispatch'
import {db} from './db'
import type {InfoFileTypeEnum} from './types'
import prettyMs from 'pretty-ms'

type BasicCourse = Object
type BasicArea = {type: string}

export function storeCourses(path: string, data: Array<BasicCourse>) {
	console.log(`courses: storing ${path}`)

	let coursesToStore = data.map(course => ({
		...course,
		...prepareCourse(course),
		sourcePath: path,
	}))

	const start = present()

	const onSuccess = () => {
		let time = present() - start
		console.log(
			`stored ${coursesToStore.length} courses in ${prettyMs(time)}.`,
		)
	}

	// istanbul ignore next
	const onFailure = err => {
		const db = err.target.db.name
		const errorName = err.target.error.name

		// istanbul ignore else
		if (errorName === 'QuotaExceededError') {
			quotaExceededError(db)
		}

		throw err
	}

	return db
		.store('courses')
		.batch(coursesToStore)
		.then(onSuccess, onFailure)
}

export function storeArea(path: string, data: BasicArea) {
	console.log(`areas: storing ${path}`)

	const area = {
		...data,
		type: data.type.toLowerCase(),
		sourcePath: path,
		dateAdded: new Date(),
	}

	const start = present()

	const onSuccess = () => {
		let time = present() - start
		console.log(`stored area ${path} in ${prettyMs(time)}.`)
	}

	// istanbul ignore next
	const onFailure = err => {
		const db = err.target.db.name
		const errorName = err.target.error.name

		// istanbul ignore else
		if (errorName === 'QuotaExceededError') {
			quotaExceededError(db)
		}

		throw err
	}

	return db
		.store('areas')
		.put(area)
		.then(onSuccess, onFailure)
}

export default function storeData(
	path: string,
	type: InfoFileTypeEnum,
	data: any,
) {
	// istanbul ignore else
	if (type === 'courses') {
		return storeCourses(path, data)
	} else if (type === 'areas') {
		return storeArea(path, data)
	}
}
