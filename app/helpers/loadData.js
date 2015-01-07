import _ from 'lodash'
import Promise from 'bluebird'

import {status, json} from 'app/helpers/fetch'
import db from 'app/helpers/db'
import {buildDeptNum, buildDept} from 'app/helpers/deptNum'
import {discoverRecentYears} from 'app/helpers/recentTime'
import {convertTimeStringsToOfferings} from 'app/helpers/time'

let logDataLoading = false
// let logDataLoading = true

function prepareCourse(course) {
	course.dept = course.dept || buildDept(course)
	course.deptnum = course.deptnum || buildDeptNum(course)
	course.offerings = course.offerings || convertTimeStringsToOfferings(course)
	return course
}

function storeCourses(item) {
	console.log('storing courses')
	let start = performance.now()

	let coursesToStore = _.map(item.data.courses, (course) => {
		course.sourcePath = item.meta.path
		return prepareCourse(course)
	})

	return db.store('courses').batch(coursesToStore)
		.then((results) => {
			let end = performance.now()
			console.log('Stored courses in', (end - start) + 'ms.')
			return item
		})
		.catch((records, err) => {
			throw err
		})
}

function storeArea(item) {
	console.log(item.meta.path, 'called storeArea')

	let area = item.data.info
	area.sourcePath = item.meta.path

	return db.store('areas').put(area)
		.then((results) => {
			return item
		})
		.catch((records, err) => {
			throw err
		})
}

function storeItem(item) {
	if (item.type === 'courses') {
		return storeCourses(item)
	}
	else if (item.type === 'areas') {
		return storeArea(item)
	}
}

function cleanPriorData(item) {
	let path = item.meta.path
	console.info('deleting ' + item.type + ' from ' + path)

	return db.store(item.type)
		.index('sourcePath')
		.get(path)
		.then((items) => {
			return _.map(items, (item) => {
				let result = Object.create(null)
				result[item.clbid] = null
				return result
			})
		})
		.then((items) => db.store(item.type).batch(items))
		.then(() => {
			localStorage.removeItem(path)
			return item
		})
		.catch((err) => {
			throw err
		})
}

function cacheItemHash(item) {
	return new Promise((resolve, reject) => {
		console.info(item.meta.path + ' called cacheItemHash')
		localStorage.setItem(item.meta.path, item.meta.hash)
		resolve(item)
	})
}

let lookup = {
	courses: 'courses',
	areas: 'info',
}

function updateDatabase(itemType, infoFromServer) {
	let oldHash = localStorage.getItem(infoFromServer.path)
	let newHash = infoFromServer.hash

	let itemUrl = _.template('./data/${type}/${path}?v=${hash}',
		{type: itemType, path: infoFromServer.path, hash: newHash})

	if (newHash === oldHash) {
		if (logDataLoading)  console.log('skipped ' + itemUrl)
		return Promise.resolve(false)
	}

	if (logDataLoading)  console.log('need to add ' + itemUrl)

	return fetch(itemUrl)
		.then(status)
		.then(json)
		.then((data) => {
			return {
				data: data,
				meta: infoFromServer,
				type: itemType,
				count: _.size(data[lookup[itemType]]) || 1,
			}
		})
		.then(cleanPriorData)
		.then(storeItem)
		.then(cacheItemHash)
		.then((item) => {
			if (logDataLoading)
				console.log('added ' + item.meta.path + ' (' + item.count + ' ' + item.type + ')')
		})
		.catch((err) => {
			return Promise.reject(err.stack)
		})
}

function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	let files = _(infoFile.files)
		.filter((file) => parseInt(file.year, 10) > new Date().getFullYear() - 5)
		.map((file) => updateDatabase(infoFile.type, file))
		.flatten()
		.value()

	return Promise.all(files).then(() => Promise.resolve(true))
}

function loadInfoFile(url) {
	console.log('loading ' + url)
	return fetch(url)
		.then(status)
		.then(json)
		.then(loadDataFiles)
}

function loadData() {
	let infoFiles = [
		'./data/areas/info.json',
		'./data/courses/info.json',
	]
	return Promise.all(_.map(infoFiles, loadInfoFile))
}

export default loadData
