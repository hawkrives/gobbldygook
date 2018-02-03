// @flow
import assertKeys from './assert-keys'
import compute from './compute'
import type {
    Course,
    AreaOfStudy,
    OverridesObject,
    FulfillmentsObject,
} from './types'

type Input = {
    courses: Course[],
    overrides: OverridesObject,
    fulfilled: FulfillmentsObject,
}

export function evaluate(student: Input, area: AreaOfStudy) {
    assertKeys(area, 'name', 'result', 'type', 'revision')
    const {name, type} = area
    const {courses = [], overrides = {}, fulfilled = {}} = student
    return compute(area, {
        path: [type, name],
        courses,
        overrides,
        fulfillments: fulfilled,
    })
}
