import { ADD_FABRICATION, REMOVE_FABRICATION } from '../constants'

export function addFabrication(studentId, fabrication) {
    return { type: ADD_FABRICATION, payload: { studentId, fabrication } }
}
export function removeFabrication(studentId, fabricationId) {
    return { type: REMOVE_FABRICATION, payload: { studentId, fabricationId } }
}
