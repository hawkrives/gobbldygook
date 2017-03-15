import { ADD_AREA, REMOVE_AREA, REMOVE_AREAS } from '../constants'

export function addArea(studentId, area) {
    return { type: ADD_AREA, payload: { studentId, area } }
}
export function removeArea(studentId, areaQuery) {
    return { type: REMOVE_AREA, payload: { studentId, areaQuery } }
}
export function removeAreas(studentId, ...areaQueries) {
    return { type: REMOVE_AREAS, payload: { studentId, areaQueries } }
}
