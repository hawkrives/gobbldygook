import mkdirp from 'mkdirp'
import find from 'lodash/collection/find'
import path from 'path'

import {
	tryReadJsonFile,
	loadJsonFile,
	loadFile,
} from './read-file'
import {cacheDir} from './dirs'

import Promise from 'bluebird'
import fsCallbacks from 'graceful-fs'
const fs = Promise.promisifyAll(fsCallbacks)

import loadPkg from 'load-pkg'
const pkg = loadPkg()
const COURSE_INFO_LOCATION = process.env.COURSE_INFO || pkg.COURSE_INFO || 'https://stolaf.edu/people/rives/courses/info.json'
// const AREA_INFO_LOCATION = process.env.AREA_INFO || pkg.AREA_INFO || 'https://stolaf.edu/people/rives/areas/info.json'

function prepareDirs() {
	mkdirp.sync(`${cacheDir}/Courses/`)
	mkdirp.sync(`${cacheDir}/Areas of Study/`)
}

export async function cache() {
	prepareDirs()

	const priorCourseInfo = tryReadJsonFile(`${cacheDir}/Courses/info.prior.json`) || {}
	// const priorAreaInfo = tryReadJsonFile(`${cacheDir}/Areas/info.prior.json`) || {}

	mkdirp.sync(`${cacheDir}/Courses/`)

	const courseInfo = await loadJsonFile(COURSE_INFO_LOCATION)

	const infoFiles = courseInfo.files
		.filter(file => {
			const oldEntry = find(priorCourseInfo.files, file)
			const hasNotBeenUpdated = (oldEntry.hash === file.hash)
			return Boolean(oldEntry) && hasNotBeenUpdated
		})
		.map(file => ({
			...file,
			fullPath: path.normalize(`${path.join(...COURSE_INFO_LOCATION.split('/').slice(0, -1))}/${file.path}`),
		}))
		.map(file => ({...file, data: loadFile(file.fullPath)}))


	await Promise.all(infoFiles.map(async file => {
		await fs.writeFileAsync(`${cacheDir}/Courses/${path.basename(file.path)}`, await file.data)
	}))

	await fs.writeFileAsync(`${cacheDir}/Courses/info.prior.json`, JSON.stringify(courseInfo))

	const infoFileExists = fs.existsSync(`${cacheDir}/Courses/info.json`)
	if (!infoFileExists) {
		fs.writeFileSync(`${cacheDir}/Courses/info.json`, JSON.stringify(courseInfo))
	}

	return Promise.all([courseInfo])
}

export function checkForStaleData() {
	prepareDirs()

	const courseInfo = tryReadJsonFile(`${cacheDir}/Courses/info.json`)

	if (!courseInfo) {
		console.warn('Need to cache courses')
		return cache()
	}

	const needsUpdate = find(courseInfo.files, file => {
		const oldEntry = find(courseInfo.files, file)
		const hasNotBeenUpdated = (oldEntry.hash === file.hash)
		return Boolean(oldEntry) && hasNotBeenUpdated
	})

	if (needsUpdate) {
		console.warn('Need to cache courses')
		return cache()
	}

	return Promise.resolve(true)
}
