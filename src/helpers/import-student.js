import cheerio from 'cheerio'
import flatten from 'lodash/array/flatten'
import map from 'lodash/collection/map'
import forOwn from 'lodash/object/forOwn'
import {status, text, classifyFetchErrors} from './fetch-helpers'
import {AuthError, NetworkError} from './errors'

const COURSES_URL = 'https://www.stolaf.edu/sis/st-courses.cfm'

const fetch = (url, args={}) => global.fetch(url, {cache: 'no-cache', credentials: 'same-origin', mode: 'same-origin', ...args}).catch(classifyFetchErrors)
const fetchHtml = (...args) => fetch(...args).then(status).then(text).then(html)


function html(text) {
	return cheerio.load(text)
}

function buildFormData(obj) {
	let formData = new FormData()
	forOwn(obj, (val, key) => {
		formData.append(key, val)
	})
	return formData
}

function getItemsFromCell(sisCell) {
	return Array.from(sisCell.children())
		.map(item => item.text().trim())
		.filter(item => item.length)
}

function removeInternalWhitespace(text) {
	return text.replace(/\s+/, ' ')
}


function extractTermList(html) {
	let termSelector = html('[name=searchyearterm]')[0]
	if (!termSelector) {
		return []
	}
	return Array.from(termSelector.attr('options')).map(opt => Number(opt.value))
}


function extractStudentId(html) {
	let idElement = html('[name=stnum]')[0]
	if (!idElement) {
		return null
	}
	return Number(idElement.text().trim())
}


function convertRowToCourse(term, sisRow) {
	// the columns go: deptnum, lab, name, halfsemester, credits, passfail, gereqs, times, locations, instructors

	// returns a string like 20151 CSCI 273 L
	// wait, what returns this string?

	let tableRow = sisRow.children()
	return {
		term: term,
		deptnum: removeInternalWhitespace(tableRow[0].text().trim()),
		lab: tableRow[1].text().trim() === 'L' ? true : false,
		name: tableRow[2].text().trim(),
		// halfsemester: tableRow[3],
		credits: Number(tableRow[4].text().trim()),
		gradetype: tableRow[5].text().trim(),
		gereqs: getItemsFromCell(tableRow[6]) || [],
		times: getItemsFromCell(tableRow[7]).map(removeInternalWhitespace) || [],
		locations: getItemsFromCell(tableRow[8]) || [],
		instructors: getItemsFromCell(tableRow[9]) || [],
	}
}


function getCoursesFromHtml(html, term) {
	let courseRows = Array.from(html('.sis-tblheader').parent().children()).slice(2, -1)

	if (!courseRows) {
		return []
	}

	return Array.from(courseRows).map(row => convertRowToCourse(term, row))
}


function getCourses(studentId, term) {
	let formData = buildFormData({stnum: studentId, searchyearterm: term})

	return fetchHtml(COURSES_URL, {method: 'POST', body: formData})
		.then(response => getCoursesFromHtml(response, term))
}



export function checkIfLoggedIn() {
	return fetchHtml(COURSES_URL).then(response => {
		let errorMsg = response('.sis-error')[0]
		let badMsg = 'Sorry, your session has timed out; please login again.'
		if (errorMsg && errorMsg.text().trim() === badMsg) {
			throw new AuthError('Not logged in. Please log into the SIS in another tab, then try again.')
		}
		else if (errorMsg) {
			throw new Error(errorMsg)
		}
		return response
	})
}


export function getStudentCourses() {
	if (!navigator.onLine) {
		return Promise.reject(new NetworkError('The network is offline.'))
	}

	return checkIfLoggedIn()
		.then(html => {
			let studentId = extractStudentId(html)
			let terms = extractTermList(html)
			return Promise.all(map(terms, term => getCourses(studentId, term)))
		})
		.then(coursesByTerm => flatten(coursesByTerm))
		.catch(err => {
			if (err instanceof AuthError) {
				throw new AuthError('Could not log in to the SIS.')
			}
			if (err instanceof NetworkError) {
				throw new NetworkError('Could not reach the SIS.')
			}
			throw err
		})
}
