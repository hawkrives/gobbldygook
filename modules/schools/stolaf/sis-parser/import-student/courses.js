import Bluebird from 'bluebird'
import {map} from 'lodash'
import {
	fetchHtml,
	getText,
	removeInternalWhitespace,
	getTextItems,
} from './lib'
import {selectAll, selectOne} from 'css-select'
import {COURSES_URL} from './urls'

function convertRowToCourse(term, sisRow) {
	// the columns go: deptnum, lab, name, halfsemester, credits, passfail, gereqs, times, locations, instructors

	let tableRow = selectAll('> td', sisRow)
	let clbid = Number(selectOne('.sis-coursename > a', sisRow).attribs.href.replace(/JavaScript:sis_coursedesc\('(\d*)'\);/, '$1'))

	return {
		term,
		clbid,
		deptnum: removeInternalWhitespace(getText(tableRow[0])),
		lab: getText(tableRow[1]) === 'L',
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
	const body = {
		stnum: studentId,
		searchyearterm: term,
	}
	return fetchHtml(COURSES_URL, {method: 'POST'}, body)
		.then(response => getCoursesFromHtml(response, term))
}


export function collectAllCourses(studentId, terms) {
	return Bluebird.all(map(terms, term => getCourses(studentId, term)))
}
