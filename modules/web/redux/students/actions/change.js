import {
	CHANGE_NAME,
	CHANGE_ADVISOR,
	CHANGE_CREDITS_NEEDED,
	CHANGE_MATRICULATION,
	CHANGE_GRADUATION,
	CHANGE_SETTING,
} from '../constants'

export function changeName(studentId, name) {
  return { type: CHANGE_NAME, payload: { studentId, name } }
}
export function changeAdvisor(studentId, advisor) {
  return { type: CHANGE_ADVISOR, payload: { studentId, advisor } }
}
export function changeCreditsNeeded(studentId, credits) {
  return { type: CHANGE_CREDITS_NEEDED, payload: { studentId, credits } }
}
export function changeMatriculation(studentId, matriculation) {
  return { type: CHANGE_MATRICULATION, payload: { studentId, matriculation } }
}
export function changeGraduation(studentId, graduation) {
  return { type: CHANGE_GRADUATION, payload: { studentId, graduation } }
}
export function changeSetting(studentId, key, value) {
  return { type: CHANGE_SETTING, payload: { studentId, key, value } }
}
