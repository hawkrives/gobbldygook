import { loadStudent as load } from "../../../helpers/load-student"

import { LOAD_STUDENT } from "../constants"

export function loadStudent(id: string) {
  return { type: LOAD_STUDENT, payload: load(id) }
}
