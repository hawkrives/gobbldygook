// @flow

import flatMap from 'lodash/flatMap'
import {buildDeptString, buildDeptNum} from '@gob/school-st-olaf-college'
import {splitParagraph} from '@gob/lib'
import {convertTimeStringsToOfferings} from 'sto-sis-time-parser'

export default function prepareCourse(course: any) {
	const profWords = new Set(flatMap(course.instructors, splitParagraph))
	const allWords = new Set([
		...splitParagraph(course.name),
		...splitParagraph((course.notes || []).join('\n')),
		...splitParagraph(course.title || ''),
		...splitParagraph((course.description || []).join('\n')),
	])

	return {
		name: course.name || course.title,
		dept: course.dept || buildDeptString(course.departments),
		deptnum: course.deptnum || buildDeptNum(course),
		offerings: course.offerings || convertTimeStringsToOfferings(course),
		words: [...allWords],
		profWords: [...profWords],
	}
}
