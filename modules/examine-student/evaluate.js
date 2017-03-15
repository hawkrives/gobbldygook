// @flow
import assertKeys from './assert-keys'
import compute from './compute'
import type { Course, AreaOfStudy, OverridesObject, FulfillmentsObject } from './types'

export function evaluate({ courses=[], overrides={}, fulfilled={} }: {
  courses: Course[],
  overrides: OverridesObject,
  fulfilled: FulfillmentsObject,
}, area: AreaOfStudy) {
    assertKeys(area, 'name', 'result', 'type', 'revision')
    const { name, type } = area
    return compute(area, { path: [type, name], courses, overrides, fulfillments: fulfilled })
}
