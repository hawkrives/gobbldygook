import mapValues from 'lodash/mapValues'
import props from 'p-props'
import { getCourse } from './get-courses'
import { alterCourse } from './alter-course-for-evaluation'

export function fulfillFulfillments(student, { cache = [] }) {
    let promises = mapValues(
        student.fulfillments,
        clbid => cache[clbid] || getCourse({ clbid }, student.fabrications)
    )
    return props(promises).then(result =>
        mapValues(result, r => {
            return {
                $type: 'course',
                $course: alterCourse(r),
                _isFulfillment: true,
            }
        })
    )
}
