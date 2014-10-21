'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'

import readJson from './readJson'
import add from './add'
import {db, courseCache} from './db'
import {buildDeptNum, buildDept} from './deptNum'
import {discoverRecentYears} from './recentTime'

var logDataLoading = false
// var logDataLoading = true

function primeCourseCache() {
	console.log('Priming course cache')
	return Promise.all(_.map(discoverRecentYears(), function(year) {
		console.log(year, courseCache)
		return db.store('courses').index('year').get(year).then(function(courses) {
			_.map(courses, c => {
				c.dept = buildDept(c)
				courseCache[c.clbid] = c
			})
		})
	}))
}

function storeCourses(item) {
	return new Promise(function(resolve, reject) {
		console.log(item.meta.path, 'called storeCourses')

		var courses = _.map(item.data.courses, function(course) {
			course.sourcePath = item.meta.path
			course.deptnum = buildDeptNum(course)
			course.dept = buildDept(course)
			return course
		})

		db.store('courses').batch(courses)
			.then(function(results) {
				resolve(item)
			}).catch(function (records, err) {
				reject(err)
			})
	})
}

function storeArea(item) {
	return new Promise(function(resolve, reject) {
		console.log(item.meta.path, 'called storeArea')

		var area = item.data.info
		area.sourcePath = item.meta.path

		db.store('areas').put(area)
			.then(function(results) {
				resolve(item)
			})
			.catch(function(records, err) {
				reject(err)
			})
	})
}

function storeItem(item) {
	if (item.type === 'courses') {
		return storeCourses(item)
	} else if (item.type === 'areas') {
		return storeArea(item)
	}
}

function cleanPriorData(item) {
	return new Promise(function (resolve, reject) {
		var path = item.meta.path
		console.info('deleting ' + item.type + ' from ' + path)

		db.store(item.type)
			.index('sourcePath')
			.get(path)
			.then(function(items) {
				return _.map(items, function(item) {
					var result = Object.create(null)
					result[item.clbid] = null
					return result
				})
			})
			.then(function(items) {
				return db.store(item.type).batch(items)
			})
			.then(function(items) {
				localStorage.removeItem(path)
				resolve(item)
			})
			.catch(function(err) {
				reject(err)
			})
	})
}

function cacheItemHash(item) {
	return new Promise(function(resolve, reject) {
		console.info(item.meta.path + ' called cacheItemHash')
		localStorage.setItem(item.meta.path, item.meta.hash)
		resolve(item)
	})
}

var lookup = {
	'courses': 'courses',
	'areas': 'info'
}

function updateDatabase(itemType, infoFromServer) {
	infoFromServer.path = '/data/' + itemType + '/' + infoFromServer.path
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash
	var itemPath = infoFromServer.path

	if (newHash === oldHash) {
		if (logDataLoading)  console.log('skipped ' + itemPath)
		return Promise.resolve(false)
	}

	if (logDataLoading)  console.log('need to add ' + itemPath)

	return readJson(itemPath)
		.then(function(data) {
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
		.catch(function(err) {
			return Promise.reject(err.stack)
		})
		.done(function(item) {
			if (logDataLoading)
				console.log('added ' + item.meta.path + ' (' + item.count + ' ' + item.type + ')')
			return Promise.resolve(true)
		})
}

function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	return Promise.all(_.map(infoFile.info, function(files) {
		return Promise.all(_.map(files, function(file) {
			return updateDatabase(infoFile.type, file)
		}))
	}))
}

function loadInfoFile(url) {
	console.log('loading' + url)
	return readJson(url).then(loadDataFiles)
}

function loadData() {
	var infoFiles = [
		'/data/areas/info.json',
		'/data/courses/info.json',
	]
	return Promise.all(_.map(infoFiles, loadInfoFile)).then(primeCourseCache)
}

window.loadData = loadData
export default loadData
