var readJson = require('./readJson')
var Promise = require("bluebird")
var _ = require('lodash')

// get info.json
// for each list in file['info'],
	// check ['hash'] against the db's hash
		// if it matches, return.
		// else, request the file from ['path'],
			// delete the pervious data.
			// and store the new data in the database

var pathPrefix = '/data/'

function deleteItems(items) {
	// console.log('items to delete', items)
	// TODO: Delete items.
}

function storeItem(item) {
	if (item.type === 'courses') {
		_.map(item.data.courses, function(course) {
			course.sourcePath = item.meta.path
			// window.server.courses.add(course).done(function(){console.log('a course has been added')})
		})
		window.server.courses.add.apply(window.server, item.data.courses).done(function() {
			console.log('courses have been added')
		})
	}
	if (item.type === 'areas') {
		item.data.info.sourcePath = item.meta.path
		return window.server.areas.add(item.data.info).done(function(results) {
			console.log('an area has been added')
		})
	}
}

function cleanPriorData(item) {
	return new Promise(function(resolve, reject) {
		var path = item.meta.path
		var hash = item.meta.hash

		// Clear out old courses ...
		window.server.courses.query('sourcePath')
			.only(path)
			.execute()
			.done(deleteItems)

		// ... areas of study ...
		window.server.areas.query('sourcePath')
			.only(path)
			.execute()
			.done(deleteItems)

		// ... and the paths themselves.
		localStorage.removeItem(path)
		localStorage.setItem(path, hash)

		resolve(item)
	})
}

function getInfoFromDb(sourcePath) {
	// console.log('getItemFromDb', sourcePath)
	return new Promise(function(resolve, reject) {
		window.server.sources.query('path')
			.only(sourcePath)
			.execute()
			.done(function(data) {
				if (data.length > 0)
					resolve(data[0])
				else
					resolve()
			})
	})
}

function updateDatabase(itemType, infoFromServer) {
	infoFromServer.path = '/data/' + itemType + '/' + infoFromServer.path
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash
	var itemPath = infoFromServer.path
	return new Promise(function(resolve, reject) {
		if (newHash !== oldHash) {
			console.log('have to add', itemPath)
			readJson(itemPath)
				.then(function(data) {return {data: data, meta: infoFromServer, type: itemType}})
				.then(cleanPriorData)
				.then(storeItem)
				.catch(function(err) {
					reject('adding error')
				})
				.done(function(){resolve('had to add ' + itemPath)})
		} else {
			resolve('bypassed adding ' + itemPath)
		}
	})
}

function loadDataFiles(info) {
	console.log('loadDataFiles', info)
	return new Promise.all(_.map(info.info, function(files) {
		return new Promise.all(_.map(files, function(file) {
			// console.log('loadDataFiles.Q.all', file)
			return updateDatabase(info.type, file)
		}))
	}))
}

function loadInfoFile(url) {
	console.log('loading', url)
	readJson(url)
		.then(loadDataFiles)
		.done()
}

function loadData() {
	var infoFiles = [
		'/data/areas/info.json',
		'/data/courses/info.json',
	]
	return new Promise.all(_.map(infoFiles, loadInfoFile))
}

module.exports = loadData
