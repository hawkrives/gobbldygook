import {
	SET_OVERRIDE,
	REMOVE_OVERRIDE,
} from '../constants'

export function setOverride(studentId, key, value) {
  return { type: SET_OVERRIDE, payload: { studentId, key, value } }
}
export function removeOverride(studentId, overridePath) {
  return { type: REMOVE_OVERRIDE, payload: { studentId, override: overridePath } }
}
