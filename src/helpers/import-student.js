const Bluebird = require('bluebird')
import {filter, flatten, forEach, forOwn, fromPairs, includes, map, mapKeys, uniq, unzip} from 'lodash-es'
import parseHtml from './parse-html'
import partitionByIndex from './partition-by-index'
import {AuthError, NetworkError} from './errors'
import {status, text, classifyFetchErrors} from './fetch-helpers'
const {selectAll, selectOne} = require('css-select')

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


export function extractStudentIds(dom) {
	let idElements = selectAll('[name=stnum]', dom)
	return uniq(map(filter(idElements, el => el), el => Number(el.attribs.value)))
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
	return Bluebird.all(map(terms, term => getCourses(studentId, term)))
}

function extractInformationFromInfoTable(table) {
	// So "info" is the first table; it's essentially key-value pairs, in column-row fashion.
	// We start out by grabbing all <td> elements under "info"
	let infoText = map(selectAll('td', table), getText)
	// Next, because they're k/v pairs, we want to group them into two arrays: keys, and values.
	// `partition` groups elements of an array into two arrays based on the predicate function, which we've built around the index.
	let infoKeysValues = partitionByIndex(infoText)
	// The fromPairs(unzip()) dance builds an object from the k/v paired arrays.
	// `unzip` turns the [[keys], [values]] array into [[k,v], [k,v], ...], which `fromPairs` turns into an object.
	let info = fromPairs(unzip(infoKeysValues))
	// `mapKeys` purpose is to remove the ':' from the end of the keys, and to lower-case the keys.
	info = mapKeys(info, (val, key) => key.replace(':', '').toLowerCase())

	// The advisor's name also includes their department. We don't care about the department, so we remove it.
	info.advisor = info.advisor.replace(/\s-\s.*/, '')

	// Now we're just cleaning up some of the longer key names.
	info.graduation = Number(info['class year'])
	delete info['class year']
	info.matriculation = Number(info['curriculum year'])
	delete info['curriculum year']

	return info
}

function extractInformationFromAreaTable(table) {
	// Alright! Now we're going to grab all <td> elements from the "areas" table.
	let areas = map(selectAll('td', table), getText)

	// This table is organized into rows.
	// The number of rows is equal to the largest category of areas.
	// If you have three majors, and one concentration, there will be three rows.
	// If you have one major, and onetwo concentrations, there will be two rows.

	// Thus, we go through here and split out the items based on their index.
	// (also, we remove any 0-length strings, because we don't care about them.)
	let majors         = filter(areas, (item, i) => i % 3 === 0 && item.length)
	let emphases       = filter(areas, (item, i) => i % 3 === 1 && item.length)
	let concentrations = filter(areas, (item, i) => i % 3 === 2 && item.length)

	return {
		majors,
		emphases,
		concentrations,
	}
}

function extractInformationFromDegreeAudit(auditInfo, infoElement) {
	let [degreeType] = getText(selectOne('h3', auditInfo)).match(/B\.[AM]\./)
	if (degreeType === 'B.A.') {
		degreeType = 'Bachelor of Arts'
	}
	else if (degreeType === 'B.M.') {
		degreeType = 'Bachelor of Music'
	}

	// There are two tables that are children of another table
	// yay, tables for layout.
	let [infoTable, areaTable] = selectAll('table table', infoElement)

	let info = extractInformationFromInfoTable(infoTable)
	let areas = extractInformationFromAreaTable(areaTable)

	return {
		...info,
		...areas,
		degree: degreeType,
	}
}

export function getGraduationInformation(dom) {
	// #bigbodymainstyle
	//   table  (top navigation)
	//   form
	//   form
	//   table  (side navigation)
	//   td  (degree audits)
	//     table  (a thing?)
	//     div.noprint  (header + navigation dropdown)
	//     a[name=degree1]  (the anchor for the first degree)
	//     table[width=100%]  (the header for the degree audit – B.A. Degree Audit for Name)
	//       tr > td > h3
	//     p  (info table)
	//       font
	//         b  (responsibility paragraph)
	//         <text>  ("this is an unofficial audit")
	//         p
	//           table
	//             tr
	//               td
	//                 table
	//                   tr
	//                     td, td  (name, student name)
	//                   tr
	//                     td, td  (advisor, name)
	//                   tr
	//                     td, td  (class year, year)
	//                   tr
	//                     td, td  (curriculum year, year)
	//                   tr
	//                     td, td  (academic standing, quality)
	//               td
	//                 table
	//                   tr
	//                     th  ("Majors")
	//                     th  ("Emphases")
	//                     th  ("Concentrations")
	//                   tr  (this row is repeated as many times as needed)
	//                     td  (major)
	//                     td  (emphasis)
	//                     td  (concentration)

	// htmlparser2 appears to have a different algorithm for correcting HTML than browsers do.
	// Thus, the <td> that we want isn't contained within the table, but within the container div itself.
	// Se we'll just collect everything underneath it.
	let elements = selectAll('#bigbodymainstyle > td:first-of-type > *', dom)
	let tagNames = elements.map(el => el.name)

	let degrees = []
	// I believe that, if you have two degrees, there are two anchors: degree1 and degree2.
	while (includes(tagNames, 'a')) {
		let degreeAnchorIndex = tagNames.indexOf('a')
		let degreeAuditInfo = elements[degreeAnchorIndex+2]
		let degreeInfoTable = elements[degreeAnchorIndex+3]
		let degree = extractInformationFromDegreeAudit(degreeAuditInfo, degreeInfoTable)
		degrees.push(degree)

		// Once we've collected a degree, we remove every tag name up past the index of the currect <a>.
		tagNames = tagNames.slice(degreeAnchorIndex + 1)
		elements = elements.slice(degreeAnchorIndex + 1)
		// If there's another degree, then let's do it again!
	}

	return degrees
}


export function checkIfLoggedIn() {
	if (typeof window !== 'undefined' && window.location.hostname !== 'www.stolaf.edu') {
		return Bluebird.reject(new AuthError('Wrong domain. Student import will only work under the www.stolaf.edu domain.'))
	}
	return fetchHtml(COURSES_URL).then(response => {
		let errorMsg = selectOne('.sis-error', response)
		let badMsg = 'Sorry, your session has timed out; please login again.'
		if (errorMsg && getText(errorMsg) === badMsg) {
			throw new AuthError('Not logged in. Please log into the SIS in another tab, then try again.')
		}
		else if (errorMsg) {
			throw new Error(errorMsg)
		}
		return extractStudentIds(response)
	})
}


function loadPages(studentId) {
	return Bluebird.props({
		id: studentId,
		coursesDom: fetchHtml(COURSES_URL),
		auditDom: fetchHtml(DEGREE_AUDIT_URL),
	})
}


function beginDataExtraction({id, coursesDom, auditDom}) {
	let terms = extractTermList(coursesDom)

	return Bluebird.props({
		coursesByTerm: collectAllCourses(id, terms),
		studentInfo: getGraduationInformation(auditDom),
	})
}


function flattenData({coursesByTerm, studentInfo}) {
	return {
		courses: flatten(coursesByTerm),
		degrees: studentInfo,
	}
}


export default function getStudentInfo(studentId) {
	if (!navigator.onLine) {
		return Bluebird.reject(new NetworkError('The network is offline.'))
	}

	return loadPages(studentId)
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
