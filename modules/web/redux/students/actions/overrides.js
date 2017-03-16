// @flow
import { SET_OVERRIDE, REMOVE_OVERRIDE } from '../constants'

export function setOverride(studentId: string, key: string, value: boolean) {
    return { type: SET_OVERRIDE, payload: { studentId, key, value } }
}
export function removeOverride(studentId: string, overridePath: string) {
    return {
        type: REMOVE_OVERRIDE,
        payload: { studentId, override: overridePath },
    }
}
