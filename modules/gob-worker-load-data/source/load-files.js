// @flow

import uniqueId from 'lodash/uniqueId'
import {status, json} from '@gob/lib'
import {Notification} from './lib-dispatch'
import needsUpdate from './needs-update'
import updateDatabase from './update-database'
import removeDuplicateAreas from './remove-duplicate-areas'
import type {InfoFileTypeEnum, InfoFileRef, InfoIndexFile} from './types'

type Args = {|
	baseUrl: string,
	notification: Notification,
	type: InfoFileTypeEnum,
|}

export default function loadFiles(url: string, baseUrl: string) {
	console.log(`fetching ${url}`)

	return fetch(url)
		.then(status)
		.then(json)
		.then(data => proceedWithUpdate(baseUrl, ((data: any): InfoIndexFile)))
		.catch(err => handleErrors(err, url))
}

export async function proceedWithUpdate(baseUrl: string, data: InfoIndexFile) {
	const type: InfoFileTypeEnum = data.type
	const notification = new Notification(type)
	const oldestYear = new Date().getFullYear() - 5
	const args = {type, notification, baseUrl}

	const files = await getFilesToLoad(type, oldestYear, data)
	const filtered = await filterFiles(type, files)
	await slurpIntoDatabase(args, filtered)

	await deduplicateAreas(args)
	await finishUp(args)
}

export async function loadTerm(
	term: number,
	courseInfoUrl: string,
	baseUrl: string,
) {
	let data: InfoIndexFile = (await fetch(courseInfoUrl)
		.then(status)
		.then(json): any)

	const type: InfoFileTypeEnum = data.type
	const notification = new Notification(type, String(uniqueId()))

	const args = {type, notification, baseUrl}

	const files = data.files.filter(f => f.type === 'json' && f.term === term)
	const filtered = await filterFiles(type, files)
	await slurpIntoDatabase(args, filtered)

	await deduplicateAreas(args)
	await finishUp(args)
}

export function getFilesToLoad(
	type: InfoFileTypeEnum,
	oldestYear: number,
	data: InfoIndexFile,
) {
	let files = data.files

	if (type === 'courses') {
		files = files.filter(f => filterForRecentCourses(f, oldestYear))
	}

	return files
}

export async function filterFiles(
	type: InfoFileTypeEnum,
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

export async function slurpIntoDatabase(
	{type, baseUrl, notification}: Args,
	files: Array<InfoFileRef>,
) {
	// Exit early if nothing needs to happen
	if (files.length === 0) {
		console.log(`[${type}] no files need loading`)
		return
	}

	console.log(`[${type}] these files need loading:`, ...files)

	// Fire off the progress bar
	notification.start(files.length)

	// Load them into the database
	for (let file of files) {
		// We need to run these sequentially, so we'll await within a loop.
		// eslint-disable-next-line no-await-in-loop
		await updateDatabase(type, baseUrl, notification, file)
	}
}

export function deduplicateAreas({type}: Args) {
	// Clean up the database a bit
	if (type === 'areas') {
		return removeDuplicateAreas()
	}
}

export function finishUp({notification}: Args) {
	// Remove the progress bar after 1.5 seconds
	notification.remove()
}

function handleErrors(err: Error, url: string) {
	if (err.message.startsWith('Failed to fetch')) {
		console.log(`Failed to fetch ${url}`)
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
