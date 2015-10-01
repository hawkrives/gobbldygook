import nom from 'nomnom'
import pkg from '../package.json'

import {userCacheDir} from 'appdirs'
const cacheDir = userCacheDir(pkg.name)

import Promise from 'bluebird'
import fsCallbacks from 'graceful-fs'
const fs = Promise.promisifyAll(fsCallbacks)
import 'isomorphic-fetch'
import {status, json, text} from '../src/lib/fetch-helpers'

import quacksLikeDeptNum from '../src/helpers/quacks-like-dept-num'
import splitDeptNum from '../src/helpers/split-dept-num'

function check() {}
function lint() {}

function loadFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(text)
		: fs.readFileAsync(pathOrUrl, {encoding: 'utf-8'})
	// return JSON.parse(fs.readFileSync(pathOrUrl, 'utf8'))
}

function loadJsonFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(json)
		: fs.readFileAsync(pathOrUrl, {encoding: 'utf-8'}).then(JSON.parse)
	// return JSON.parse(fs.readFileSync(pathOrUrl, 'utf8'))
}

function loadYamlFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(text).then(yaml.safeLoad)
		: fs.readFileAsync(pathOrUrl, {encoding: 'utf-8'}).then(yaml.safeLoad)
}

function tryReadFile(path) {
	try {
		return fs.readFileSync(path, {encoding: 'utf-8'})
	} catch (err) {} // eslint-disable-line brace-style, no-empty

	return false
}

function tryReadJsonFile(path) {
	try {
		return JSON.parse(fs.readFileSync(path, {encoding: 'utf-8'}))
	} catch (err) {} // eslint-disable-line brace-style, no-empty

	return false
}

import mkdirp from 'mkdirp'
import yaml from 'js-yaml'
import startsWith from 'lodash/string/startsWith'
import chain from 'lodash/chain/chain'
import find from 'lodash/collection/find'
import map from 'lodash/collection/map'
import path from 'path'

const COURSE_INFO_LOCATION = process.env.COURSE_INFO || pkg.COURSE_INFO || 'https://stolaf.edu/people/rives/courses/info.json'
const AREA_INFO_LOCATION = process.env.AREA_INFO || pkg.AREA_INFO || 'https://stolaf.edu/people/rives/areas/info.json'

function prepareDirs() {
	mkdirp.sync(`${cacheDir}/Courses/`)
	mkdirp.sync(`${cacheDir}/Areas of Study/`)
}

function cache() {
	prepareDirs()

	const priorCourseInfo = tryReadJsonFile(`${cacheDir}/Courses/info.prior.json`) || {}
	const priorAreaInfo = tryReadJsonFile(`${cacheDir}/Areas/info.prior.json`) || {}

	mkdirp.sync(`${cacheDir}/Courses/`)

	const courseInfo = loadJsonFile(COURSE_INFO_LOCATION)
		.then(info => {
			info.files
				.filter(file => !find(priorCourseInfo.files, file))
				.map(file => ({
					...file,
					fullPath: path.normalize(`./${path.join(...COURSE_INFO_LOCATION.split('/').slice(0, -1))}/${file.path}`)}))
				.map(file => ({...file, data: loadFile(file.fullPath)}))
				.forEach(file => {
					file.data.then(data => fs.writeFileSync(`${cacheDir}/Courses/${path.basename(file.path)}`, data))
				})
			return info
		})
		.then(infoFile => {
			let promises = map(infoFile.files, file => file.data)
			Promise.all(promises).then(() => {
				fs.writeFileSync(`${cacheDir}/Courses/info.prior.json`, JSON.stringify(infoFile))

				const infoFileExists = fs.existsSync(`${cacheDir}/Courses/info.json`)
				if (!infoFileExists) {
					fs.writeFileSync(`${cacheDir}/Courses/info.json`, JSON.stringify(infoFile))
				}
			})
		})
		.catch(err => {throw err}) // eslint-disable-line brace-style

	// const areaInfo = loadJsonFile(AREA_INFO_LOCATION)
	// 	.then(info => {
	// 		const priorInfo = priorAreaInfo
	// 		const needCaching = reject(info.files, file => find(priorInfo.files, file))
	// 		console.log(needCaching)
	// 	})
	// 	.catch(err => {throw err}) // eslint-disable-line brace-style

	return courseInfo

	// return Promise.all([courseInfo, areaInfo])
}

function checkForStaleData() {
	prepareDirs()

	const courseInfo = tryReadJsonFile(`${cacheDir}/Courses/info.json`)

	if (!courseInfo) {
		console.warn('Need to cache courses')
		return cache()
	}

	return Promise.resolve(true)
}

function update() {
	// grab info.json
	// apply loadData's algorithm to it
	return cache()
}

import table from 'text-table'
function printCourse(options) {
	return course => {
		if (options.list) {
			return [`${course.year}.${course.semester}`, `${course.depts.join('/')} ${course.num}${course.section ? `[${course.section}]` : ''}${course.type && course.type !== 'Research' ? ' (' + course.type + ')' : ''}`, `${course.name}${course.title && course.title !== course.name ? ` [${course.title}]` : ''}`]
		}
		else {
			console.log(
`# ${course.name} (${course.year}.${course.semester})
${course.depts.join('/')} ${course.num}${(course.section || '').toLowerCase()}

Instructors: ${course.instructors}

${course.desc || ''}
`)
		}
	}
}

import flatten from 'lodash/array/flatten'
import filter from 'lodash/collection/filter'
import forEach from 'lodash/collection/forEach'
import uniq from 'lodash/array/uniq'
import isString from 'lodash/lang/isString'
import sortByAll from 'lodash/collection/sortByAll'
function search({riddles, unique, sort, ...opts}={}) {
	// console.warn(`searched for ${JSON.stringify(riddle, null)}`)
	// check if data has been cached
	checkForStaleData().then(() => {
		let base = `${cacheDir}/Courses/`
		let files = flatten(map(fs.readdirSync(base),  fn => tryReadJsonFile(path.join(base, fn))))

		riddles	= riddles.map(r => isString(r) ? (quacksLikeDeptNum(r) ? splitDeptNum(r) : r) : r)

		let filtered = files
		forEach(riddles, riddle => {
			filtered = filter(filtered, riddle)
		})

		if (unique) {
			filtered = uniq(filtered, unique)
		}

		if (sort) {
			filtered = sortByAll(filtered, flatten(sort))
		}

		if (opts.list) {
			console.log(table(map(filtered, printCourse(opts))))
		}
		else {
			forEach(filtered, printCourse(opts))
		}
	})
}

export function cli() {
	nom.command('check')
		.callback(check)
		.help('check a student')

	nom.command('lint')
		.callback(lint)
		.help('lint (syntax-check) an area file')

	nom.command('update')
		.callback(update)
		.help('update local data cache')

	nom.command('search')
		.callback(search)
		.help('search for a course')
		.option('list', {
			flag: true,
			default: true,
			help: 'Print matching courses in a list',
		})
		.option('unique', {
			flag: false,
			metavar: 'KEY',
			type: 'string',
			transform: yaml.safeLoad,
			help: 'Run a uniqing filter over the list of found courses, based on the given key',
		})
		.option('riddles', {
			type: 'string',
			required: true,
			list: true,
			position: 1,
			transform: yaml.safeLoad,
			help: 'A YAML-encoded filtering object. Passed to lodash.filter',
		})
		.option('sort', {
			type: 'string',
			list: true,
			flag: false,
			metavar: 'KEY',
			default: 'year',
			transform: yaml.safeLoad,
			help: 'A key/array of keys to sort the courses by',
		})

	nom.option('version', {
		string: '-v, --version',
		flag: true,
		help: 'print version and exit',
		callback: () => pkg.version,
	})

	nom.option('debug', {
		string: '-d, --debug',
		flag: true,
		help: 'print debugging information',
	})

	const args = nom.parse()

	if (args.debug) {
		console.log(args)
	}
}
