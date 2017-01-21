// @flow
import props from 'p-props'
import flatten from 'lodash/flatten'
import {AuthError, NetworkError} from 'modules/lib'
import {fetchHtml} from './lib'
import {extractTermList} from './term-list'
import {collectAllCourses} from './courses'
import {getGraduationInformation} from './graduation-info'
import {COURSES_URL, DEGREE_AUDIT_URL} from './urls'


function loadPages(studentId) {
	return props({
		id: studentId,
		coursesDom: fetchHtml(COURSES_URL),
		auditDom: fetchHtml(DEGREE_AUDIT_URL),
	})
}


function beginDataExtraction({id, coursesDom, auditDom}) {
	let terms = extractTermList(coursesDom)

	return props({
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


export function getStudentInfo(studentId) {
	if (!navigator.onLine) {
		return Promise.reject(new NetworkError('The network is offline.'))
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
