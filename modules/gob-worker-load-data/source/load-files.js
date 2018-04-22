// @flow

import startsWith from 'lodash/startsWith'
import series from 'p-series'
import {status, json} from '@gob/lib'
import debug from 'debug'
import {refreshCourses, refreshAreas, Notification} from './lib-dispatch'
import needsUpdate from './needs-update'
import updateDatabase from './update-database'
import removeDuplicateAreas from './remove-duplicate-areas'
import type {InfoFileTypeEnum, InfoFileRef, InfoIndexFile} from './types'
const log = debug('worker:load-data:load-files')

const fetchJson = (...args): Promise<mixed> => {
	return fetch(...args)
		.then(status)
		.then(json)
}

type Args = {|
	baseUrl: string,
	notification: Notification,
	oldestYear: number,
	type: InfoFileTypeEnum,
|}

export default function loadFiles(url: string, baseUrl: string) {
	log(url)

	return fetchJson(url)
		.then(data => {
			return proceedWithUpdate(baseUrl, ((data: any): InfoIndexFile))
		})
		.catch(err => handleErrors(err, url))
}

export async function proceedWithUpdate(baseUrl: string, data: InfoIndexFile) {
	const type: InfoFileTypeEnum = data.type
	const notification = new Notification(type)
	const oldestYear = new Date().getFullYear() - 5
	const args = {type, notification, baseUrl, oldestYear}

	const files = await getFilesToLoad(args, data)
	const filtered = await filterFiles(args, files)
	await slurpIntoDatabase(args, filtered)

	await deduplicateAreas(args)
	await finishUp(args)
}

export function getFilesToLoad({type, oldestYear}: Args, data: InfoIndexFile) {
	let files = data.files

	if (type === 'courses') {
		files = files.filter(f => filterForRecentCourses(f, oldestYear))
	}

	return files
}

export async function filterFiles(
	{type}: Args,
	files: InfoFileRef[],
): Promise<Array<InfoFileRef>> {
	// For each file, see if it needs loading. We then update each promise
	// with either the path or `null`.
	const promises = files.map(async (file: InfoFileRef) => {
		if (await needsUpdate(type, file.path, file.hash)) {
			return file
		}
		return null
	})

	// Finally, we filter the items
	// $FlowFixMe
	return (await Promise.all(promises)).filter(Boolean)
}

export function slurpIntoDatabase(
	{type, baseUrl, notification}: Args,
	files: Array<InfoFileRef>,
) {
	// Exit early if nothing needs to happen
	if (files.length === 0) {
		log(`[${type}] no files need loading`)
		return
	}

	log(`[${type}] these files need loading:`, ...files)

	// Fire off the progress bar
	notification.start(files.length)

	// Load them into the database
	const runUpdate = file => () =>
		updateDatabase(type, baseUrl, notification, file)
	return series(files.map(runUpdate))
}

export function deduplicateAreas({type}: Args) {
	// Clean up the database a bit
	if (type === 'areas') {
		return removeDuplicateAreas()
	}
}

export function finishUp({type, notification}: Args) {
	log(`[${type}] done loading`)

	// Remove the progress bar after 1.5 seconds
	notification.remove()

	// istanbul ignore else
	if (type === 'courses') {
		return refreshCourses()
	} else if (type === 'areas') {
		return refreshAreas()
	}
}

function handleErrors(err: Error, url: string) {
	if (startsWith(err.message, 'Failed to fetch')) {
		log(`Failed to fetch ${url}`)
		return
	}
	throw err
}

export function filterForRecentCourses(file: InfoFileRef, oldestYear: number) {
	// Only download the json courses
	const isJson = file.type === 'json'

	// Only get the last four years of data
	const isRecent = file.year && file.year >= oldestYear

	return isJson && isRecent
}
