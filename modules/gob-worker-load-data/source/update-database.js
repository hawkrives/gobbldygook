// @flow

import {status, text} from '@gob/lib'

import parseData from './parse-data'
import cleanPriorData from './clean-prior-data'
import storeData from './store-data'
import cacheItemHash from './cache-item-hash'
import {Notification} from './lib-dispatch'

import type {InfoFileTypeEnum, InfoFileRef} from './types'

const fetchText = (...args): Promise<string> => {
	return fetch(...args)
		.then(status)
		.then(text)
}

export default function updateDatabase(
	type: InfoFileTypeEnum,
	infoFileBase: string,
	notification: Notification,
	{path, hash}: InfoFileRef,
) {
	console.log(`fetching ${path}`)

	// Append the hash, to act as a sort of cache-busting mechanism
	const url = `${infoFileBase}/${path}?v=${hash}`

	const nextStep = async (rawData: string) => {
		// now parse the data into a usable form
		const data = parseData(rawData, type)

		// clear out any old data
		await cleanPriorData(path, type)

		// store the new data
		await storeData(path, type, data)

		// record that we stored the new data
		await cacheItemHash(path, type, hash)
	}

	const onFailure = () => {
		console.warn(`Could not fetch ${url}`)
		notification.increment()
		return false
	}

	const onSuccess = () => {
		console.log(`added ${path}`)
		notification.increment()
		return true
	}

	// go fetch the data!
	return fetchText(url)
		.then(nextStep)
		.then(onSuccess)
		.catch(onFailure)
}
