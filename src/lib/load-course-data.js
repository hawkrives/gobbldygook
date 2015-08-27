import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import startsWith from 'lodash/string/startsWith'
import present from 'present'
import yaml from 'js-yaml'

import notificationActions from '../flux/notification-actions'
import {status, json, text} from './fetch-helpers'
import {
	courseDb,
	areaDb,
	cacheDb,
} from './db'

import buildDept from '../helpers/build-dept'
import buildDeptNum from '../helpers/build-dept-num'
import splitParagraph from '../helpers/split-paragraph'
import {convertTimeStringsToOfferings} from 'sto-sis-time-parser'

import debug from 'debug'
let log = debug('gobbldygook:data')
debug.disable('gobbldygook:data')

import uniq from 'lodash/array/uniq'
import sortBy from 'lodash/collection/sortBy'
import flatten from 'lodash/array/flatten'

function prepareCourse(course) {
	course.name = course.name || course.title
	course.dept = course.dept || buildDept(course)
	course.deptnum = course.deptnum || buildDeptNum(course)
	course.offerings = course.offerings || convertTimeStringsToOfferings(course)

	const nameWords = splitParagraph(course.name)
	const notesWords = splitParagraph(course.notes)
	const titleWords = splitParagraph(course.title)
	const descWords = splitParagraph(course.desc)

	course.words = uniq(sortBy([...nameWords, ...notesWords, ...titleWords, ...descWords]), true)
	course.profWords = uniq(sortBy(flatten(map(course.instructors, splitParagraph))), true)

	return course
}

async function storeCourses(item) {
	log('storing courses')
	const start = present()

	const coursesToStore = map(item.data, course => {
		course._id = String(course.clbid)
		course.sourcePath = item.path
		return prepareCourse(course)
	})

	try {
		await courseDb.bulkDocs(coursesToStore)
	}
	catch (err) {
		console.error(err)
		throw err
	}

	log(`Stored ${size(coursesToStore)} courses in ${present() - start}ms.`)
	return item
}

async function storeArea(item) {
	log(item.path, 'called storeArea')

	const id = item.path

	let area = {
		...item.data,
		sourcePath: item.path,
		type: item.data.type.toLowerCase(),
		_id: id,
	}

	try {
		await areaDb.upsert(id, () => area)
	}
	catch(e) {
		throw e
	}

	return item
}

function storeItem(item) {
	if (item.type === 'courses') {
		return storeCourses(item)
	}
	else if (item.type === 'areas') {
		return storeArea(item)
	}
}

async function cleanPriorData({path, type}) {
	log(`deleting ${type} from ${path}`)

	let db
	if (type === 'courses') {
		db = courseDb
	}
	else if (type === 'areas') {
		db = areaDb
	}
	else {
		throw new ReferenceError(`"${type}" is not a valid database!`)
	}

	let oldItems = []
	try {
		oldItems = await db.find({
			selector: {sourcePath: {$eq: path}},
			fields: ['_id', '_rev'],  // only return what we need to delete them
		})
	}
	catch (e) {
		throw e
	}

	oldItems = map(oldItems, item => ({...item, _deleted: true}))

	try {
		await db.bulkDocs(oldItems)
	}
	catch (e) {
		throw e
	}

	try {
		const oldHashDoc = await cacheDb.get(path)
		await cacheDb.remove(oldHashDoc)
	}
	catch (err) {
		if (err.status !== 404) {
			console.error('could not remove old hash from database')
			throw err
		}
	}
}

async function cacheItemHash(item) {
	log(`${item.path} called cacheItemHash`)
	cacheDb.put({_id: item.path, hash: item.hash})
	return item
}

async function updateDatabase(type, infoFromServer, infoFileBase, notificationId, count) {
	let {path, hash} = infoFromServer
	let oldHash = undefined
	try {
		({hash: oldHash} = await cacheDb.get(path))
	}
	catch (err) {
		// 404 is 'doc not found', so we don't care about it
		if (err.status !== 404) {
			throw err
		}
	}

	let itemUrl = `/${path}?v=${hash}`

	if (hash === oldHash) {
		log(`skipped ${path}`)
		return true
	}

	notificationActions.startProgress(notificationId, `Loading ${type}`, {max: count}, true)

	log(`need to add ${path}`)

	const url = infoFileBase + itemUrl
	let data = undefined
	try {
		data = await fetch(url)
			.then(status)
			.then(text)
	}
	catch (err) {
		console.error('Could not fetch ${url}')
		return false
	}

	try {
		data = JSON.parse(data)
	}
	catch (err) {
		data = yaml.safeLoad(data)
	}

	const item = {
		...infoFromServer,
		path,
		hash,
		data,
		type,
		count: size(data),
	}

	try {
		await cleanPriorData(item)
		await storeItem(item)
		await cacheItemHash(item)
	}
	catch (e) {
		throw e
	}

	log(`added ${item.path} (${item.count} ${item.type})`)
	notificationActions.incrementProgress(notificationId)
}

async function loadDataFiles(infoFile, infoFileBase) {
	log('load data files', infoFile)

	let notificationId = infoFile.type
	let filesToLoad = infoFile.files

	if (infoFile.type === 'courses') {
		// Only get the last four years of data
		const oldestYear = new Date().getFullYear() - 4
		filesToLoad = filter(filesToLoad, file => file.year >= oldestYear)
	}

	// Load them into the database
	await* map(filesToLoad, file =>
		updateDatabase(infoFile.type, file, infoFileBase, notificationId, size(filesToLoad))
			.catch(err => {
				throw err
			}))

	notificationActions.removeNotification(notificationId, 1500)
}

async function loadInfoFile(url, infoFileBase) {
	log('loading ' + url)
	let infoFile
	try {
		infoFile = await fetch(url).then(status).then(json)
	}
	catch (err) {
		if (startsWith(err.message, 'Failed to fetch')) {
			console.error(`loadInfoFile(): Failed to fetch ${url}`)
			return false
		}
		else {
			throw err
		}
	}

	try {
		await loadDataFiles(infoFile, infoFileBase)
	}
	catch (err) {
		throw err
	}
}

export default async function loadData() {
	const cachebuster = Date.now()

	const infoFiles = [
		'./courseData.url',
		'./areaData.url',
	]

	const processedFiles = await* map(infoFiles,
		file => fetch(file)
			.then(status)
			.then(text)
			.then(path => path.trim())
			.catch(err => console.error(err)))

	try {
		await* map(processedFiles, path => loadInfoFile(`${path}/info.json?${cachebuster}`, path))
	}
	catch (err) {
		console.error(err)
		throw err
	}
}
