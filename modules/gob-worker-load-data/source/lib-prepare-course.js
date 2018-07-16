// @flow

import flatMap from 'lodash/flatMap'
import {splitParagraph} from '@gob/lib'

export default function prepareCourse(course: any) {
	const nameWords = splitParagraph(course.name)
	const summaryWords = splitParagraph(course.summary || '')
	const commentsWords = (course.comments || []).map(str => splitParagraph(str))

	return {
		words: [...new Set([...nameWords, ...commentsWords, ...summaryWords])],
		profWords: [...new Set(flatMap(course.instructors, splitParagraph))],
		term: `${course.year}${course.semester}`,
	}
}
