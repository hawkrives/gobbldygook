import mkdirp from 'mkdirp'
import find from 'lodash/find'
import some from 'lodash/some'
import startsWith from 'lodash/startsWith'
import path from 'path'

import {
	tryReadJsonFile,
	loadFile,
	loadJsonFile,
} from './read-file'
import {cacheDir} from './dirs'

import Promise from 'bluebird'
import fsCallbacks from 'graceful-fs'
const fs = Promise.promisifyAll(fsCallbacks)

const COURSE_INFO_LOCATION = process.env.COURSE_INFO || 'https://stolaf.edu/people/rives/courses/info.json'
// const AREA_INFO_LOCATION = process.env.AREA_INFO || 'https://stolaf.edu/people/rives/areas/info.json'

const COURSES_ARE_REMOTE = startsWith(COURSE_INFO_LOCATION, 'https')
// const AREAS_ARE_REMOTE = startsWith(AREA_INFO_LOCATION, 'https')

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

	let location = COURSE_INFO_LOCATION
	if (COURSES_ARE_REMOTE) {
		location = COURSE_INFO_LOCATION.replace('https://', '')
	}
	const base = path.join(...location.split('/').slice(0, -1))

	const infoFiles = courseInfo.files
		.filter(file => {
			const oldEntry = find(priorCourseInfo.files, file)
			return Boolean(oldEntry) && (oldEntry.hash === file.hash)
		})
		.map(file => {
			let fullPath = path.normalize(`${base}/${file.path}`)
			if (COURSES_ARE_REMOTE) {
				fullPath = `https://${fullPath}`
			}

			return {
				...file,
				fullPath,
				data: loadFile(fullPath),
			}
		})


	await Promise.all(infoFiles.map(async file => {
		return await fs.writeFileAsync(`${cacheDir}/Courses/${path.basename(file.path)}`, await file.data)
	}))

	await fs.writeFileAsync(`${cacheDir}/Courses/info.prior.json`, JSON.stringify(courseInfo))

	const infoFileExists = fs.existsSync(`${cacheDir}/Courses/info.json`)
	if (!infoFileExists) {
		fs.writeFileSync(`${cacheDir}/Courses/info.json`, JSON.stringify(courseInfo))
	}

	return Promise.all([courseInfo])
}

export async function checkForStaleData() {
	prepareDirs()

	const newCourseInfo = await loadJsonFile(COURSE_INFO_LOCATION)
	const courseInfo = tryReadJsonFile(`${cacheDir}/Courses/info.json`)

	if (!courseInfo) {
		console.warn('Need to cache courses (no courseInfo file)')
		await cache()
	}

	const needsUpdate = some(newCourseInfo.files, file => {
		const oldEntry = find(courseInfo.files, file)
		const isCached = fs.existsSync(`${cacheDir}/Courses/${path.basename(file.path)}`)
		return (Boolean(oldEntry) && (oldEntry.hash !== file.hash)) || !isCached
	})

	if (needsUpdate) {
		console.warn('Need to cache courses (out of date)')
		await cache()
	}
}
