// @flow

import flatMap from 'lodash/flatMap'
import uniq from 'lodash/uniq'
import {
    buildDeptString,
    buildDeptNum,
} from '../../../../school-st-olaf-college/deptnums'
import { splitParagraph } from '../../../../lib/split-paragraph'
import { convertTimeStringsToOfferings } from 'sto-sis-time-parser'

export default function prepareCourse(course: any) {
    const nameWords = splitParagraph(course.name)
    const notesWords = splitParagraph((course.notes || []).join('\n'))
    const titleWords = splitParagraph(course.title)
    const descWords = splitParagraph((course.description || []).join('\n'))

    return {
        name: course.name || course.title,
        dept: course.dept || buildDeptString(course.departments),
        deptnum: course.deptnum || buildDeptNum(course),
        offerings: course.offerings || convertTimeStringsToOfferings(course),
        words: uniq([...nameWords, ...notesWords, ...titleWords, ...descWords]),
        profWords: uniq(flatMap(course.instructors, splitParagraph)),
    }
}
