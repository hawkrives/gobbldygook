// @flow
import map from 'lodash/map'
import filter from 'lodash/filter'
import debug from 'debug'

import { evaluate } from '../../../../examine-student/evaluate'
import { getActiveStudentCourses } from '../../get-active-student-courses'
import { alterCourse } from '../../alter-course-for-evaluation'
const log = debug('worker:check-student:worker')

function tryEvaluate(student, area) {
    try {
        return evaluate(student, area)
    } catch (err) {
        log('checkStudentAgainstArea:', err)
        return { ...area, _error: err.message }
    }
}

export default function checkStudentAgainstArea(student: any, area: any) {
    return new Promise(resolve => {
        if (!area || area._error || !area._area) {
            log(
                'checkStudentAgainstArea:',
                area ? area._error : 'area is null',
                area
            )
            resolve(area)
            return
        }

        student.courses = map(getActiveStudentCourses(student), alterCourse)

        let details = tryEvaluate(student, area._area)
        if (details._error) {
            resolve(details)
            return
        }

        let result = details.result
        let bits = []
        if (result.$type === 'of') {
            bits = result.$of
        } else if (
            result.$type === 'boolean' &&
            result.$booleanType === 'and'
        ) {
            bits = result.$and
        } else if (result.$type === 'boolean' && result.$booleanType === 'or') {
            bits = result.$or
        }
        let finalReqs = map(bits, b => b._result)

        const maxProgress = finalReqs.length
        const currentProgress = filter(finalReqs, Boolean).length

        resolve({
            ...area,
            _area: details,
            _checked: true,
            _progress: {
                at: currentProgress,
                of: maxProgress,
            },
        })
    })
}
