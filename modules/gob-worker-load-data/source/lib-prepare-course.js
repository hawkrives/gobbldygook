// @flow

import flatMap from 'lodash/flatMap'
import {buildDeptNum} from '@gob/school-st-olaf-college'
import {splitParagraph} from '@gob/lib'

export default function prepareCourse(course: any) {
	const profWords = new Set(flatMap(course.instructors, splitParagraph))
	const allWords = new Set([
		...splitParagraph(course.name),
		...splitParagraph((course.notes || []).join('\n')),
		...splitParagraph(course.title || ''),
		...splitParagraph((course.description || []).join('\n')),
	])

	return {
		deptnum: buildDeptNum(course),
		words: [...allWords],
		profWords: [...profWords],
	}
}
