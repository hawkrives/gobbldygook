import filter from 'lodash/collection/filter'
import flatten from 'lodash/array/flatten'
import forEach from 'lodash/collection/forEach'
import forOwn from 'lodash/object/forOwn'
import map from 'lodash/collection/map'
import mapKeys from 'lodash/object/mapKeys'
import parseHtml from './parse-html'
import partition from 'lodash/collection/partition'
import unzip from 'lodash/array/unzip'
import zipObject from 'lodash/array/zipObject'
import {AuthError, NetworkError} from './errors'
import {selectAll, selectOne} from 'css-select'
import {status, text, classifyFetchErrors} from './fetch-helpers'

const COURSES_URL = 'https://www.stolaf.edu/sis/st-courses.cfm'
const DEGREE_AUDIT_URL = 'https://www.stolaf.edu/sis/st-degreeaudit.cfm'

const fetch = (url, args={}) => global.fetch(url, {cache: 'no-cache', credentials: 'same-origin', mode: 'same-origin', ...args}).catch(classifyFetchErrors)
const fetchHtml = (...args) => fetch(...args).then(status).then(text).then(html)


function html(text) {
	return parseHtml(text)
}

function buildFormData(obj) {
	let formData = new FormData()
	forOwn(obj, (val, key) => {
		formData.append(key, val)
	})
	return formData
}

function getText(elems) {
	return getTextItems(elems).join('')
}

function getTextItems(elems) {
	if (elems.children) {
		elems = elems.children
	}
	if (!elems) {
		return []
	}

	let ret = []

	forEach(elems, elem => {
		if (elem.type === 'text') {
			ret = ret.concat(elem.data.trim())
		}
		else if (elem.children && elem.type !== 'comment') {
			ret = ret.concat(getText(elem.children))
		}
	})

	return ret.filter(s => s.length)
}

function removeInternalWhitespace(text) {
	return text.split(/\s+/).join(' ')
}


export function extractTermList(dom) {
	const termSelector = selectOne('[name=searchyearterm]', dom)
	if (termSelector === null) {
		return []
	}

	const options = selectAll('option', termSelector)
	if (!options.length) {
		return []
	}

	return options.map(opt => Number(opt.attribs.value))
}


export function extractStudentId(dom) {
	let idElement = selectOne('[name=stnum]', dom)
	if (!idElement) {
		return null
	}
	return Number(idElement.attribs.value)
}


function convertRowToCourse(term, sisRow) {
	// the columns go: deptnum, lab, name, halfsemester, credits, passfail, gereqs, times, locations, instructors

	let tableRow = selectAll('> td', sisRow)
	let clbid = Number(selectOne('.sis-coursename > a', sisRow).attribs.href.replace(/JavaScript:sis_coursedesc\('(\d*)'\);/, '$1'))

	return {
		term,
		clbid,
		deptnum: removeInternalWhitespace(getText(tableRow[0])),
		lab: getText(tableRow[1]) === 'L' ? true : false,
		name: getText(tableRow[2]),
		// halfsemester: tableRow[3],
		credits: Number(getText(tableRow[4])),
		gradetype: getText(tableRow[5]),
		gereqs: getTextItems(tableRow[6]) || [],
		times: getTextItems(tableRow[7]).map(removeInternalWhitespace) || [],
		locations: getTextItems(tableRow[8]) || [],
		instructors: getTextItems(tableRow[9]) || [],
	}
}


export function getCoursesFromHtml(dom, term) {
	let courseRows = selectAll('.sis-line1, .sis-line2', dom)

	if (!courseRows.length) {
		return []
	}

	return courseRows.map(row => convertRowToCourse(term, row))
}


function getCourses(studentId, term) {
	let formData = buildFormData({stnum: studentId, searchyearterm: term})

	return fetchHtml(COURSES_URL, {method: 'POST', body: formData})
		.then(response => getCoursesFromHtml(response, term))
}


function collectAllCourses(studentId, terms) {
	return Promise.all(map(terms, term => getCourses(studentId, term)))
}

function extractInformationFromDegreeAudit(auditInfo, infoTable) {
	let [degreeType] = getText(selectOne('h3', auditInfo)).match(/B\.[AM]\./)
	if (degreeType === 'B.A.') {
		degreeType = 'Bachelor of Arts'
	}
	else if (degreeType === 'B.M.') {
		degreeType = 'Bachelor of Music'
	}

	let [info, areas] = selectAll('table table', infoTable)

	let infoText = map(selectAll('td', info), getText)
	let infoKeysValues = partition(infoText, (_, i) => !(i % 2))
	info = zipObject(unzip(infoKeysValues))
	info = mapKeys(info, (val, key) => key.replace(':', '').toLowerCase())

	info.advisor = info.advisor.replace(/\s-.*/, '')
	info.graduation = Number(info['class year'])
	delete info['class year']
	info.matriculation = Number(info['curriculum year'])
	delete info['curriculum year']

	areas = map(selectAll('td', areas), getText)
	let majors         = filter(areas, (item, i) => i % 3 === 0 && item.length)
	let emphases       = filter(areas, (item, i) => i % 3 === 1 && item.length)
	let concentrations = filter(areas, (item, i) => i % 3 === 2 && item.length)

	return {
		...info,
		degree: degreeType,
		majors,
		emphases,
		concentrations,
	}
}

export function getGraduationInformation(dom) {
	// #bigbodymainstyle
	//   table (top navigation)
	//   form
	//   form
	//   table (side navigation)
	//   td (degree audits)
	//     table (a thing?)
	//     div.noprint (header + navigation dropdown)
	//     a[name=degree1] (the anchor for the first degree)
	//     table[width=100%] (the ehader for the degree audit – B.A. Degree Audit for Name)
	//     p
	//       font
	//         b (responsibility paragraph)
	//         <text> ("this is an unofficial audit")
	//         p
	//           table
	//             tr
	//               td
	//                 table
	//                   tr
	//                     td
	//                       table
	//                         tr
	//                           td, td (name, student name)
	//                         tr
	//                           td, td (advisor, name)
	//                         tr
	//                           td, td (class year, year)
	//                         tr
	//                           td, td (curriculum year, year)
	//                         tr
	//                           td, td (academic standing, quality)
	//                     td
	//                       table
	//                         tr
	//                           th ("Majors")
	//                           th ("Emphases")
	//                           th ("Concentrations")
	//                         tr (this row is repeated as many times as needed)
	//                           td (major)
	//                           td (emphasis)
	//                           td (concentration)

	let elements = selectAll('#bigbodymainstyle > td:first-of-type > *', dom)
	let tagNames = elements.map(el => el.name)

	let degree1AnchorIndex = tagNames.indexOf('a')
	let degree1AuditInfo = elements[degree1AnchorIndex+2]
	let degree1InfoTable = elements[degree1AnchorIndex+3]
	let degree1 = extractInformationFromDegreeAudit(degree1AuditInfo, degree1InfoTable)

	tagNames = tagNames.splice(degree1AnchorIndex)
	let degree2
	if (tagNames.indexOf('a') > 0) {
		let degree2AnchorIndex = tagNames.indexOf('a') + degree1AnchorIndex
		let degree2AuditInfo = elements[degree2AnchorIndex+2]
		let degree2InfoTable = elements[degree2AnchorIndex+3]
		degree2 = extractInformationFromDegreeAudit(degree2AuditInfo, degree2InfoTable)
	}

	return [degree1, degree2]
}


export function checkIfLoggedIn() {
	return fetchHtml(COURSES_URL).then(response => {
		let errorMsg = selectOne('.sis-error', response)
		let badMsg = 'Sorry, your session has timed out; please login again.'
		if (errorMsg && getText(errorMsg) === badMsg) {
			throw new AuthError('Not logged in. Please log into the SIS in another tab, then try again.')
		}
		else if (errorMsg) {
			throw new Error(errorMsg)
		}
		return response
	})
}


function loadPages(dom) {
	return Promise.all([dom, fetchHtml(DEGREE_AUDIT_URL)])
}


function beginDataExtraction([coursesDom, degreeAuditDom]) {
	let studentId = extractStudentId(coursesDom)
	let terms = extractTermList(coursesDom)

	return Promise.all([
		collectAllCourses(studentId, terms),
		getGraduationInformation(degreeAuditDom),
	])
}


function flattenData([coursesByTerm, studentInfo]) {
	return {
		courses: flatten(coursesByTerm),
		...studentInfo,
	}
}


export default function getStudentInfo() {
	if (!navigator.onLine) {
		return Promise.reject(new NetworkError('The network is offline.'))
	}

	return checkIfLoggedIn()
		.then(loadPages)
		.then(beginDataExtraction)
		.then(flattenData)
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
